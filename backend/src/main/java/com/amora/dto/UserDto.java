package com.amora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String nickname;
    private String phone;
    private String email;
    private String avatarUrl;
    private LocalDate birthday;
    private String loveLanguage;
    private Long coupleId;
    private String currentMood;
}
