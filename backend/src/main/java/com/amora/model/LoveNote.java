package com.amora.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "love_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoveNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private Couple couple;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Builder.Default
    private String category = "LOVE_NOTE"; // LOVE_NOTE, OPEN_WHEN, TIME_CAPSULE

    private String title;

    @Column(nullable = false, length = 3000)
    private String message;

    private String unlockCondition; // SAD, MISS_YOU, BIRTHDAY, ANNIVERSARY, DATE_TIME

    private LocalDateTime scheduledAt;

    @Builder.Default
    private Boolean isOpened = false;

    private LocalDateTime openedAt;

    private String paperTheme; // rose, vintage, lavender, star

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
