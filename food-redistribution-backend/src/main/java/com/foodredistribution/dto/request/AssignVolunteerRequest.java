package com.foodredistribution.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignVolunteerRequest {

    @NotNull(message = "Volunteer ID is required")
    private Long volunteerId;

    private String notes;
}
