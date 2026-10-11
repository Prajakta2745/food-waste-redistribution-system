package com.foodredistribution.service.impl;

import com.foodredistribution.dto.request.AssignVolunteerRequest;
import com.foodredistribution.dto.response.*;
import com.foodredistribution.entity.*;
import com.foodredistribution.enums.*;
import com.foodredistribution.exception.*;
import com.foodredistribution.mapper.DonationMapper;
import com.foodredistribution.mapper.UserMapper;
import com.foodredistribution.repository.*;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.NgoService;
import com.foodredistribution.service.NotificationService;
import com.foodredistribution.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NgoServiceImpl implements NgoService {

    private final FoodDonationRepository donationRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final DonationRequestRepository requestRepository;
    private final PickupRepository pickupRepository;
    private final DonationMapper donationMapper;
    private final UserMapper userMapper;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    private final AuditService auditService;

    private NgoProfile getCurrentNgoProfile() {
        User user = securityUtils.getCurrentUser();
        return ngoProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("NgoProfile", "user", user.getEmail()));
    }

    private void ensureVerifiedNgo(NgoProfile ngo) {
        if (ngo.getVerificationStatus() != VerificationStatus.VERIFIED && ngo.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new UnauthorizedActionException("Your NGO account is pending admin verification. You cannot claim food until verified.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DonationResponse> searchAvailableDonations(String city, FoodCategory category, FoodType foodType, BigDecimal minQuantity, Pageable pageable) {
        ZonedDateTime now = ZonedDateTime.now();
        String cityFilter = (city != null && !city.trim().isEmpty()) ? city.trim() : null;

        Page<FoodDonation> donations = donationRepository.findAvailableDonationsWithFilters(
                DonationStatus.AVAILABLE, cityFilter, category, foodType, minQuantity, now, pageable
        );

        return donations.map(d -> donationMapper.toDonationResponse(d, null));
    }

    @Override
    @Transactional(readOnly = true)
    public DonationResponse getAvailableDonationDetails(Long donationId) {
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("FoodDonation", "id", donationId));

        Pickup pickup = pickupRepository.findByDonation(donation).orElse(null);
        return donationMapper.toDonationResponse(donation, pickup);
    }

    @Override
    @Transactional
    public DonationResponse claimDonation(Long donationId) {
        NgoProfile ngo = getCurrentNgoProfile();
        ensureVerifiedNgo(ngo);

        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("FoodDonation", "id", donationId));

        // Ensure donation is still AVAILABLE
        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new DonationAlreadyAcceptedException("Donation is no longer available. Current status: " + donation.getStatus());
        }

        // Check if donation is expired
        if (donation.getAvailableUntil().isBefore(ZonedDateTime.now())) {
            donation.setStatus(DonationStatus.EXPIRED);
            donationRepository.save(donation);
            throw new BadRequestException("This donation has expired and can no longer be claimed.");
        }

        // Check duplicate request
        if (requestRepository.existsByDonationAndNgo(donation, ngo)) {
            throw new DuplicateRequestException("You have already submitted a request for this donation.");
        }

        // Transition Donation state
        donation.setStatus(DonationStatus.ACCEPTED);
        FoodDonation updatedDonation = donationRepository.save(donation);

        // Record Donation Request
        DonationRequest request = DonationRequest.builder()
                .donation(updatedDonation)
                .ngo(ngo)
                .requestStatus(RequestStatus.ACCEPTED)
                .requestedAt(ZonedDateTime.now())
                .acceptedAt(ZonedDateTime.now())
                .build();
        requestRepository.save(request);

        // Create Pickup record
        Pickup pickup = Pickup.builder()
                .donation(updatedDonation)
                .ngo(ngo)
                .pickupAddress(donation.getPickupAddress() + ", " + donation.getCity() + ", " + donation.getState())
                .deliveryAddress(ngo.getAddress() + ", " + ngo.getCity() + ", " + ngo.getState())
                .status(PickupStatus.PENDING)
                .build();
        Pickup savedPickup = pickupRepository.save(pickup);

        // Send notifications
        if (donation.getProvider() != null && donation.getProvider().getUser() != null) {
            notificationService.createNotification(
                    donation.getProvider().getUser(),
                    "Donation Accepted",
                    "NGO '" + ngo.getOrganizationName() + "' has accepted your donation: " + donation.getFoodName(),
                    "DONATION_STATUS"
            );
        }

        notificationService.createNotification(
                ngo.getUser(),
                "Claim Confirmed",
                "You have successfully claimed '" + donation.getFoodName() + "'. Please assign a volunteer for pickup.",
                "DONATION_STATUS"
        );

        auditService.logAction(ngo.getUser(), "CLAIM_DONATION", "FOOD_DONATION", donation.getId(),
                "NGO " + ngo.getOrganizationName() + " claimed donation: " + donation.getFoodName());

        return donationMapper.toDonationResponse(updatedDonation, savedPickup);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DonationRequestResponse> getMyRequests(Pageable pageable) {
        NgoProfile ngo = getCurrentNgoProfile();
        return requestRepository.findByNgo(ngo, pageable)
                .map(donationMapper::toRequestResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PickupResponse> getMyPickups(Pageable pageable) {
        NgoProfile ngo = getCurrentNgoProfile();
        return pickupRepository.findByNgo(ngo, pageable)
                .map(donationMapper::toPickupResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VolunteerProfileResponse> getAvailableVolunteers() {
        return volunteerProfileRepository.findByVerificationStatusAndAvailabilityStatus(
                VerificationStatus.VERIFIED, VolunteerAvailability.AVAILABLE
        ).stream().map(userMapper::toVolunteerResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PickupResponse assignVolunteerToPickup(Long pickupId, AssignVolunteerRequest req) {
        NgoProfile ngo = getCurrentNgoProfile();
        ensureVerifiedNgo(ngo);

        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", pickupId));

        if (!pickup.getNgo().getId().equals(ngo.getId())) {
            throw new UnauthorizedActionException("You can only assign volunteers to pickups destined for your NGO");
        }

        VolunteerProfile volunteer = volunteerProfileRepository.findById(req.getVolunteerId())
                .orElseThrow(() -> new ResourceNotFoundException("VolunteerProfile", "id", req.getVolunteerId()));

        if (volunteer.getVerificationStatus() != VerificationStatus.VERIFIED && volunteer.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new BadRequestException("Volunteer is not verified and cannot be assigned.");
        }

        pickup.setVolunteer(volunteer);
        pickup.setStatus(PickupStatus.ASSIGNED);
        pickup.setAssignedAt(ZonedDateTime.now());
        if (req.getNotes() != null) {
            pickup.setNotes(req.getNotes());
        }
        Pickup updatedPickup = pickupRepository.save(pickup);

        FoodDonation donation = pickup.getDonation();
        donation.setStatus(DonationStatus.PICKUP_ASSIGNED);
        donationRepository.save(donation);

        // Notify Volunteer
        notificationService.createNotification(
                volunteer.getUser(),
                "New Pickup Assignment",
                "You have been assigned to collect '" + donation.getFoodName() + "' for " + ngo.getOrganizationName(),
                "PICKUP_UPDATE"
        );

        auditService.logAction(ngo.getUser(), "ASSIGN_VOLUNTEER", "PICKUP", updatedPickup.getId(),
                "Assigned volunteer " + volunteer.getUser().getName() + " to pickup #" + updatedPickup.getId());

        return donationMapper.toPickupResponse(updatedPickup);
    }

    @Override
    @Transactional
    public PickupResponse confirmFoodReceived(Long pickupId) {
        NgoProfile ngo = getCurrentNgoProfile();
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", pickupId));

        if (!pickup.getNgo().getId().equals(ngo.getId())) {
            throw new UnauthorizedActionException("You can only confirm receipt for pickups assigned to your NGO");
        }

        if (pickup.getStatus() != PickupStatus.DELIVERED && pickup.getStatus() != PickupStatus.PICKED_UP) {
            throw new BadRequestException("Cannot confirm receipt. Food must be picked up or delivered first. Current status: " + pickup.getStatus());
        }

        ZonedDateTime now = ZonedDateTime.now();
        pickup.setStatus(PickupStatus.COMPLETED);
        pickup.setCompletedAt(now);
        Pickup updatedPickup = pickupRepository.save(pickup);

        FoodDonation donation = pickup.getDonation();
        donation.setStatus(DonationStatus.COMPLETED);
        donationRepository.save(donation);

        // Notify Provider
        if (donation.getProvider() != null && donation.getProvider().getUser() != null) {
            notificationService.createNotification(
                    donation.getProvider().getUser(),
                    "Donation Distributed",
                    "Your food donation '" + donation.getFoodName() + "' was successfully received and completed by " + ngo.getOrganizationName(),
                    "DONATION_STATUS"
            );
        }

        // Notify Volunteer
        if (pickup.getVolunteer() != null && pickup.getVolunteer().getUser() != null) {
            notificationService.createNotification(
                    pickup.getVolunteer().getUser(),
                    "Delivery Confirmed",
                    "The NGO has confirmed receipt of delivery for '" + donation.getFoodName() + "'. Thank you for your service!",
                    "PICKUP_UPDATE"
            );
        }

        auditService.logAction(ngo.getUser(), "CONFIRM_RECEIPT", "PICKUP", updatedPickup.getId(),
                "NGO " + ngo.getOrganizationName() + " confirmed receipt of food donation #" + donation.getId());

        return donationMapper.toPickupResponse(updatedPickup);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        NgoProfile ngo = getCurrentNgoProfile();

        Map<String, Long> metrics = new HashMap<>();
        metrics.put("availableFood", donationRepository.countByStatus(DonationStatus.AVAILABLE));
        metrics.put("requestedDonations", requestRepository.countByNgoAndRequestStatus(ngo, RequestStatus.PENDING));
        metrics.put("acceptedDonations", requestRepository.countByNgoAndRequestStatus(ngo, RequestStatus.ACCEPTED));
        metrics.put("activePickups", pickupRepository.countByNgoAndStatus(ngo, PickupStatus.ASSIGNED)
                + pickupRepository.countByNgoAndStatus(ngo, PickupStatus.ACCEPTED)
                + pickupRepository.countByNgoAndStatus(ngo, PickupStatus.PICKED_UP)
                + pickupRepository.countByNgoAndStatus(ngo, PickupStatus.DELIVERED));
        metrics.put("completedDistributions", pickupRepository.countByNgoAndStatus(ngo, PickupStatus.COMPLETED));

        return DashboardStatsResponse.builder()
                .metrics(metrics)
                .build();
    }
}
