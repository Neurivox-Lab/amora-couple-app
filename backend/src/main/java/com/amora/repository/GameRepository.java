package com.amora.repository;

import com.amora.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByGameType(String gameType);
    List<Game> findByCategory(String category);
}
