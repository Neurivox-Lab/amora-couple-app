package com.amora.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "game_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(nullable = false, length = 1000)
    private String prompt;

    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    private String correctAnswer; // For trivia/guess

    @Builder.Default
    private Integer level = 1;

    @Builder.Default
    private Integer spiceLevel = 1; // 1 (Sweet) to 3 (Spicy 🔥)
}
