package com.amora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameQuestionDto {
    private Long id;
    private Long gameId;
    private String prompt;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private Integer level;
    private Integer spiceLevel;
    private String myAnswer;
    private String partnerAnswer;
    private boolean bothAnswered;
    private boolean isMatch;
}
