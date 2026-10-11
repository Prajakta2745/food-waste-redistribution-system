package com.foodredistribution.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    // General counters
    private Map<String, Long> metrics;

    // Optional list of recent items for quick dashboard rendering
    private Object recentActivity;
}
