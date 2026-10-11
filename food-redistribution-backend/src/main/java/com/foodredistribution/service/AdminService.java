package com.foodredistribution.service;

import com.foodredistribution.dto.request.VerificationActionRequest;
import com.foodredistribution.dto.response.*;
import com.foodredistribution.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    DashboardStatsResponse getAdminDashboardStats();
    Page<UserProfileResponse> getAllUsers(Role role, Pageable pageable);
    UserProfileResponse toggleUserStatus(Long userId, boolean enabled);
    Page<NgoProfileResponse> getPendingNgos(Pageable pageable);
    NgoProfileResponse verifyNgo(Long ngoId, VerificationActionRequest request);
    Page<VolunteerProfileResponse> getPendingVolunteers(Pageable pageable);
    VolunteerProfileResponse verifyVolunteer(Long volunteerId, VerificationActionRequest request);
    Page<DonationResponse> getAllDonations(Pageable pageable);
    Page<PickupResponse> getAllPickups(Pageable pageable);
}
