package com.foodredistribution.repository;

import com.foodredistribution.entity.User;
import com.foodredistribution.entity.VolunteerProfile;
import com.foodredistribution.enums.VerificationStatus;
import com.foodredistribution.enums.VolunteerAvailability;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerProfileRepository extends JpaRepository<VolunteerProfile, Long> {
    Optional<VolunteerProfile> findByUser(User user);
    Optional<VolunteerProfile> findByUserId(Long userId);
    Page<VolunteerProfile> findByVerificationStatus(VerificationStatus status, Pageable pageable);
    List<VolunteerProfile> findByVerificationStatusAndAvailabilityStatus(VerificationStatus verificationStatus, VolunteerAvailability availabilityStatus);
    long countByVerificationStatus(VerificationStatus status);
}
