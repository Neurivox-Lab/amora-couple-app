package com.amora.service;

import com.amora.dto.LoveNoteRequest;
import com.amora.model.Couple;
import com.amora.model.LoveNote;
import com.amora.model.User;
import com.amora.repository.CoupleRepository;
import com.amora.repository.LoveNoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoveNoteService {

    private final LoveNoteRepository loveNoteRepository;
    private final CoupleRepository coupleRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<LoveNote> getCoupleNotes(User user) {
        if (user.getCoupleId() == null) return List.of();
        Couple couple = coupleRepository.findById(user.getCoupleId()).orElse(null);
        if (couple == null) return List.of();
        return loveNoteRepository.findByCoupleOrderByCreatedAtDesc(couple);
    }

    @Transactional
    public LoveNote createLoveNote(User user, LoveNoteRequest request) {
        if (user.getCoupleId() == null) {
            throw new IllegalArgumentException("User must be in a couple to send a note");
        }

        Couple couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));

        User receiver = (couple.getPartner1() != null && couple.getPartner1().getId().equals(user.getId()))
                ? couple.getPartner2()
                : couple.getPartner1();

        if (receiver == null) {
            throw new IllegalStateException("Partner is not yet connected");
        }

        LoveNote note = LoveNote.builder()
                .couple(couple)
                .sender(user)
                .receiver(receiver)
                .category(request.getCategory() != null ? request.getCategory() : "LOVE_NOTE")
                .title(request.getTitle())
                .message(request.getMessage())
                .unlockCondition(request.getUnlockCondition())
                .scheduledAt(request.getScheduledAt())
                .paperTheme(request.getPaperTheme() != null ? request.getPaperTheme() : "rose")
                .isOpened(false)
                .build();

        LoveNote saved = loveNoteRepository.save(note);

        couple.setTotalHearts(couple.getTotalHearts() + 10);
        coupleRepository.save(couple);

        try {
            messagingTemplate.convertAndSend("/topic/couple/" + couple.getId() + "/notes", saved);
        } catch (Exception ignored) {
        }

        return saved;
    }

    @Transactional
    public LoveNote openNote(User user, Long noteId) {
        LoveNote note = loveNoteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        if (!note.getReceiver().getId().equals(user.getId()) && !note.getSender().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to open this note");
        }

        if (!note.getIsOpened() && note.getReceiver().getId().equals(user.getId())) {
            note.setIsOpened(true);
            note.setOpenedAt(LocalDateTime.now());
            loveNoteRepository.save(note);
        }

        return note;
    }
}
