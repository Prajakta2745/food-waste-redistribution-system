package com.foodredistribution.dto.request;

import com.foodredistribution.enums.FoodCategory;
import com.foodredistribution.enums.FoodType;
import com.foodredistribution.enums.QuantityUnit;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
public class CreateDonationRequest {

    @NotBlank(message = "Food name is required")
    @Size(max = 150, message = "Food name cannot exceed 150 characters")
    private String foodName;

    @NotNull(message = "Food category is required")
    private FoodCategory foodCategory;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantity;

    @NotNull(message = "Quantity unit is required")
    private QuantityUnit quantityUnit;

    @NotNull(message = "Food type is required (Vegetarian, Non-Vegetarian, Vegan)")
    private FoodType foodType;

    @NotNull(message = "Preparation date and time is required")
    private ZonedDateTime preparationDateTime;

    @NotNull(message = "Best before date and time is required")
    private ZonedDateTime bestBeforeDateTime;

    private String description;

    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    private String specialInstructions;

    @NotNull(message = "Available from time is required")
    private ZonedDateTime availableFrom;

    @NotNull(message = "Available until time is required")
    private ZonedDateTime availableUntil;

    private String imageUrl;
}
