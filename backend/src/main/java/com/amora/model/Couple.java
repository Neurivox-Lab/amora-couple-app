package com.amora.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "couples")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Couple {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 12)
    private String coupleCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "partner_1_id")
    private User partner1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "partner_2_id")
    private User partner2;

    private LocalDate relationshipStartDate;

    private LocalDate anniversaryDate;

    @Builder.Default
    private Integer streakCount = 1;

    private LocalDate lastInteractionDate;

    private String moodPartner1;
    private String moodPartner2;

    @Builder.Default
    private Integer totalHearts = 50;

    @Builder.Default
    private String status = "PENDING"; // PENDING, ACTIVE, PAUSED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
