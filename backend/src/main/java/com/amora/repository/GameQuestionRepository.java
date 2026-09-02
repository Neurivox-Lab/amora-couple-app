package com.amora.repository;

import com.amora.model.Game;
import com.amora.model.GameQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameQuestionRepository extends JpaRepository<GameQuestion, Long> {
    List<GameQuestion> findByGame(Game game);
    List<GameQuestion> findByGameId(Long gameId);
    List<GameQuestion> findByGameIdAndSpiceLevel(Long gameId, Integer spiceLevel);
}
