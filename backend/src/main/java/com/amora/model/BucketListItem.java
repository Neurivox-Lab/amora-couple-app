package com.amora.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bucket_list_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BucketListItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private Couple couple;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // TRAVEL, EXPERIENCES, ROMANCE, FOOD, GOALS

    @Builder.Default
    private Boolean isCompleted = false;

    private LocalDate completedAt;

    private String photoUrl;

    private String notes;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
