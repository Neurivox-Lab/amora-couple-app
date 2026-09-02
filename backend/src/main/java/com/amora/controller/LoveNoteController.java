package com.amora.controller;

import com.amora.dto.LoveNoteRequest;
import com.amora.model.LoveNote;
import com.amora.security.UserPrincipal;
import com.amora.service.LoveNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/love-notes")
@RequiredArgsConstructor
public class LoveNoteController {

    private final LoveNoteService loveNoteService;

    @GetMapping
    public ResponseEntity<List<LoveNote>> getCoupleNotes(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(loveNoteService.getCoupleNotes(principal.getUser()));
    }

    @PostMapping
    public ResponseEntity<LoveNote> createNote(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestBody LoveNoteRequest request) {
        return ResponseEntity.ok(loveNoteService.createLoveNote(principal.getUser(), request));
    }

    @PutMapping("/{id}/open")
    public ResponseEntity<LoveNote> openNote(@AuthenticationPrincipal UserPrincipal principal,
                                             @PathVariable Long id) {
        return ResponseEntity.ok(loveNoteService.openNote(principal.getUser(), id));
    }
}
