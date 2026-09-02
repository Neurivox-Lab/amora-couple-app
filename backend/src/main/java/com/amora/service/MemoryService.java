package com.amora.service;

import com.amora.dto.BucketListItemRequest;
import com.amora.dto.MemoryRequest;
import com.amora.model.BucketListItem;
import com.amora.model.Couple;
import com.amora.model.Memory;
import com.amora.model.User;
import com.amora.repository.BucketListItemRepository;
import com.amora.repository.CoupleRepository;
import com.amora.repository.MemoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemoryService {

    private final MemoryRepository memoryRepository;
    private final BucketListItemRepository bucketListItemRepository;
    private final CoupleRepository coupleRepository;

    public List<Memory> getMemories(User user) {
        if (user.getCoupleId() == null) return List.of();
        Couple couple = coupleRepository.findById(user.getCoupleId()).orElse(null);
        if (couple == null) return List.of();
        return memoryRepository.findByCoupleOrderByMemoryDateDesc(couple);
    }

    @Transactional
    public Memory createMemory(User user, MemoryRequest request) {
        if (user.getCoupleId() == null) {
            throw new IllegalArgumentException("User must be in a couple to save a memory");
        }
        Couple couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));

        Memory memory = Memory.builder()
                .couple(couple)
                .title(request.getTitle())
                .description(request.getDescription())
                .memoryDate(request.getMemoryDate() != null ? request.getMemoryDate() : LocalDate.now())
                .locationName(request.getLocationName())
                .mediaUrls(request.getMediaUrls())
                .audioUrl(request.getAudioUrl())
                .moodTag(request.getMoodTag() != null ? request.getMoodTag() : "Romantic")
                .isFavorite(request.getIsFavorite() != null ? request.getIsFavorite() : false)
                .build();

        couple.setTotalHearts(couple.getTotalHearts() + 15);
        coupleRepository.save(couple);

        return memoryRepository.save(memory);
    }

    @Transactional
    public void deleteMemory(User user, Long memoryId) {
        Memory memory = memoryRepository.findById(memoryId)
                .orElseThrow(() -> new IllegalArgumentException("Memory not found"));
        if (!memory.getCouple().getId().equals(user.getCoupleId())) {
            throw new SecurityException("Unauthorized to delete this memory");
        }
        memoryRepository.delete(memory);
    }

    // Bucket List
    public List<BucketListItem> getBucketList(User user) {
        if (user.getCoupleId() == null) return List.of();
        Couple couple = coupleRepository.findById(user.getCoupleId()).orElse(null);
        if (couple == null) return List.of();
        return bucketListItemRepository.findByCoupleOrderByCreatedAtDesc(couple);
    }

    @Transactional
    public BucketListItem addBucketItem(User user, BucketListItemRequest request) {
        if (user.getCoupleId() == null) {
            throw new IllegalArgumentException("User must be in a couple to add a bucket item");
        }
        Couple couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));

        BucketListItem item = BucketListItem.builder()
                .couple(couple)
                .title(request.getTitle())
                .category(request.getCategory() != null ? request.getCategory() : "TRAVEL")
                .isCompleted(request.getIsCompleted() != null ? request.getIsCompleted() : false)
                .completedAt(request.getCompletedAt())
                .photoUrl(request.getPhotoUrl())
                .notes(request.getNotes())
                .build();

        return bucketListItemRepository.save(item);
    }

    @Transactional
    public BucketListItem toggleBucketItem(User user, Long itemId) {
        BucketListItem item = bucketListItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        if (!item.getCouple().getId().equals(user.getCoupleId())) {
            throw new SecurityException("Unauthorized to modify this bucket item");
        }

        item.setIsCompleted(!item.getIsCompleted());
        if (item.getIsCompleted()) {
            item.setCompletedAt(LocalDate.now());
            Couple couple = item.getCouple();
            couple.setTotalHearts(couple.getTotalHearts() + 25);
            coupleRepository.save(couple);
        } else {
            item.setCompletedAt(null);
        }

        return bucketListItemRepository.save(item);
    }
}
