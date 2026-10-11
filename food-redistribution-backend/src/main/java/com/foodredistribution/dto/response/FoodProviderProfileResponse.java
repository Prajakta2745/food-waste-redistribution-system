package com.foodredistribution.dto.response;

import com.foodredistribution.enums.OrganizationType;
import com.foodredistribution.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodProviderProfileResponse {
    private Long id;
    private Long userId;
    private String organizationName;
    private OrganizationType organizationType;
    private String address;
    private String city;
    private String state;
    private String description;
    private VerificationStatus verificationStatus;
    private ZonedDateTime createdAt;
}
