package com.foodredistribution.dto.response;

import com.foodredistribution.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private boolean enabled;
    private ZonedDateTime createdAt;

    // Attached profile if available
    private FoodProviderProfileResponse providerProfile;
    private NgoProfileResponse ngoProfile;
    private VolunteerProfileResponse volunteerProfile;
}
