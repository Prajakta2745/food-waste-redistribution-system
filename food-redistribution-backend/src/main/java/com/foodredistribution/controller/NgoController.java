package com.foodredistribution.controller;

import com.foodredistribution.dto.request.AssignVolunteerRequest;
import com.foodredistribution.dto.response.*;
import com.foodredistribution.enums.FoodCategory;
import com.foodredistribution.enums.FoodType;
import com.foodredistribution.service.NgoService;
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

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/ngo")
@PreAuthorize("hasRole('NGO')")
@RequiredArgsConstructor
@Tag(name = "NGO", description = "Endpoints for NGOs to discover, claim surplus food, assign volunteers, and confirm delivery")
public class NgoController {

    private final NgoService ngoService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get NGO dashboard overview metrics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = ngoService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved", stats));
    }

    @GetMapping("/donations/available")
    @Operation(summary = "Search and filter available surplus food donations")
    public ResponseEntity<ApiResponse<Page<DonationResponse>>> searchAvailableDonations(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) FoodCategory category,
            @RequestParam(required = false) FoodType foodType,
            @RequestParam(required = false) BigDecimal minQuantity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "availableUntil") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Page<DonationResponse> results = ngoService.searchAvailableDonations(city, category, foodType, minQuantity, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.ok("Available donations retrieved", results));
    }

    @GetMapping("/donations/{id}")
    @Operation(summary = "Get details of an available food donation")
    public ResponseEntity<ApiResponse<DonationResponse>> getDonationDetails(@PathVariable Long id) {
        DonationResponse details = ngoService.getAvailableDonationDetails(id);
        return ResponseEntity.ok(ApiResponse.ok("Donation details retrieved", details));
    }

    @PostMapping("/donations/{id}/request")
    @Operation(summary = "Claim / accept an available food donation (concurrency-safe)")
    public ResponseEntity<ApiResponse<DonationResponse>> claimDonation(@PathVariable Long id) {
        DonationResponse response = ngoService.claimDonation(id);
        return ResponseEntity.ok(ApiResponse.ok("Donation successfully claimed and accepted!", response));
    }

    @GetMapping("/requests")
    @Operation(summary = "Get list of donation requests made by this NGO")
    public ResponseEntity<ApiResponse<Page<DonationRequestResponse>>> getMyRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<DonationRequestResponse> requests = ngoService.getMyRequests(
                PageRequest.of(page, size, Sort.by("requestedAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.ok("Requests retrieved", requests));
    }

    @GetMapping("/pickups")
    @Operation(summary = "Get all pickups for accepted donations destined to this NGO")
    public ResponseEntity<ApiResponse<Page<PickupResponse>>> getMyPickups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<PickupResponse> pickups = ngoService.getMyPickups(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(ApiResponse.ok("Pickups retrieved", pickups));
    }

    @GetMapping("/volunteers/available")
    @Operation(summary = "Get list of available verified volunteers for pickup assignment")
    public ResponseEntity<ApiResponse<List<VolunteerProfileResponse>>> getAvailableVolunteers() {
        List<VolunteerProfileResponse> volunteers = ngoService.getAvailableVolunteers();
        return ResponseEntity.ok(ApiResponse.ok("Available volunteers retrieved", volunteers));
    }

    @PostMapping("/pickups/{pickupId}/assign-volunteer")
    @Operation(summary = "Assign a verified volunteer to an accepted pickup requirement")
    public ResponseEntity<ApiResponse<PickupResponse>> assignVolunteer(
            @PathVariable Long pickupId,
            @Valid @RequestBody AssignVolunteerRequest request
    ) {
        PickupResponse response = ngoService.assignVolunteerToPickup(pickupId, request);
        return ResponseEntity.ok(ApiResponse.ok("Volunteer assigned to pickup", response));
    }

    @PutMapping("/pickups/{pickupId}/confirm-receipt")
    @Operation(summary = "Confirm receipt of food delivery at NGO, completing the donation lifecycle")
    public ResponseEntity<ApiResponse<PickupResponse>> confirmFoodReceived(@PathVariable Long pickupId) {
        PickupResponse response = ngoService.confirmFoodReceived(pickupId);
        return ResponseEntity.ok(ApiResponse.ok("Food received! Donation marked as COMPLETED.", response));
    }
}
