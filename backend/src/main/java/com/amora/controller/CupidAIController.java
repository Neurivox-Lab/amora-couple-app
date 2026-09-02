package com.amora.controller;

import com.amora.dto.CupidAIRequest;
import com.amora.dto.CupidAIResponse;
import com.amora.security.UserPrincipal;
import com.amora.service.CupidAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cupid-ai")
@RequiredArgsConstructor
public class CupidAIController {

    private final CupidAIService cupidAIService;

    @PostMapping("/generate")
    public ResponseEntity<CupidAIResponse> generate(@AuthenticationPrincipal UserPrincipal principal,
                                                    @RequestBody CupidAIRequest request) {
        return ResponseEntity.ok(cupidAIService.generate(principal.getUser(), request));
    }
}
