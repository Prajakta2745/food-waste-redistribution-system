package com.foodredistribution.repository;

import com.foodredistribution.entity.FoodDonation;
import com.foodredistribution.entity.FoodProviderProfile;
import com.foodredistribution.enums.DonationStatus;
import com.foodredistribution.enums.FoodCategory;
import com.foodredistribution.enums.FoodType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {

    Page<FoodDonation> findByProvider(FoodProviderProfile provider, Pageable pageable);

    Page<FoodDonation> findByProviderAndStatus(FoodProviderProfile provider, DonationStatus status, Pageable pageable);

    long countByProviderAndStatus(FoodProviderProfile provider, DonationStatus status);

    long countByProvider(FoodProviderProfile provider);

    long countByStatus(DonationStatus status);

    List<FoodDonation> findByStatusAndAvailableUntilBefore(DonationStatus status, ZonedDateTime now);

    @Query("SELECT d FROM FoodDonation d WHERE d.status = :status " +
           "AND (COALESCE(:city, '') = '' OR LOWER(d.city) = LOWER(:city)) " +
           "AND (:category IS NULL OR d.foodCategory = :category) " +
           "AND (:foodType IS NULL OR d.foodType = :foodType) " +
           "AND (:minQuantity IS NULL OR d.quantity >= :minQuantity) " +
           "AND (d.availableUntil IS NULL OR d.availableUntil >= :currentTime)")
    Page<FoodDonation> findAvailableDonationsWithFilters(
            @Param("status") DonationStatus status,
            @Param("city") String city,
            @Param("category") FoodCategory category,
            @Param("foodType") FoodType foodType,
            @Param("minQuantity") BigDecimal minQuantity,
            @Param("currentTime") ZonedDateTime currentTime,
            Pageable pageable
    );
}
