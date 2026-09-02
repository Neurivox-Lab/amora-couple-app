package com.amora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatePlanRequest {
    private String title;
    private String mood;
    private String budgetCategory;
    private String duration;
    private String itineraryJson;
    private Integer estimatedCost;
}
