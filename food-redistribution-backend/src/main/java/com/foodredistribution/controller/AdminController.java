package com.foodredistribution.controller;

import com.foodredistribution.dto.request.VerificationActionRequest;
import com.foodredistribution.dto.response.*;
import com.foodredistribution.enums.Role;
import com.foodredistribution.service.AdminService;
import com.foodredistribution.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Endpoints for System Administrators to oversee users, verify NGOs/volunteers, monitor donations and view audit logs")
public class AdminController {

    private final AdminService adminService;
    private final AuditService auditService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get comprehensive platform-wide statistics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = adminService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Admin dashboard metrics retrieved", stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of all platform users with role filter and pagination")
    public ResponseEntity<ApiResponse<Page<UserProfileResponse>>> getAllUsers(
            @RequestParam(required = false) Role role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserProfileResponse> users = adminService.getAllUsers(
                role, PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved", users));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Enable or disable user account access")
    public ResponseEntity<ApiResponse<UserProfileResponse>> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled
    ) {
        UserProfileResponse updatedUser = adminService.toggleUserStatus(id, enabled);
        return ResponseEntity.ok(ApiResponse.ok("User status updated", updatedUser));
    }

    @GetMapping("/ngos/pending")
    @Operation(summary = "Get all unverified NGOs awaiting approval")
    public ResponseEntity<ApiResponse<Page<NgoProfileResponse>>> getPendingNgos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<NgoProfileResponse> ngos = adminService.getPendingNgos(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.ok("Pending NGOs retrieved", ngos));
    }

    @PutMapping("/ngos/{id}/verify")
    @Operation(summary = "Verify or reject an NGO application")
    public ResponseEntity<ApiResponse<NgoProfileResponse>> verifyNgo(
            @PathVariable Long id,
            @Valid @RequestBody VerificationActionRequest request
    ) {
        NgoProfileResponse verified = adminService.verifyNgo(id, request);
        return ResponseEntity.ok(ApiResponse.ok("NGO verification updated", verified));
    }

    @GetMapping("/volunteers/pending")
    @Operation(summary = "Get all unverified Volunteers awaiting approval")
    public ResponseEntity<ApiResponse<Page<VolunteerProfileResponse>>> getPendingVolunteers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<VolunteerProfileResponse> volunteers = adminService.getPendingVolunteers(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.ok("Pending volunteers retrieved", volunteers));
    }

    @PutMapping("/volunteers/{id}/verify")
    @Operation(summary = "Verify or reject a Volunteer application")
    public ResponseEntity<ApiResponse<VolunteerProfileResponse>> verifyVolunteer(
            @PathVariable Long id,
            @Valid @RequestBody VerificationActionRequest request
    ) {
        VolunteerProfileResponse verified = adminService.verifyVolunteer(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Volunteer verification updated", verified));
    }

    @GetMapping("/donations")
    @Operation(summary = "Monitor all system donations across all lifecycle statuses")
    public ResponseEntity<ApiResponse<Page<DonationResponse>>> getAllDonations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<DonationResponse> donations = adminService.getAllDonations(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.ok("All donations retrieved", donations));
    }

    @GetMapping("/pickups")
    @Operation(summary = "Monitor all logistical pickups across the system")
    public ResponseEntity<ApiResponse<Page<PickupResponse>>> getAllPickups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<PickupResponse> pickups = adminService.getAllPickups(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.ok("All pickups retrieved", pickups));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "View platform audit logs and security trails")
    public ResponseEntity<ApiResponse<Page<AuditLogResponse>>> getAuditLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Page<AuditLogResponse> logs;
        if (entityType != null && !entityType.trim().isEmpty()) {
            logs = auditService.getAuditLogsByEntity(entityType, PageRequest.of(page, size, Sort.by("timestamp").descending()));
        } else {
            logs = auditService.getAllAuditLogs(PageRequest.of(page, size, Sort.by("timestamp").descending()));
        }
        return ResponseEntity.ok(ApiResponse.ok("Audit logs retrieved", logs));
    }
}
