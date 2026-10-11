package com.foodredistribution.service;

import com.foodredistribution.dto.response.DashboardStatsResponse;
import com.foodredistribution.dto.response.PickupResponse;
import com.foodredistribution.enums.PickupStatus;
import com.foodredistribution.enums.VolunteerAvailability;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VolunteerService {
    Page<PickupResponse> getMyPickups(PickupStatus status, Pageable pageable);
    PickupResponse getPickupDetails(Long pickupId);
    PickupResponse acceptPickup(Long pickupId);
    PickupResponse rejectPickup(Long pickupId, String reason);
    PickupResponse updatePickupStatus(Long pickupId, PickupStatus status, String notes);
    void updateAvailability(VolunteerAvailability availability);
    DashboardStatsResponse getDashboardStats();
}
