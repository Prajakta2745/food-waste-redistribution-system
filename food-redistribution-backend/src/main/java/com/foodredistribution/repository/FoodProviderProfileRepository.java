package com.foodredistribution.repository;

import com.foodredistribution.entity.FoodProviderProfile;
import com.foodredistribution.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FoodProviderProfileRepository extends JpaRepository<FoodProviderProfile, Long> {
    Optional<FoodProviderProfile> findByUser(User user);
    Optional<FoodProviderProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
