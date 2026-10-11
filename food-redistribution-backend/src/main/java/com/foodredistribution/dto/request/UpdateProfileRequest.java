package com.foodredistribution.dto.request;

import com.foodredistribution.enums.VehicleType;
import com.foodredistribution.enums.VolunteerAvailability;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone is required")
    private String phone;

    private String address;
    private String city;
    private String state;
    private String description;

    // Food Provider
    private String organizationName;

    // NGO
    private String contactPerson;
    private String serviceArea;

    // Volunteer
    private VehicleType vehicleType;
    private String vehicleNumber;
    private VolunteerAvailability availabilityStatus;
}
