package com.foodredistribution.service.impl;

import com.foodredistribution.dto.request.VerificationActionRequest;
import com.foodredistribution.dto.response.*;
import com.foodredistribution.entity.*;
import com.foodredistribution.enums.*;
import com.foodredistribution.exception.BadRequestException;
import com.foodredistribution.exception.ResourceNotFoundException;
import com.foodredistribution.mapper.DonationMapper;
import com.foodredistribution.mapper.UserMapper;
import com.foodredistribution.repository.*;
import com.foodredistribution.service.AdminService;
import com.foodredistribution.service.AuditService;
import com.foodredistribution.service.NotificationService;
import com.foodredistribution.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final FoodProviderProfileRepository providerProfileRepository;
    private final NgoProfileRepository ngoProfileRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;
    private final FoodDonationRepository donationRepository;
    private final PickupRepository pickupRepository;
    private final UserMapper userMapper;
    private final DonationMapper donationMapper;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    private final AuditService auditService;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getAdminDashboardStats() {
        Map<String, Long> metrics = new HashMap<>();

        metrics.put("totalUsers", userRepository.count());
        metrics.put("totalProviders", userRepository.countByRole(Role.FOOD_PROVIDER));
        metrics.put("totalNgos", userRepository.countByRole(Role.NGO));
        metrics.put("totalVolunteers", userRepository.countByRole(Role.VOLUNTEER));

        metrics.put("totalDonations", donationRepository.count());
        metrics.put("activeDonations", donationRepository.countByStatus(DonationStatus.AVAILABLE)
                + donationRepository.countByStatus(DonationStatus.ACCEPTED)
                + donationRepository.countByStatus(DonationStatus.PICKUP_ASSIGNED)
                + donationRepository.countByStatus(DonationStatus.PICKED_UP)
                + donationRepository.countByStatus(DonationStatus.DELIVERED));
        metrics.put("completedDonations", donationRepository.countByStatus(DonationStatus.COMPLETED));

        metrics.put("activePickups", pickupRepository.countByStatus(PickupStatus.ASSIGNED)
                + pickupRepository.countByStatus(PickupStatus.ACCEPTED)
                + pickupRepository.countByStatus(PickupStatus.PICKED_UP)
                + pickupRepository.countByStatus(PickupStatus.DELIVERED));

        metrics.put("pendingNgos", ngoProfileRepository.countByVerificationStatus(VerificationStatus.PENDING));
        metrics.put("pendingVolunteers", volunteerProfileRepository.countByVerificationStatus(VerificationStatus.PENDING));

        return DashboardStatsResponse.builder()
                .metrics(metrics)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileResponse> getAllUsers(Role role, Pageable pageable) {
        Page<User> users;
        if (role != null) {
            users = userRepository.findByRole(role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(user -> {
            FoodProviderProfile providerProfile = providerProfileRepository.findByUser(user).orElse(null);
            NgoProfile ngoProfile = ngoProfileRepository.findByUser(user).orElse(null);
            VolunteerProfile volunteerProfile = volunteerProfileRepository.findByUser(user).orElse(null);
            return userMapper.toUserProfileResponse(user, providerProfile, ngoProfile, volunteerProfile);
        });
    }

    @Override
    @Transactional
    public UserProfileResponse toggleUserStatus(Long userId, boolean enabled) {
        User admin = securityUtils.getCurrentUser();
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (targetUser.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot disable administrator accounts.");
        }

        targetUser.setEnabled(enabled);
        User saved = userRepository.save(targetUser);

        FoodProviderProfile providerProfile = providerProfileRepository.findByUser(saved).orElse(null);
        NgoProfile ngoProfile = ngoProfileRepository.findByUser(saved).orElse(null);
        VolunteerProfile volunteerProfile = volunteerProfileRepository.findByUser(saved).orElse(null);

        auditService.logAction(admin, (enabled ? "ENABLE_USER" : "DISABLE_USER"), "USER", saved.getId(),
                "Admin changed status of user " + saved.getEmail() + " to " + (enabled ? "ENABLED" : "DISABLED"));

        return userMapper.toUserProfileResponse(saved, providerProfile, ngoProfile, volunteerProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NgoProfileResponse> getPendingNgos(Pageable pageable) {
        return ngoProfileRepository.findByVerificationStatus(VerificationStatus.PENDING, pageable)
                .map(userMapper::toNgoResponse);
    }

    @Override
    @Transactional
    public NgoProfileResponse verifyNgo(Long ngoId, VerificationActionRequest req) {
        User admin = securityUtils.getCurrentUser();
        NgoProfile ngo = ngoProfileRepository.findById(ngoId)
                .orElseThrow(() -> new ResourceNotFoundException("NgoProfile", "id", ngoId));

        if (req.getStatus() != VerificationStatus.VERIFIED && req.getStatus() != VerificationStatus.REJECTED) {
            throw new BadRequestException("Verification status must be either VERIFIED or REJECTED");
        }

        ngo.setVerificationStatus(req.getStatus());
        NgoProfile updated = ngoProfileRepository.save(ngo);

        String message = req.getStatus() == VerificationStatus.VERIFIED
                ? "Your NGO profile has been verified! You can now claim surplus food donations."
                : "Your NGO verification request was rejected. Reason: " + (req.getReason() != null ? req.getReason() : "Documentation incomplete");

        notificationService.createNotification(ngo.getUser(), "NGO Verification Update", message, "SYSTEM");

        auditService.logAction(admin, "VERIFY_NGO", "NGO_PROFILE", updated.getId(),
                "Admin verified NGO " + ngo.getOrganizationName() + " as " + req.getStatus());

        return userMapper.toNgoResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VolunteerProfileResponse> getPendingVolunteers(Pageable pageable) {
        return volunteerProfileRepository.findByVerificationStatus(VerificationStatus.PENDING, pageable)
                .map(userMapper::toVolunteerResponse);
    }

    @Override
    @Transactional
    public VolunteerProfileResponse verifyVolunteer(Long volunteerId, VerificationActionRequest req) {
        User admin = securityUtils.getCurrentUser();
        VolunteerProfile volunteer = volunteerProfileRepository.findById(volunteerId)
                .orElseThrow(() -> new ResourceNotFoundException("VolunteerProfile", "id", volunteerId));

        if (req.getStatus() != VerificationStatus.VERIFIED && req.getStatus() != VerificationStatus.REJECTED) {
            throw new BadRequestException("Verification status must be either VERIFIED or REJECTED");
        }

        volunteer.setVerificationStatus(req.getStatus());
        VolunteerProfile updated = volunteerProfileRepository.save(volunteer);

        String message = req.getStatus() == VerificationStatus.VERIFIED
                ? "Your volunteer application is approved! You are now eligible to accept pickup tasks."
                : "Your volunteer application was rejected. Reason: " + (req.getReason() != null ? req.getReason() : "Details insufficient");

        notificationService.createNotification(volunteer.getUser(), "Volunteer Verification Update", message, "SYSTEM");

        auditService.logAction(admin, "VERIFY_VOLUNTEER", "VOLUNTEER_PROFILE", updated.getId(),
                "Admin verified volunteer " + volunteer.getUser().getName() + " as " + req.getStatus());

        return userMapper.toVolunteerResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DonationResponse> getAllDonations(Pageable pageable) {
        return donationRepository.findAll(pageable).map(d -> {
            Pickup pickup = pickupRepository.findByDonation(d).orElse(null);
            return donationMapper.toDonationResponse(d, pickup);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PickupResponse> getAllPickups(Pageable pageable) {
        return pickupRepository.findAll(pageable).map(donationMapper::toPickupResponse);
    }
}
