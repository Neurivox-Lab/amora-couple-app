package com.amora.repository;

import com.amora.model.Couple;
import com.amora.model.LoveNote;
import com.amora.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoveNoteRepository extends JpaRepository<LoveNote, Long> {
    List<LoveNote> findByCoupleOrderByCreatedAtDesc(Couple couple);
    List<LoveNote> findByCoupleAndReceiverOrderByCreatedAtDesc(Couple couple, User receiver);
}
