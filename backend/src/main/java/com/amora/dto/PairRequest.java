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
public class PairRequest {
    private String coupleCode;
    private LocalDate relationshipStartDate;
    private LocalDate anniversaryDate;
}
