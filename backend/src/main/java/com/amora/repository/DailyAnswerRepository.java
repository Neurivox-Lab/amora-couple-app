package com.amora.repository;

import com.amora.model.Couple;
import com.amora.model.DailyAnswer;
import com.amora.model.DailyQuestion;
import com.amora.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DailyAnswerRepository extends JpaRepository<DailyAnswer, Long> {
    List<DailyAnswer> findByCoupleAndDailyQuestion(Couple couple, DailyQuestion dailyQuestion);
    Optional<DailyAnswer> findByCoupleAndDailyQuestionAndUser(Couple couple, DailyQuestion dailyQuestion, User user);
    List<DailyAnswer> findByCoupleOrderByAnsweredAtDesc(Couple couple);
}
