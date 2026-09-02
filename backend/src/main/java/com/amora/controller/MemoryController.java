package com.amora.controller;

import com.amora.dto.BucketListItemRequest;
import com.amora.dto.MemoryRequest;
import com.amora.model.BucketListItem;
import com.amora.model.Memory;
import com.amora.security.UserPrincipal;
import com.amora.service.MemoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memories")
@RequiredArgsConstructor
public class MemoryController {

    private final MemoryService memoryService;

    @GetMapping
    public ResponseEntity<List<Memory>> getMemories(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(memoryService.getMemories(principal.getUser()));
    }

    @PostMapping
    public ResponseEntity<Memory> createMemory(@AuthenticationPrincipal UserPrincipal principal,
                                               @RequestBody MemoryRequest request) {
        return ResponseEntity.ok(memoryService.createMemory(principal.getUser(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMemory(@AuthenticationPrincipal UserPrincipal principal,
                                             @PathVariable Long id) {
        memoryService.deleteMemory(principal.getUser(), id);
        return ResponseEntity.noContent().build();
    }

    // Bucket List Endpoints
    @GetMapping("/bucket-list")
    public ResponseEntity<List<BucketListItem>> getBucketList(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(memoryService.getBucketList(principal.getUser()));
    }

    @PostMapping("/bucket-list")
    public ResponseEntity<BucketListItem> addBucketItem(@AuthenticationPrincipal UserPrincipal principal,
                                                        @RequestBody BucketListItemRequest request) {
        return ResponseEntity.ok(memoryService.addBucketItem(principal.getUser(), request));
    }

    @PutMapping("/bucket-list/{id}/toggle")
    public ResponseEntity<BucketListItem> toggleBucketItem(@AuthenticationPrincipal UserPrincipal principal,
                                                           @PathVariable Long id) {
        return ResponseEntity.ok(memoryService.toggleBucketItem(principal.getUser(), id));
    }
}
