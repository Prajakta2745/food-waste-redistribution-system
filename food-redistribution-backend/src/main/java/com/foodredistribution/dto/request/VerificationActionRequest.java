package com.foodredistribution.dto.request;

import com.foodredistribution.enums.VerificationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VerificationActionRequest {

    @NotNull(message = "Verification status is required (VERIFIED or REJECTED)")
    private VerificationStatus status;

    private String reason;
}
