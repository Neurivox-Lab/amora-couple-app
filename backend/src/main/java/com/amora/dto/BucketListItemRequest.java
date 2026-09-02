package com.amora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BucketListItemRequest {
    private String title;
    private String category; // TRAVEL, EXPERIENCES, ROMANCE, FOOD, GOALS
    private Boolean isCompleted;
    private LocalDate completedAt;
    private String photoUrl;
    private String notes;
}
