package com.foodredistribution.service;

import com.foodredistribution.dto.request.CreateDonationRequest;
import com.foodredistribution.dto.request.UpdateDonationRequest;
import com.foodredistribution.dto.response.DashboardStatsResponse;
import com.foodredistribution.dto.response.DonationResponse;
import com.foodredistribution.enums.DonationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FoodProviderService {
    DonationResponse createDonation(CreateDonationRequest request);
    DonationResponse updateDonation(Long donationId, UpdateDonationRequest request);
    DonationResponse cancelDonation(Long donationId, String reason);
    DonationResponse getDonationDetails(Long donationId);
    Page<DonationResponse> getMyDonations(DonationStatus status, Pageable pageable);
    DashboardStatsResponse getDashboardStats();
}
