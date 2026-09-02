package com.amora.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String nickname;

    @Column(unique = true)
    private String phone;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String avatarUrl;

    private LocalDate birthday;

    private String loveLanguage; // Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, Physical Touch

    private String fcmToken;

    private Long coupleId;

    private String currentMood; // in_love, happy, chill, tired, need_hugs, stressed

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
