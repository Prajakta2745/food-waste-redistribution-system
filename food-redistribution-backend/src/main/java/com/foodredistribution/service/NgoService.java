package com.foodredistribution.service;

import com.foodredistribution.dto.request.AssignVolunteerRequest;
import com.foodredistribution.dto.response.*;
import com.foodredistribution.enums.FoodCategory;
import com.foodredistribution.enums.FoodType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface NgoService {
    Page<DonationResponse> searchAvailableDonations(String city, FoodCategory category, FoodType foodType, BigDecimal minQuantity, Pageable pageable);
    DonationResponse getAvailableDonationDetails(Long donationId);
    DonationResponse claimDonation(Long donationId);
    Page<DonationRequestResponse> getMyRequests(Pageable pageable);
    Page<PickupResponse> getMyPickups(Pageable pageable);
    PickupResponse assignVolunteerToPickup(Long pickupId, AssignVolunteerRequest request);
    PickupResponse confirmFoodReceived(Long pickupId);
    List<VolunteerProfileResponse> getAvailableVolunteers();
    DashboardStatsResponse getDashboardStats();
}
