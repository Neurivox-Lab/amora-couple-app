package com.amora.controller;

import com.amora.dto.*;
import com.amora.security.UserPrincipal;
import com.amora.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameDto>> getAllGames() {
        return ResponseEntity.ok(gameService.getAllGames());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<GameDto>> getGamesByType(@PathVariable String type) {
        return ResponseEntity.ok(gameService.getGamesByType(type));
    }

    @PostMapping("/session/{gameId}")
    public ResponseEntity<GameSessionDto> startSession(@AuthenticationPrincipal UserPrincipal principal,
                                                       @PathVariable Long gameId) {
        return ResponseEntity.ok(gameService.startOrGetSession(principal.getUser(), gameId));
    }

    @PostMapping("/answer")
    public ResponseEntity<GameSessionDto> submitAnswer(@AuthenticationPrincipal UserPrincipal principal,
                                                       @RequestBody GameAnswerRequest request) {
        return ResponseEntity.ok(gameService.submitAnswer(principal.getUser(), request));
    }

    @GetMapping("/daily-question")
    public ResponseEntity<DailyQuestionDto> getDailyQuestion(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(gameService.getDailyQuestion(principal.getUser()));
    }

    @PostMapping("/daily-question/answer")
    public ResponseEntity<DailyQuestionDto> answerDailyQuestion(@AuthenticationPrincipal UserPrincipal principal,
                                                                @RequestBody DailyAnswerRequest request) {
        return ResponseEntity.ok(gameService.answerDailyQuestion(principal.getUser(), request));
    }
}
