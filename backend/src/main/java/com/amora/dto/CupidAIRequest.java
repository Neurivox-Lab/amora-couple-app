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
public class CupidAIRequest {
    private String mode; // DATE_PLANNER, LOVE_LETTER, CONVERSATION_STARTER, SURPRISE_ME, CONFLICT_COACH, MEMORY_CAPTION
    private String prompt;
    private String mood;
    private String budget;
    private String duration;
    private String tone; // Romantic, Cute, Funny, Deep, Poetic
}
