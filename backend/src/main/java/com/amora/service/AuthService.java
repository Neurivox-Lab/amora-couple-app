package com.amora.service;

import com.amora.dto.*;
import com.amora.model.Couple;
import com.amora.model.User;
import com.amora.repository.CoupleRepository;
import com.amora.repository.UserRepository;
import com.amora.security.JwtService;
import com.amora.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank() && userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (request.getPhone() != null && !request.getPhone().isBlank() && userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .nickname(request.getNickname())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(request.getPassword() != null && !request.getPassword().isBlank()
                        ? passwordEncoder.encode(request.getPassword())
                        : passwordEncoder.encode("Password123!"))
                .birthday(request.getBirthday())
                .avatarUrl(request.getAvatarUrl() != null ? request.getAvatarUrl() : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getName())
                .loveLanguage(request.getLoveLanguage() != null ? request.getLoveLanguage() : "Quality Time")
                .currentMood("happy")
                .build();

        User savedUser = userRepository.save(user);
        UserDetails userDetails = new UserPrincipal(savedUser);
        String token = jwtService.generateToken(userDetails, savedUser.getId());

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(savedUser))
                .couple(null)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        String identifier = request.getIdentifier();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, request.getPassword())
        );

        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserDetails userDetails = new UserPrincipal(user);
        String token = jwtService.generateToken(userDetails, user.getId());

        CoupleDto coupleDto = null;
        if (user.getCoupleId() != null) {
            Couple couple = coupleRepository.findById(user.getCoupleId()).orElse(null);
            if (couple != null) {
                coupleDto = mapToCoupleDto(couple);
            }
        }

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(user))
                .couple(coupleDto)
                .build();
    }

    public UserDto getCurrentUser(User user) {
        return mapToUserDto(user);
    }

    public UserDto mapToUserDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .birthday(user.getBirthday())
                .loveLanguage(user.getLoveLanguage())
                .coupleId(user.getCoupleId())
                .currentMood(user.getCurrentMood())
                .build();
    }

    public CoupleDto mapToCoupleDto(Couple couple) {
        if (couple == null) return null;
        int daysTogether = 0;
        if (couple.getRelationshipStartDate() != null) {
            daysTogether = (int) ChronoUnit.DAYS.between(couple.getRelationshipStartDate(), LocalDate.now());
            if (daysTogether < 0) daysTogether = 0;
        }

        return CoupleDto.builder()
                .id(couple.getId())
                .coupleCode(couple.getCoupleCode())
                .partner1(mapToUserDto(couple.getPartner1()))
                .partner2(mapToUserDto(couple.getPartner2()))
                .relationshipStartDate(couple.getRelationshipStartDate())
                .anniversaryDate(couple.getAnniversaryDate())
                .streakCount(couple.getStreakCount())
                .daysTogether(daysTogether)
                .moodPartner1(couple.getMoodPartner1())
                .moodPartner2(couple.getMoodPartner2())
                .totalHearts(couple.getTotalHearts())
                .status(couple.getStatus())
                .build();
    }
}
