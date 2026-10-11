package com.foodredistribution.dto.request;

import com.foodredistribution.enums.PickupStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdatePickupStatusRequest {

    @NotNull(message = "Status is required")
    private PickupStatus status;

    private String notes;
}
