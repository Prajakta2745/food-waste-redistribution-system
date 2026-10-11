package com.foodredistribution.repository;

import com.foodredistribution.entity.NgoProfile;
import com.foodredistribution.entity.User;
import com.foodredistribution.enums.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NgoProfileRepository extends JpaRepository<NgoProfile, Long> {
    Optional<NgoProfile> findByUser(User user);
    Optional<NgoProfile> findByUserId(Long userId);
    boolean existsByRegistrationNumber(String registrationNumber);
    Page<NgoProfile> findByVerificationStatus(VerificationStatus status, Pageable pageable);
    List<NgoProfile> findByVerificationStatus(VerificationStatus status);
    long countByVerificationStatus(VerificationStatus status);
}
