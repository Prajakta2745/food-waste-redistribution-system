package com.foodredistribution.dto.request;

import com.foodredistribution.enums.OrganizationType;
import com.foodredistribution.enums.Role;
import com.foodredistribution.enums.VehicleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    // Common User fields
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotNull(message = "Role is required")
    private Role role;

    // Common Profile Address fields
    private String address;
    private String city;
    private String state;
    private String description;

    // Food Provider specific
    private String organizationName;
    private OrganizationType organizationType;

    // NGO specific
    private String registrationNumber;
    private String contactPerson;
    private String serviceArea;

    // Volunteer specific
    private VehicleType vehicleType;
    private String vehicleNumber;
}
