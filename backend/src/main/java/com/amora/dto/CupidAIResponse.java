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
public class CupidAIResponse {
    private String title;
    private String content;
    private List<String> suggestions;
    private String estimatedCost;
    private String tone;
}
