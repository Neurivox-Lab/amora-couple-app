package com.amora.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "date_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private Couple couple;

    @Column(nullable = false)
    private String title;

    private String mood; // Romantic, Fun, Relaxing, Adventure, Foodie, Movie

    private String budgetCategory; // ₹0-500, ₹500-1500, ₹1500+

    private String duration; // 2 hours, Half day, Full day

    @Column(length = 4000)
    private String itineraryJson; // Timed items array in JSON

    private Integer estimatedCost;

    @Builder.Default
    private String status = "PLANNED"; // PLANNED, COMPLETED, SCRAPPED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
