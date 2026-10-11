package com.foodredistribution.service.impl;

import com.foodredistribution.dto.request.CreateDonationRequest;
import com.foodredistribution.dto.request.UpdateDonationRequest;
import com.foodredistribution.dto.response.DashboardStatsResponse;
import com.foodredistribution.dto.response.DonationResponse;
import com.foodredistribution.entity.FoodDonation;
import com.foodredistribution.entity.FoodProviderProfile;
import com.foodredistribution.entity.Pickup;
import com.foodredistribution.entity.User;
import com.foodredistribution.enums.DonationStatus;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.exception.UnauthorizedActionException;
import com.foodredistribution.mapper.DonationMapper;
import com.foodredistribution.repository.FoodDonationRepository;
import com.foodredistribution.repository.FoodProviderProfileRepository;
import com.foodredistribution.repository.PickupRepository;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.FoodProviderService;
import com.foodredistribution.service.NotificationService;
import com.foodredistribution.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FoodProviderServiceImpl implements FoodProviderService {

    private final FoodDonationRepository donationRepository;
    private final FoodProviderProfileRepository providerProfileRepository;
    private final PickupRepository pickupRepository;
    private final DonationMapper donationMapper;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    private final AuditService auditService;

    private FoodProviderProfile getCurrentProviderProfile() {
        User user = securityUtils.getCurrentUser();
        return providerProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("FoodProviderProfile", "user", user.getEmail()));
    }

    @Override
    @Transactional
    public DonationResponse createDonation(CreateDonationRequest req) {
        FoodProviderProfile provider = getCurrentProviderProfile();

        // Validate business date rules
        if (req.getBestBeforeDateTime().isBefore(req.getPreparationDateTime())) {
            throw new BadRequestException("Best before date/time must be after preparation date/time");
        }
        if (req.getAvailableUntil().isBefore(req.getAvailableFrom())) {
            throw new BadRequestException("Available until date/time must be after available from date/time");
        }

        FoodDonation donation = FoodDonation.builder()
                .provider(provider)
                .foodName(req.getFoodName())
                .foodCategory(req.getFoodCategory())
                .quantity(req.getQuantity())
                .quantityUnit(req.getQuantityUnit())
                .foodType(req.getFoodType())
                .preparationDateTime(req.getPreparationDateTime())
                .bestBeforeDateTime(req.getBestBeforeDateTime())
                .description(req.getDescription())
                .pickupAddress(req.getPickupAddress())
                .city(req.getCity())
                .state(req.getState())
                .contactNumber(req.getContactNumber())
                .specialInstructions(req.getSpecialInstructions())
                .availableFrom(req.getAvailableFrom())
                .availableUntil(req.getAvailableUntil())
                .imageUrl(req.getImageUrl())
                .status(DonationStatus.AVAILABLE)
                .build();

        FoodDonation saved = donationRepository.save(donation);

        notificationService.createNotification(provider.getUser(),
                "Donation Created",
                "Your food donation '" + saved.getFoodName() + "' has been listed as AVAILABLE.",
                "DONATION_STATUS");

        auditService.logAction(provider.getUser(), "CREATE_DONATION", "FOOD_DONATION", saved.getId(),
                "Created surplus food donation: " + saved.getFoodName() + " (" + saved.getQuantity() + " " + saved.getQuantityUnit() + ")");

        return donationMapper.toDonationResponse(saved, null);
    }

    @Override
    @Transactional
    public DonationResponse updateDonation(Long donationId, UpdateDonationRequest req) {
        FoodProviderProfile provider = getCurrentProviderProfile();
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("FoodDonation", "id", donationId));

        if (!donation.getProvider().getId().equals(provider.getId())) {
            throw new UnauthorizedActionException("You can only modify donations created by your organization");
        }

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new BadRequestException("Cannot edit donation with status '" + donation.getStatus() + "'. Only AVAILABLE donations can be edited.");
        }

        if (req.getBestBeforeDateTime().isBefore(req.getPreparationDateTime())) {
            throw new BadRequestException("Best before date/time must be after preparation date/time");
        }
        if (req.getAvailableUntil().isBefore(req.getAvailableFrom())) {
            throw new BadRequestException("Available until date/time must be after available from date/time");
        }

        donation.setFoodName(req.getFoodName());
        donation.setFoodCategory(req.getFoodCategory());
        donation.setQuantity(req.getQuantity());
        donation.setQuantityUnit(req.getQuantityUnit());
        donation.setFoodType(req.getFoodType());
        donation.setPreparationDateTime(req.getPreparationDateTime());
        donation.setBestBeforeDateTime(req.getBestBeforeDateTime());
        donation.setDescription(req.getDescription());
        donation.setPickupAddress(req.getPickupAddress());
        donation.setCity(req.getCity());
        donation.setState(req.getState());
        donation.setContactNumber(req.getContactNumber());
        donation.setSpecialInstructions(req.getSpecialInstructions());
        donation.setAvailableFrom(req.getAvailableFrom());
        donation.setAvailableUntil(req.getAvailableUntil());
        if (req.getImageUrl() != null) donation.setImageUrl(req.getImageUrl());

        FoodDonation updated = donationRepository.save(donation);

        auditService.logAction(provider.getUser(), "UPDATE_DONATION", "FOOD_DONATION", updated.getId(),
                "Updated donation details for: " + updated.getFoodName());

        return donationMapper.toDonationResponse(updated, null);
    }

    @Override
    @Transactional
    public DonationResponse cancelDonation(Long donationId, String reason) {
        FoodProviderProfile provider = getCurrentProviderProfile();
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("FoodDonation", "id", donationId));

        if (!donation.getProvider().getId().equals(provider.getId())) {
            throw new UnauthorizedActionException("You can only cancel donations created by your organization");
        }

        if (donation.getStatus() == DonationStatus.PICKED_UP || donation.getStatus() == DonationStatus.DELIVERED || donation.getStatus() == DonationStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a donation that is already in transit or completed.");
        }

        donation.setStatus(DonationStatus.CANCELLED);
        FoodDonation cancelled = donationRepository.save(donation);

        Pickup pickup = pickupRepository.findByDonation(donation).orElse(null);
        if (pickup != null) {
            pickup.setStatus(com.foodredistribution.enums.PickupStatus.CANCELLED);
            pickupRepository.save(pickup);
            if (pickup.getNgo() != null && pickup.getNgo().getUser() != null) {
                notificationService.createNotification(pickup.getNgo().getUser(),
                        "Donation Cancelled",
                        "Provider has cancelled donation: " + donation.getFoodName() + ". Reason: " + (reason != null ? reason : "No reason provided"),
                        "DONATION_STATUS");
            }
        }

        auditService.logAction(provider.getUser(), "CANCEL_DONATION", "FOOD_DONATION", cancelled.getId(),
                "Provider cancelled donation: " + cancelled.getFoodName());

        return donationMapper.toDonationResponse(cancelled, pickup);
    }

    @Override
    @Transactional(readOnly = true)
    public DonationResponse getDonationDetails(Long donationId) {
        FoodProviderProfile provider = getCurrentProviderProfile();
        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("FoodDonation", "id", donationId));

        if (!donation.getProvider().getId().equals(provider.getId())) {
            throw new UnauthorizedActionException("You can only view details of your own donations");
        }

        Pickup pickup = pickupRepository.findByDonation(donation).orElse(null);
        return donationMapper.toDonationResponse(donation, pickup);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DonationResponse> getMyDonations(DonationStatus status, Pageable pageable) {
        FoodProviderProfile provider = getCurrentProviderProfile();
        Page<FoodDonation> donations;
        if (status != null) {
            donations = donationRepository.findByProviderAndStatus(provider, status, pageable);
        } else {
            donations = donationRepository.findByProvider(provider, pageable);
        }

        return donations.map(d -> {
            Pickup pickup = pickupRepository.findByDonation(d).orElse(null);
            return donationMapper.toDonationResponse(d, pickup);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        FoodProviderProfile provider = getCurrentProviderProfile();

        Map<String, Long> metrics = new HashMap<>();
        metrics.put("totalDonations", donationRepository.countByProvider(provider));
        metrics.put("availableDonations", donationRepository.countByProviderAndStatus(provider, DonationStatus.AVAILABLE));
        metrics.put("acceptedDonations", donationRepository.countByProviderAndStatus(provider, DonationStatus.ACCEPTED)
                + donationRepository.countByProviderAndStatus(provider, DonationStatus.PICKUP_ASSIGNED));
        metrics.put("completedDonations", donationRepository.countByProviderAndStatus(provider, DonationStatus.COMPLETED));
        metrics.put("cancelledDonations", donationRepository.countByProviderAndStatus(provider, DonationStatus.CANCELLED));

        Pageable recentPageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<FoodDonation> recentDonations = donationRepository.findByProvider(provider, recentPageable);

        return DashboardStatsResponse.builder()
                .metrics(metrics)
                .recentActivity(recentDonations.getContent().stream()
                        .map(d -> donationMapper.toDonationResponse(d, pickupRepository.findByDonation(d).orElse(null)))
                        .collect(Collectors.toList()))
                .build();
    }
}
