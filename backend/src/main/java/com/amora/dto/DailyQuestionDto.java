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
public class DailyQuestionDto {
    private Long id;
    private String prompt;
    private String category;
    private LocalDate activeDate;
    private String partner1Answer;
    private String partner2Answer;
    private boolean isAnsweredByMe;
    private boolean isAnsweredByPartner;
    private boolean bothAnswered;
}
