package com.amora.repository;

import com.amora.model.Couple;
import com.amora.model.CoupleChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoupleChallengeRepository extends JpaRepository<CoupleChallenge, Long> {
    List<CoupleChallenge> findByCouple(Couple couple);
}
