package com.foodredistribution.dto.response;

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
public class NgoProfileResponse {
    private Long id;
    private Long userId;
    private String organizationName;
    private String registrationNumber;
    private String contactPerson;
    private String address;
    private String city;
    private String state;
    private String serviceArea;
    private String description;
    private VerificationStatus verificationStatus;
    private ZonedDateTime createdAt;
}
