package com.amora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameDto {
    private Long id;
    private String title;
    private String description;
    private String gameType; // WOULD_YOU_RATHER, WHO_IS_MORE_LIKELY, TRUTH_OR_DARE, TRIVIA, GUESS_MY_ANSWER
    private String category;
    private String iconName;
    private String gradientStart;
    private String gradientEnd;
    private Integer questionCount;
    private List<GameQuestionDto> questions;
}
