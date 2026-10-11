package com.foodredistribution.dto.response;

import com.foodredistribution.enums.VehicleType;
import com.foodredistribution.enums.VerificationStatus;
import com.foodredistribution.enums.VolunteerAvailability;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VolunteerProfileResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private VehicleType vehicleType;
    private String vehicleNumber;
    private VolunteerAvailability availabilityStatus;
    private VerificationStatus verificationStatus;
    private ZonedDateTime createdAt;
}
