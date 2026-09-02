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
public class CoupleDto {
    private Long id;
    private String coupleCode;
    private UserDto partner1;
    private UserDto partner2;
    private LocalDate relationshipStartDate;
    private LocalDate anniversaryDate;
    private Integer streakCount;
    private Integer daysTogether;
    private String moodPartner1;
    private String moodPartner2;
    private Integer totalHearts;
    private String status; // PENDING, ACTIVE
}
