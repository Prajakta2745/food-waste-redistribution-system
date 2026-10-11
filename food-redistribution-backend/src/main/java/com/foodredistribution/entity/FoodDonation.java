package com.foodredistribution.entity;

import com.foodredistribution.enums.DonationStatus;
import com.foodredistribution.enums.FoodCategory;
import com.foodredistribution.enums.FoodType;
import com.foodredistribution.enums.QuantityUnit;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "food_donations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private FoodProviderProfile provider;

    @Column(name = "food_name", nullable = false, length = 150)
    private String foodName;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_category", nullable = false, length = 50)
    private FoodCategory foodCategory;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "quantity_unit", nullable = false, length = 30)
    private QuantityUnit quantityUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_type", nullable = false, length = 30)
    private FoodType foodType;

    @Column(name = "preparation_date_time", nullable = false)
    private ZonedDateTime preparationDateTime;

    @Column(name = "best_before_date_time", nullable = false)
    private ZonedDateTime bestBeforeDateTime;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "pickup_address", nullable = false, columnDefinition = "TEXT")
    private String pickupAddress;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "available_from", nullable = false)
    private ZonedDateTime availableFrom;

    @Column(name = "available_until", nullable = false)
    private ZonedDateTime availableUntil;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private DonationStatus status = DonationStatus.AVAILABLE;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Long version = 0L;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;
}
