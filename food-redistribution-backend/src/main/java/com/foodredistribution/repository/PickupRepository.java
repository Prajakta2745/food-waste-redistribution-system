package com.foodredistribution.repository;

import com.foodredistribution.entity.FoodDonation;
import com.foodredistribution.entity.NgoProfile;
import com.foodredistribution.entity.Pickup;
import com.foodredistribution.entity.VolunteerProfile;
import com.foodredistribution.enums.PickupStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PickupRepository extends JpaRepository<Pickup, Long> {
    Optional<Pickup> findByDonation(FoodDonation donation);
    Optional<Pickup> findByDonationId(Long donationId);
    Page<Pickup> findByNgo(NgoProfile ngo, Pageable pageable);
    Page<Pickup> findByVolunteer(VolunteerProfile volunteer, Pageable pageable);
    Page<Pickup> findByVolunteerAndStatus(VolunteerProfile volunteer, PickupStatus status, Pageable pageable);
    long countByNgoAndStatus(NgoProfile ngo, PickupStatus status);
    long countByVolunteerAndStatus(VolunteerProfile volunteer, PickupStatus status);
    long countByVolunteer(VolunteerProfile volunteer);
    long countByStatus(PickupStatus status);
}
