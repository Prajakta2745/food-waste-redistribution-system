package com.foodredistribution.service.impl;

import com.foodredistribution.dto.response.DashboardStatsResponse;
import com.foodredistribution.dto.response.PickupResponse;
import com.foodredistribution.entity.FoodDonation;
import com.foodredistribution.entity.Pickup;
import com.foodredistribution.entity.User;
import com.foodredistribution.entity.VolunteerProfile;
import com.foodredistribution.enums.DonationStatus;
import com.foodredistribution.enums.PickupStatus;
import com.foodredistribution.enums.VerificationStatus;
import com.foodredistribution.enums.VolunteerAvailability;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.exception.UnauthorizedActionException;
import com.foodredistribution.mapper.DonationMapper;
import com.foodredistribution.repository.FoodDonationRepository;
import com.foodredistribution.repository.PickupRepository;
import com.foodredistribution.repository.VolunteerProfileRepository;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.NotificationService;
import com.foodredistribution.service.VolunteerService;
import com.foodredistribution.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class VolunteerServiceImpl implements VolunteerService {

    private final VolunteerProfileRepository volunteerProfileRepository;
    private final PickupRepository pickupRepository;
    private final FoodDonationRepository donationRepository;
    private final DonationMapper donationMapper;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    private final AuditService auditService;

    private VolunteerProfile getCurrentVolunteerProfile() {
        User user = securityUtils.getCurrentUser();
        return volunteerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("VolunteerProfile", "user", user.getEmail()));
    }

    private void ensureVerifiedVolunteer(VolunteerProfile volunteer) {
        if (volunteer.getVerificationStatus() != VerificationStatus.VERIFIED && volunteer.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new UnauthorizedActionException("Your volunteer account is pending admin verification.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PickupResponse> getMyPickups(PickupStatus status, Pageable pageable) {
        VolunteerProfile volunteer = getCurrentVolunteerProfile();
        if (status != null) {
            return pickupRepository.findByVolunteerAndStatus(volunteer, status, pageable)
                    .map(donationMapper::toPickupResponse);
        }
        return pickupRepository.findByVolunteer(volunteer, pageable)
                .map(donationMapper::toPickupResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public PickupResponse getPickupDetails(Long pickupId) {
        VolunteerProfile volunteer = getCurrentVolunteerProfile();
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", pickupId));

        if (pickup.getVolunteer() == null || !pickup.getVolunteer().getId().equals(volunteer.getId())) {
            throw new UnauthorizedActionException("You can only view pickups assigned to you");
        }

        return donationMapper.toPickupResponse(pickup);
    }

    @Override
    @Transactional
    public PickupResponse acceptPickup(Long pickupId) {
        VolunteerProfile volunteer = getCurrentVolunteerProfile();
        ensureVerifiedVolunteer(volunteer);

        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", pickupId));

        if (pickup.getVolunteer() == null || !pickup.getVolunteer().getId().equals(volunteer.getId())) {
            throw new UnauthorizedActionException("This pickup is not assigned to you");
        }

        if (pickup.getStatus() != PickupStatus.ASSIGNED) {
            throw new BadRequestException("Cannot accept pickup in status: " + pickup.getStatus());
        }

        pickup.setStatus(PickupStatus.ACCEPTED);
        pickup.setAcceptedAt(ZonedDateTime.now());
        Pickup updated = pickupRepository.save(pickup);

        // Notify NGO
        if (pickup.getNgo() != null && pickup.getNgo().getUser() != null) {
            notificationService.createNotification(
                    pickup.getNgo().getUser(),
                    "Pickup Accepted by Volunteer",
                    volunteer.getUser().getName() + " has accepted the pickup task for " + pickup.getDonation().getFoodName(),
                    "PICKUP_UPDATE"
            );
        }

        auditService.logAction(volunteer.getUser(), "ACCEPT_PICKUP", "PICKUP", updated.getId(),
                "Volunteer accepted pickup #" + updated.getId());

        return donationMapper.toPickupResponse(updated);
    }

    @Override
    @Transactional
    public PickupResponse rejectPickup(Long pickupId, String reason) {
        VolunteerProfile volunteer = getCurrentVolunteerProfile();
        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", pickupId));

        if (pickup.getVolunteer() == null || !pickup.getVolunteer().getId().equals(volunteer.getId())) {
            throw new UnauthorizedActionException("This pickup is not assigned to you");
        }

        if (pickup.getStatus() != PickupStatus.ASSIGNED) {
            throw new BadRequestException("Can only decline pickups currently in ASSIGNED status");
        }

        pickup.setVolunteer(null);
        pickup.setStatus(PickupStatus.PENDING);
        pickup.setNotes("Volunteer declined: " + (reason != null ? reason : "Unavailable"));
        Pickup updated = pickupRepository.save(pickup);

        // Notify NGO to reassign
        if (pickup.getNgo() != null && pickup.getNgo().getUser() != null) {
            notificationService.createNotification(
                    pickup.getNgo().getUser(),
                    "Volunteer Declined Pickup",
                    volunteer.getUser().getName() + " declined pickup for " + pickup.getDonation().getFoodName() + ". Please assign another volunteer.",
                    "PICKUP_UPDATE"
            );
        }

        auditService.logAction(volunteer.getUser(), "REJECT_PICKUP", "PICKUP", updated.getId(),
                "Volunteer declined pickup #" + updated.getId() + ". Reason: " + reason);

        return donationMapper.toPickupResponse(updated);
    }

    @Override
    @Transactional
    public PickupResponse updatePickupStatus(Long pickupId, PickupStatus status, String notes) {
        VolunteerProfile volunteer = getCurrentVolunteerProfile();
        ensureVerifiedVolunteer(volunteer);

        Pickup pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup", "id", pickupId));

        if (pickup.getVolunteer() == null || !pickup.getVolunteer().getId().equals(volunteer.getId())) {
            throw new UnauthorizedActionException("Only the assigned volunteer can update pickup progress");
        }

        FoodDonation donation = pickup.getDonation();
        ZonedDateTime now = ZonedDateTime.now();

        if (status == PickupStatus.PICKED_UP) {
            pickup.setStatus(PickupStatus.PICKED_UP);
            pickup.setPickedUpAt(now);
            donation.setStatus(DonationStatus.PICKED_UP);

            if (pickup.getNgo() != null && pickup.getNgo().getUser() != null) {
                notificationService.createNotification(
                        pickup.getNgo().getUser(),
                        "Food Picked Up",
                        volunteer.getUser().getName() + " has collected '" + donation.getFoodName() + "' and is en route.",
                        "PICKUP_UPDATE"
                );
            }
        } else if (status == PickupStatus.DELIVERED) {
            pickup.setStatus(PickupStatus.DELIVERED);
            pickup.setDeliveredAt(now);
            donation.setStatus(DonationStatus.DELIVERED);

            if (pickup.getNgo() != null && pickup.getNgo().getUser() != null) {
                notificationService.createNotification(
                        pickup.getNgo().getUser(),
                        "Food Delivered to Facility",
                        volunteer.getUser().getName() + " has delivered '" + donation.getFoodName() + "'. Please inspect and confirm receipt.",
                        "PICKUP_UPDATE"
                );
            }
        } else {
            throw new BadRequestException("Invalid volunteer status update transition: " + status);
        }

        if (notes != null && !notes.trim().isEmpty()) {
            pickup.setNotes(notes);
        }

        donationRepository.save(donation);
        Pickup updated = pickupRepository.save(pickup);

        auditService.logAction(volunteer.getUser(), "UPDATE_PICKUP_STATUS", "PICKUP", updated.getId(),
                "Volunteer transitioned pickup status to: " + status);

        return donationMapper.toPickupResponse(updated);
    }

    @Override
    @Transactional
    public void updateAvailability(VolunteerAvailability availability) {
        VolunteerProfile volunteer = getCurrentVolunteerProfile();
        volunteer.setAvailabilityStatus(availability);
        volunteerProfileRepository.save(volunteer);

        auditService.logAction(volunteer.getUser(), "UPDATE_AVAILABILITY", "VOLUNTEER_PROFILE", volunteer.getId(),
                "Volunteer set availability status to: " + availability);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        VolunteerProfile volunteer = getCurrentVolunteerProfile();

        Map<String, Long> metrics = new HashMap<>();
        metrics.put("assignedPickups", pickupRepository.countByVolunteerAndStatus(volunteer, PickupStatus.ASSIGNED));
        metrics.put("pendingPickups", pickupRepository.countByVolunteerAndStatus(volunteer, PickupStatus.ACCEPTED));
        metrics.put("activeDelivery", pickupRepository.countByVolunteerAndStatus(volunteer, PickupStatus.PICKED_UP));
        metrics.put("completedDeliveries", pickupRepository.countByVolunteerAndStatus(volunteer, PickupStatus.COMPLETED)
                + pickupRepository.countByVolunteerAndStatus(volunteer, PickupStatus.DELIVERED));

        return DashboardStatsResponse.builder()
                .metrics(metrics)
                .build();
    }
}
