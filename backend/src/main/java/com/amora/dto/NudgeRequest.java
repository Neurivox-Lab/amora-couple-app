package com.amora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NudgeRequest {
    private String nudgeType; // HUG, KISS, HEARTBEAT, MISS_YOU, MASSAGE, COFFEE
    private String message;
}
