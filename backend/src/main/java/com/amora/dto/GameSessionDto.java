package com.amora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameSessionDto {
    private Long id;
    private Long coupleId;
    private GameDto game;
    private String status;
    private Integer partner1Score;
    private Integer partner2Score;
    private Integer totalQuestions;
    private Integer answeredQuestions;
    private List<GameQuestionDto> questions;
    private LocalDateTime startedAt;
}
