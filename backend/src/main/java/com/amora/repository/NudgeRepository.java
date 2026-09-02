package com.amora.repository;

import com.amora.model.Couple;
import com.amora.model.Nudge;
import com.amora.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NudgeRepository extends JpaRepository<Nudge, Long> {
    List<Nudge> findByCoupleOrderBySentAtDesc(Couple couple);
    List<Nudge> findByReceiverAndIsReadFalseOrderBySentAtDesc(User receiver);
}
