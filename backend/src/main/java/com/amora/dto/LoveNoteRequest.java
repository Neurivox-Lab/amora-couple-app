package com.amora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoveNoteRequest {
    private String category; // LOVE_NOTE, OPEN_WHEN, TIME_CAPSULE
    private String title;
    private String message;
    private String unlockCondition; // SAD, MISS_YOU, BIRTHDAY, ANNIVERSARY, DATE_TIME
    private LocalDateTime scheduledAt;
    private String paperTheme;
}
