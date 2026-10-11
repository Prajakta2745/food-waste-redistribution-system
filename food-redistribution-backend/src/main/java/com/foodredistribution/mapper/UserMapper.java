package com.foodredistribution.mapper;

import com.foodredistribution.dto.response.FoodProviderProfileResponse;
import com.foodredistribution.dto.response.NgoProfileResponse;
import com.foodredistribution.dto.response.UserProfileResponse;
import com.foodredistribution.dto.response.VolunteerProfileResponse;
import com.foodredistribution.entity.FoodProviderProfile;
import com.foodredistribution.entity.NgoProfile;
import com.foodredistribution.entity.User;
import com.foodredistribution.entity.VolunteerProfile;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserProfileResponse toUserProfileResponse(User user,
                                                     FoodProviderProfile providerProfile,
                                                     NgoProfile ngoProfile,
                                                     VolunteerProfile volunteerProfile) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .providerProfile(providerProfile != null ? toProviderResponse(providerProfile) : null)
                .ngoProfile(ngoProfile != null ? toNgoResponse(ngoProfile) : null)
                .volunteerProfile(volunteerProfile != null ? toVolunteerResponse(volunteerProfile) : null)
                .build();
    }

    public FoodProviderProfileResponse toProviderResponse(FoodProviderProfile profile) {
        if (profile == null) return null;
        return FoodProviderProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .organizationName(profile.getOrganizationName())
                .organizationType(profile.getOrganizationType())
                .address(profile.getAddress())
                .city(profile.getCity())
                .state(profile.getState())
                .description(profile.getDescription())
                .verificationStatus(profile.getVerificationStatus())
                .createdAt(profile.getCreatedAt())
                .build();
    }

    public NgoProfileResponse toNgoResponse(NgoProfile profile) {
        if (profile == null) return null;
        return NgoProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .organizationName(profile.getOrganizationName())
                .registrationNumber(profile.getRegistrationNumber())
                .contactPerson(profile.getContactPerson())
                .address(profile.getAddress())
                .city(profile.getCity())
                .state(profile.getState())
                .serviceArea(profile.getServiceArea())
                .description(profile.getDescription())
                .verificationStatus(profile.getVerificationStatus())
                .createdAt(profile.getCreatedAt())
                .build();
    }

    public VolunteerProfileResponse toVolunteerResponse(VolunteerProfile profile) {
        if (profile == null) return null;
        return VolunteerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .name(profile.getUser() != null ? profile.getUser().getName() : null)
                .email(profile.getUser() != null ? profile.getUser().getEmail() : null)
                .phone(profile.getUser() != null ? profile.getUser().getPhone() : null)
                .address(profile.getAddress())
                .city(profile.getCity())
                .state(profile.getState())
                .vehicleType(profile.getVehicleType())
                .vehicleNumber(profile.getVehicleNumber())
                .availabilityStatus(profile.getAvailabilityStatus())
                .verificationStatus(profile.getVerificationStatus())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
