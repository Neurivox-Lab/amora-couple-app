package com.amora.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "memories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Memory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private Couple couple;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private LocalDate memoryDate;

    private String locationName;

    @Column(length = 2000)
    private String mediaUrls; // Comma or pipe separated image URLs

    private String audioUrl;

    private String moodTag; // Romantic, Fun, Milestone, Trip, Firsts

    @Builder.Default
    private Boolean isFavorite = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
