package com.amora.controller;

import com.amora.dto.*;
import com.amora.model.Nudge;
import com.amora.security.UserPrincipal;
import com.amora.service.CoupleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/couples")
@RequiredArgsConstructor
public class CoupleController {

    private final CoupleService coupleService;

    @GetMapping("/invite-code")
    public ResponseEntity<CoupleDto> getInviteCode(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(coupleService.createOrGetInviteCode(principal.getUser()));
    }

    @PostMapping("/pair")
    public ResponseEntity<CoupleDto> pairPartner(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestBody PairRequest request) {
        return ResponseEntity.ok(coupleService.pairWithCode(principal.getUser(), request));
    }

    @GetMapping("/status")
    public ResponseEntity<CoupleDto> getCoupleStatus(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(coupleService.getCoupleStatus(principal.getUser()));
    }

    @PutMapping("/mood")
    public ResponseEntity<CoupleDto> updateMood(@AuthenticationPrincipal UserPrincipal principal,
                                                @RequestBody MoodUpdateRequest request) {
        return ResponseEntity.ok(coupleService.updateMood(principal.getUser(), request));
    }

    @PostMapping("/nudge")
    public ResponseEntity<Nudge> sendNudge(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestBody NudgeRequest request) {
        return ResponseEntity.ok(coupleService.sendNudge(principal.getUser(), request));
    }

    @GetMapping("/nudges")
    public ResponseEntity<List<Nudge>> getRecentNudges(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(coupleService.getRecentNudges(principal.getUser()));
    }
}
