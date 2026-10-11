package com.foodredistribution.controller;

import com.foodredistribution.dto.request.CreateDonationRequest;
import com.foodredistribution.dto.request.UpdateDonationRequest;
import com.foodredistribution.dto.response.ApiResponse;
import com.foodredistribution.dto.response.DashboardStatsResponse;
import com.foodredistribution.dto.response.DonationResponse;
import com.foodredistribution.enums.DonationStatus;
import com.foodredistribution.service.FoodProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/provider")
@PreAuthorize("hasRole('FOOD_PROVIDER')")
@RequiredArgsConstructor
@Tag(name = "Food Provider", description = "Endpoints for Food Providers to manage surplus food donations and view metrics")
public class FoodProviderController {

    private final FoodProviderService providerService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get Food Provider dashboard overview metrics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = providerService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved", stats));
    }

    @PostMapping("/donations")
    @Operation(summary = "Create a new surplus food donation")
    public ResponseEntity<ApiResponse<DonationResponse>> createDonation(@Valid @RequestBody CreateDonationRequest request) {
        DonationResponse donation = providerService.createDonation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Food donation created successfully", donation));
    }

    @GetMapping("/donations")
    @Operation(summary = "Get food donations listed by this provider with pagination and optional status filter")
    public ResponseEntity<ApiResponse<Page<DonationResponse>>> getMyDonations(
            @RequestParam(required = false) DonationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<DonationResponse> donations = providerService.getMyDonations(status, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.ok("Donations retrieved", donations));
    }

    @GetMapping("/donations/{id}")
    @Operation(summary = "Get full details of a specific donation")
    public ResponseEntity<ApiResponse<DonationResponse>> getDonationDetails(@PathVariable Long id) {
        DonationResponse donation = providerService.getDonationDetails(id);
        return ResponseEntity.ok(ApiResponse.ok("Donation details retrieved", donation));
    }

    @PutMapping("/donations/{id}")
    @Operation(summary = "Update donation details (only allowed if status is AVAILABLE)")
    public ResponseEntity<ApiResponse<DonationResponse>> updateDonation(
            @PathVariable Long id,
            @Valid @RequestBody UpdateDonationRequest request
    ) {
        DonationResponse updated = providerService.updateDonation(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Donation updated successfully", updated));
    }

    @PutMapping("/donations/{id}/cancel")
    @Operation(summary = "Cancel a food donation before it is picked up")
    public ResponseEntity<ApiResponse<DonationResponse>> cancelDonation(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        DonationResponse cancelled = providerService.cancelDonation(id, reason);
        return ResponseEntity.ok(ApiResponse.ok("Donation cancelled", cancelled));
    }
}
