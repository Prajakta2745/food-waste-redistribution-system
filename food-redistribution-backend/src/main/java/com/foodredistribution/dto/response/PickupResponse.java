package com.foodredistribution.dto.response;

import com.foodredistribution.enums.PickupStatus;
import com.foodredistribution.enums.QuantityUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PickupResponse {
    private Long id;
    private Long donationId;
    private String foodName;
    private BigDecimal quantity;
    private QuantityUnit quantityUnit;
    private String providerOrganizationName;
    private String pickupContactPhone;
    private Long ngoId;
    private String ngoName;
    private String ngoContactPerson;
    private String ngoPhone;
    private Long volunteerId;
    private String volunteerName;
    private String volunteerPhone;
    private String pickupAddress;
    private String deliveryAddress;
    private PickupStatus status;
    private String notes;
    private String specialInstructions;
    private ZonedDateTime assignedAt;
    private ZonedDateTime acceptedAt;
    private ZonedDateTime pickedUpAt;
    private ZonedDateTime deliveredAt;
    private ZonedDateTime completedAt;
}
