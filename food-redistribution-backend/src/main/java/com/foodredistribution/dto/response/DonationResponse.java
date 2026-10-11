package com.foodredistribution.dto.response;

import com.foodredistribution.enums.DonationStatus;
import com.foodredistribution.enums.FoodCategory;
import com.foodredistribution.enums.FoodType;
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
public class DonationResponse {

    private Long id;
    private Long providerId;
    private String providerOrganizationName;
    private String providerContactPhone;

    private String foodName;
    private FoodCategory foodCategory;
    private BigDecimal quantity;
    private QuantityUnit quantityUnit;
    private FoodType foodType;

    private ZonedDateTime preparationDateTime;
    private ZonedDateTime bestBeforeDateTime;
    private String description;

    private String pickupAddress;
    private String city;
    private String state;
    private String contactNumber;
    private String specialInstructions;

    private ZonedDateTime availableFrom;
    private ZonedDateTime availableUntil;
    private String imageUrl;
    private DonationStatus status;

    private PickupResponse pickup;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
