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
public class MemoryRequest {
    private String title;
    private String description;
    private LocalDate memoryDate;
    private String locationName;
    private String mediaUrls;
    private String audioUrl;
    private String moodTag;
    private Boolean isFavorite;
}
