package com.amora.service;

import com.amora.dto.*;
import com.amora.model.Couple;
import com.amora.model.Nudge;
import com.amora.model.User;
import com.amora.repository.CoupleRepository;
import com.amora.repository.NudgeRepository;
import com.amora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CoupleService {

    private final CoupleRepository coupleRepository;
    private final UserRepository userRepository;
    private final NudgeRepository nudgeRepository;
    private final AuthService authService;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final Random random = new SecureRandom();

    public String generateUniqueCode() {
        StringBuilder sb = new StringBuilder("AM-");
        for (int i = 0; i < 4; i++) {
            sb.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
        }
        return sb.toString();
    }

    @Transactional
    public CoupleDto createOrGetInviteCode(User user) {
        if (user.getCoupleId() != null) {
            Couple couple = coupleRepository.findById(user.getCoupleId()).orElse(null);
            if (couple != null) {
                return authService.mapToCoupleDto(couple);
            }
        }

        String code;
        do {
            code = generateUniqueCode();
        } while (coupleRepository.findByCoupleCode(code).isPresent());

        Couple couple = Couple.builder()
                .coupleCode(code)
                .partner1(user)
                .partner2(null)
                .relationshipStartDate(LocalDate.now().minusMonths(6)) // Default 6 months ago, editable
                .anniversaryDate(LocalDate.now().plusMonths(6))
                .streakCount(1)
                .lastInteractionDate(LocalDate.now())
                .moodPartner1(user.getCurrentMood() != null ? user.getCurrentMood() : "in_love")
                .totalHearts(100)
                .status("PENDING")
                .build();

        Couple savedCouple = coupleRepository.save(couple);
        user.setCoupleId(savedCouple.getId());
        userRepository.save(user);

        return authService.mapToCoupleDto(savedCouple);
    }

    @Transactional
    public CoupleDto pairWithCode(User user, PairRequest request) {
        if (request.getCoupleCode() == null || request.getCoupleCode().trim().isBlank()) {
            throw new IllegalArgumentException("Couple code cannot be empty");
        }

        String formattedCode = request.getCoupleCode().trim().toUpperCase();
        if (!formattedCode.startsWith("AM-") && formattedCode.length() == 4) {
            formattedCode = "AM-" + formattedCode;
        }

        Couple couple = coupleRepository.findByCoupleCode(formattedCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid couple code. Please check and try again."));

        if (couple.getPartner1().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You cannot pair with your own invite code!");
        }

        if (couple.getPartner2() != null && !couple.getPartner2().getId().equals(user.getId())) {
            throw new IllegalStateException("This couple code has already been paired.");
        }

        couple.setPartner2(user);
        couple.setStatus("ACTIVE");
        if (request.getRelationshipStartDate() != null) {
            couple.setRelationshipStartDate(request.getRelationshipStartDate());
        }
        if (request.getAnniversaryDate() != null) {
            couple.setAnniversaryDate(request.getAnniversaryDate());
        }
        couple.setMoodPartner2(user.getCurrentMood() != null ? user.getCurrentMood() : "happy");

        Couple savedCouple = coupleRepository.save(couple);
        user.setCoupleId(savedCouple.getId());
        userRepository.save(user);

        CoupleDto coupleDto = authService.mapToCoupleDto(savedCouple);

        // Notify both partners via WebSocket
        try {
            messagingTemplate.convertAndSend("/topic/couple/" + savedCouple.getId(), coupleDto);
        } catch (Exception ignored) {
        }

        return coupleDto;
    }

    public CoupleDto getCoupleStatus(User user) {
        if (user.getCoupleId() == null) {
            return null;
        }
        Couple couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));
        return authService.mapToCoupleDto(couple);
    }

    @Transactional
    public CoupleDto updateMood(User user, MoodUpdateRequest request) {
        if (user.getCoupleId() == null) {
            user.setCurrentMood(request.getMood());
            userRepository.save(user);
            return null;
        }

        Couple couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));

        user.setCurrentMood(request.getMood());
        userRepository.save(user);

        if (couple.getPartner1() != null && couple.getPartner1().getId().equals(user.getId())) {
            couple.setMoodPartner1(request.getMood());
        } else if (couple.getPartner2() != null && couple.getPartner2().getId().equals(user.getId())) {
            couple.setMoodPartner2(request.getMood());
        }

        Couple saved = coupleRepository.save(couple);
        CoupleDto dto = authService.mapToCoupleDto(saved);

        try {
            messagingTemplate.convertAndSend("/topic/couple/" + couple.getId() + "/mood", dto);
        } catch (Exception ignored) {
        }

        return dto;
    }

    @Transactional
    public Nudge sendNudge(User user, NudgeRequest request) {
        if (user.getCoupleId() == null) {
            throw new IllegalArgumentException("You must be paired to send a nudge");
        }

        Couple couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));

        User receiver = (couple.getPartner1() != null && couple.getPartner1().getId().equals(user.getId()))
                ? couple.getPartner2()
                : couple.getPartner1();

        if (receiver == null) {
            throw new IllegalStateException("Partner is not yet connected");
        }

        Nudge nudge = Nudge.builder()
                .couple(couple)
                .sender(user)
                .receiver(receiver)
                .nudgeType(request.getNudgeType() != null ? request.getNudgeType() : "HUG")
                .message(request.getMessage())
                .isRead(false)
                .build();

        Nudge savedNudge = nudgeRepository.save(nudge);

        // Award +5 hearts for sweet interaction
        couple.setTotalHearts(couple.getTotalHearts() + 5);
        coupleRepository.save(couple);

        try {
            messagingTemplate.convertAndSend("/topic/couple/" + couple.getId() + "/nudge", savedNudge);
        } catch (Exception ignored) {
        }

        return savedNudge;
    }

    public List<Nudge> getRecentNudges(User user) {
        if (user.getCoupleId() == null) return List.of();
        Couple couple = coupleRepository.findById(user.getCoupleId()).orElse(null);
        if (couple == null) return List.of();
        return nudgeRepository.findByCoupleOrderBySentAtDesc(couple);
    }
}
