package com.amora.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "couple_challenges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoupleChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private Couple couple;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String challengeType; // TODAY, WEEKEND, SEVEN_DAY, THIRTY_DAY

    @Builder.Default
    private Integer totalDays = 7;

    @Builder.Default
    private Integer completedDays = 0;

    @Builder.Default
    private Boolean isCompleted = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
