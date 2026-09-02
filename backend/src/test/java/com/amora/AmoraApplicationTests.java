package com.amora;

import com.amora.dto.*;
import com.amora.model.User;
import com.amora.service.AuthService;
import com.amora.service.CoupleService;
import com.amora.service.GameService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AmoraApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private CoupleService coupleService;

    @Autowired
    private GameService gameService;

    @Test
    void contextLoads() {
        assertNotNull(authService);
        assertNotNull(coupleService);
        assertNotNull(gameService);
    }

    @Test
    @Transactional
    void testRegistrationAndPairingFlow() {
        // Register User A
        RegisterRequest reqA = RegisterRequest.builder()
                .name("Alex")
                .email("alex@test.com")
                .password("Password123!")
                .birthday(LocalDate.of(1998, 5, 20))
                .build();
        AuthResponse resA = authService.register(reqA);
        assertNotNull(resA.getToken());
        assertEquals("Alex", resA.getUser().getName());

        // Get invite code for User A
        User userA = User.builder().id(resA.getUser().getId()).email("alex@test.com").name("Alex").build();
        CoupleDto coupleA = coupleService.createOrGetInviteCode(userA);
        assertNotNull(coupleA.getCoupleCode());
        assertTrue(coupleA.getCoupleCode().startsWith("AM-"));

        // Register User B
        RegisterRequest reqB = RegisterRequest.builder()
                .name("Sam")
                .email("sam@test.com")
                .password("Password123!")
                .birthday(LocalDate.of(1999, 10, 15))
                .build();
        AuthResponse resB = authService.register(reqB);
        assertNotNull(resB.getToken());

        // Pair User B with User A's code
        User userB = User.builder().id(resB.getUser().getId()).email("sam@test.com").name("Sam").build();
        PairRequest pairReq = PairRequest.builder()
                .coupleCode(coupleA.getCoupleCode())
                .relationshipStartDate(LocalDate.of(2023, 1, 1))
                .build();
        CoupleDto paired = coupleService.pairWithCode(userB, pairReq);

        assertEquals("ACTIVE", paired.getStatus());
        assertEquals("Alex", paired.getPartner1().getName());
        assertEquals("Sam", paired.getPartner2().getName());
    }

    @Test
    void testGameQuestionsLoaded() {
        List<GameDto> games = gameService.getAllGames();
        assertFalse(games.isEmpty(), "Games should be seeded by DataInitializer");
        assertTrue(games.size() >= 4);
    }
}
