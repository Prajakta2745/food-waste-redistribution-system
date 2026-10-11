package com.foodredistribution.repository;

import com.foodredistribution.entity.DonationRequest;
import com.foodredistribution.entity.FoodDonation;
import com.foodredistribution.entity.NgoProfile;
import com.foodredistribution.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {
    Optional<DonationRequest> findByDonationAndNgo(FoodDonation donation, NgoProfile ngo);
    boolean existsByDonationAndNgo(FoodDonation donation, NgoProfile ngo);
    Page<DonationRequest> findByNgo(NgoProfile ngo, Pageable pageable);
    List<DonationRequest> findByDonation(FoodDonation donation);
    long countByNgoAndRequestStatus(NgoProfile ngo, RequestStatus status);
}
