package com.amora.repository;

import com.amora.model.Couple;
import com.amora.model.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    List<GameSession> findByCoupleOrderByStartedAtDesc(Couple couple);
    Optional<GameSession> findFirstByCoupleAndGameIdAndStatus(Couple couple, Long gameId, String status);
}
