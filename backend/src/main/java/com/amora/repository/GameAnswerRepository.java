package com.amora.repository;

import com.amora.model.GameAnswer;
import com.amora.model.GameQuestion;
import com.amora.model.GameSession;
import com.amora.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameAnswerRepository extends JpaRepository<GameAnswer, Long> {
    List<GameAnswer> findBySession(GameSession session);
    List<GameAnswer> findBySessionId(Long sessionId);
    Optional<GameAnswer> findBySessionAndQuestionAndUser(GameSession session, GameQuestion question, User user);
    List<GameAnswer> findBySessionIdAndQuestionId(Long sessionId, Long questionId);
}
