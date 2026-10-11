package com.foodredistribution.dto.response;

import com.foodredistribution.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequestResponse {
    private Long id;
    private Long donationId;
    private String foodName;
    private Long ngoId;
    private String ngoName;
    private RequestStatus requestStatus;
    private ZonedDateTime requestedAt;
    private ZonedDateTime acceptedAt;
    private String rejectionReason;
}
