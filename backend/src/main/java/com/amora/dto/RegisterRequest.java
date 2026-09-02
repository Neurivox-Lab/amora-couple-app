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
public class RegisterRequest {
    private String name;
    private String nickname;
    private String phone;
    private String email;
    private String password;
    private LocalDate birthday;
    private String avatarUrl;
    private String loveLanguage;
}
