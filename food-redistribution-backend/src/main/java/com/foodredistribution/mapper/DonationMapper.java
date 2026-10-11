package com.foodredistribution.mapper;

import com.foodredistribution.dto.response.DonationRequestResponse;
import com.foodredistribution.dto.response.DonationResponse;
import com.foodredistribution.dto.response.PickupResponse;
import com.foodredistribution.entity.DonationRequest;
import com.foodredistribution.entity.FoodDonation;
import com.foodredistribution.entity.NgoProfile;
import com.foodredistribution.entity.Pickup;
import com.foodredistribution.entity.VolunteerProfile;
import org.springframework.stereotype.Component;

@Component
public class DonationMapper {

    public DonationResponse toDonationResponse(FoodDonation donation, Pickup pickup) {
        if (donation == null) return null;

        return DonationResponse.builder()
                .id(donation.getId())
                .providerId(donation.getProvider() != null ? donation.getProvider().getId() : null)
                .providerOrganizationName(donation.getProvider() != null ? donation.getProvider().getOrganizationName() : null)
                .providerContactPhone(donation.getContactNumber())
                .foodName(donation.getFoodName())
                .foodCategory(donation.getFoodCategory())
                .quantity(donation.getQuantity())
                .quantityUnit(donation.getQuantityUnit())
                .foodType(donation.getFoodType())
                .preparationDateTime(donation.getPreparationDateTime())
                .bestBeforeDateTime(donation.getBestBeforeDateTime())
                .description(donation.getDescription())
                .pickupAddress(donation.getPickupAddress())
                .city(donation.getCity())
                .state(donation.getState())
                .contactNumber(donation.getContactNumber())
                .specialInstructions(donation.getSpecialInstructions())
                .availableFrom(donation.getAvailableFrom())
                .availableUntil(donation.getAvailableUntil())
                .imageUrl(donation.getImageUrl())
                .status(donation.getStatus())
                .pickup(pickup != null ? toPickupResponse(pickup) : null)
                .createdAt(donation.getCreatedAt())
                .updatedAt(donation.getUpdatedAt())
                .build();
    }

    public DonationRequestResponse toRequestResponse(DonationRequest request) {
        if (request == null) return null;

        return DonationRequestResponse.builder()
                .id(request.getId())
                .donationId(request.getDonation() != null ? request.getDonation().getId() : null)
                .foodName(request.getDonation() != null ? request.getDonation().getFoodName() : null)
                .ngoId(request.getNgo() != null ? request.getNgo().getId() : null)
                .ngoName(request.getNgo() != null ? request.getNgo().getOrganizationName() : null)
                .requestStatus(request.getRequestStatus())
                .requestedAt(request.getRequestedAt())
                .acceptedAt(request.getAcceptedAt())
                .rejectionReason(request.getRejectionReason())
                .build();
    }

    public PickupResponse toPickupResponse(Pickup pickup) {
        if (pickup == null) return null;

        FoodDonation donation = pickup.getDonation();
        NgoProfile ngo = pickup.getNgo();
        VolunteerProfile volunteer = pickup.getVolunteer();

        return PickupResponse.builder()
                .id(pickup.getId())
                .donationId(donation != null ? donation.getId() : null)
                .foodName(donation != null ? donation.getFoodName() : null)
                .quantity(donation != null ? donation.getQuantity() : null)
                .quantityUnit(donation != null ? donation.getQuantityUnit() : null)
                .providerOrganizationName(donation != null && donation.getProvider() != null ? donation.getProvider().getOrganizationName() : null)
                .pickupContactPhone(donation != null ? donation.getContactNumber() : null)
                .ngoId(ngo != null ? ngo.getId() : null)
                .ngoName(ngo != null ? ngo.getOrganizationName() : null)
                .ngoContactPerson(ngo != null ? ngo.getContactPerson() : null)
                .ngoPhone(ngo != null && ngo.getUser() != null ? ngo.getUser().getPhone() : null)
                .volunteerId(volunteer != null ? volunteer.getId() : null)
                .volunteerName(volunteer != null && volunteer.getUser() != null
                        ? volunteer.getUser().getName() : null)
                .volunteerPhone(volunteer != null && volunteer.getUser() != null
                        ? volunteer.getUser().getPhone() : null)
                .pickupAddress(pickup.getPickupAddress())
                .deliveryAddress(pickup.getDeliveryAddress())
                .status(pickup.getStatus())
                .notes(pickup.getNotes())
                .specialInstructions(donation != null ? donation.getSpecialInstructions() : null)
                .assignedAt(pickup.getAssignedAt())
                .acceptedAt(pickup.getAcceptedAt())
                .pickedUpAt(pickup.getPickedUpAt())
                .deliveredAt(pickup.getDeliveredAt())
                .completedAt(pickup.getCompletedAt())
                .build();
    }
}
