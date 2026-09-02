package com.amora.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "games")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String gameType; // WOULD_YOU_RATHER, WHO_IS_MORE_LIKELY, TRUTH_OR_DARE, TRIVIA, GUESS_MY_ANSWER

    @Column(nullable = false)
    private String category; // ROMANCE, SPICY, FUN, DEEP, FUTURE, TRAVEL

    private String iconName;
    private String gradientStart;
    private String gradientEnd;
}
