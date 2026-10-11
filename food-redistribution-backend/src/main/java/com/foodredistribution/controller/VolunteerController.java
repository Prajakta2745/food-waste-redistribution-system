package com.foodredistribution.controller;

import com.foodredistribution.dto.request.UpdatePickupStatusRequest;
import com.foodredistribution.dto.response.ApiResponse;
import com.foodredistribution.dto.response.DashboardStatsResponse;
import com.foodredistribution.dto.response.PickupResponse;
import com.foodredistribution.enums.PickupStatus;
import com.foodredistribution.enums.VolunteerAvailability;
import com.foodredistribution.service.VolunteerService;
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
@RequestMapping("/api/volunteer")
@PreAuthorize("hasRole('VOLUNTEER')")
@RequiredArgsConstructor
@Tag(name = "Volunteer", description = "Endpoints for Volunteers to manage assignments, transit updates, and availability")
public class VolunteerController {

    private final VolunteerService volunteerService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get Volunteer dashboard metrics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = volunteerService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved", stats));
    }

    @GetMapping("/pickups")
    @Operation(summary = "Get assigned pickup deliveries for this volunteer")
    public ResponseEntity<ApiResponse<Page<PickupResponse>>> getMyPickups(
            @RequestParam(required = false) PickupStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<PickupResponse> pickups = volunteerService.getMyPickups(
                status, PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.ok("Pickups retrieved", pickups));
    }

    @GetMapping("/pickups/{id}")
    @Operation(summary = "Get details of assigned pickup task")
    public ResponseEntity<ApiResponse<PickupResponse>> getPickupDetails(@PathVariable Long id) {
        PickupResponse details = volunteerService.getPickupDetails(id);
        return ResponseEntity.ok(ApiResponse.ok("Pickup details retrieved", details));
    }

    @PutMapping("/pickups/{id}/accept")
    @Operation(summary = "Accept an assigned pickup task")
    public ResponseEntity<ApiResponse<PickupResponse>> acceptPickup(@PathVariable Long id) {
        PickupResponse response = volunteerService.acceptPickup(id);
        return ResponseEntity.ok(ApiResponse.ok("Pickup accepted", response));
    }

    @PutMapping("/pickups/{id}/reject")
    @Operation(summary = "Decline/reject an assigned pickup task")
    public ResponseEntity<ApiResponse<PickupResponse>> rejectPickup(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        PickupResponse response = volunteerService.rejectPickup(id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Pickup declined", response));
    }

    @PutMapping("/pickups/{id}/status")
    @Operation(summary = "Update pickup delivery status (PICKED_UP or DELIVERED)")
    public ResponseEntity<ApiResponse<PickupResponse>> updatePickupStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePickupStatusRequest request
    ) {
        PickupResponse response = volunteerService.updatePickupStatus(id, request.getStatus(), request.getNotes());
        return ResponseEntity.ok(ApiResponse.ok("Pickup status updated to " + request.getStatus(), response));
    }

    @PutMapping("/availability")
    @Operation(summary = "Update volunteer availability status (AVAILABLE, BUSY, UNAVAILABLE)")
    public ResponseEntity<ApiResponse<Void>> updateAvailability(@RequestParam VolunteerAvailability availability) {
        volunteerService.updateAvailability(availability);
        return ResponseEntity.ok(ApiResponse.ok("Availability updated to " + availability, null));
    }
}
