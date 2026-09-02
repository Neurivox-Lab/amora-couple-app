package com.amora.service;

import com.amora.dto.*;
import com.amora.model.*;
import com.amora.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;
    private final GameQuestionRepository questionRepository;
    private final GameSessionRepository sessionRepository;
    private final GameAnswerRepository answerRepository;
    private final DailyQuestionRepository dailyQuestionRepository;
    private final DailyAnswerRepository dailyAnswerRepository;
    private final CoupleRepository coupleRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<GameDto> getAllGames() {
        List<Game> games = gameRepository.findAll();
        return games.stream().map(g -> {
            List<GameQuestion> questions = questionRepository.findByGame(g);
            return GameDto.builder()
                    .id(g.getId())
                    .title(g.getTitle())
                    .description(g.getDescription())
                    .gameType(g.getGameType())
                    .category(g.getCategory())
                    .iconName(g.getIconName())
                    .gradientStart(g.getGradientStart())
                    .gradientEnd(g.getGradientEnd())
                    .questionCount(questions.size())
                    .build();
        }).collect(Collectors.toList());
    }

    public List<GameDto> getGamesByType(String type) {
        return gameRepository.findByGameType(type).stream().map(g -> {
            List<GameQuestion> questions = questionRepository.findByGame(g);
            return GameDto.builder()
                    .id(g.getId())
                    .title(g.getTitle())
                    .description(g.getDescription())
                    .gameType(g.getGameType())
                    .category(g.getCategory())
                    .iconName(g.getIconName())
                    .gradientStart(g.getGradientStart())
                    .gradientEnd(g.getGradientEnd())
                    .questionCount(questions.size())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public GameSessionDto startOrGetSession(User user, Long gameId) {
        if (user.getCoupleId() == null) {
            throw new IllegalArgumentException("User is not in a couple");
        }

        Couple couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));

        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found"));

        GameSession session = sessionRepository.findFirstByCoupleAndGameIdAndStatus(couple, gameId, "IN_PROGRESS")
                .orElseGet(() -> {
                    GameSession newSession = GameSession.builder()
                            .couple(couple)
                            .game(game)
                            .status("IN_PROGRESS")
                            .partner1Score(0)
                            .partner2Score(0)
                            .startedAt(LocalDateTime.now())
                            .build();
                    return sessionRepository.save(newSession);
                });

        return buildGameSessionDto(session, user);
    }

    @Transactional
    public GameSessionDto submitAnswer(User user, GameAnswerRequest request) {
        GameSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));

        GameQuestion question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        // Save or update answer
        GameAnswer answer = answerRepository.findBySessionAndQuestionAndUser(session, question, user)
                .orElse(GameAnswer.builder()
                        .session(session)
                        .question(question)
                        .user(user)
                        .build());

        answer.setAnswerText(request.getAnswerText());
        answer.setAnsweredAt(LocalDateTime.now());
        answerRepository.save(answer);

        // Check if partner also answered
        List<GameAnswer> answersForQuestion = answerRepository.findBySessionIdAndQuestionId(session.getId(), question.getId());
        if (answersForQuestion.size() >= 2) {
            // Both answered! Award +10 points and bonus if matching
            Couple couple = session.getCouple();
            boolean match = answersForQuestion.get(0).getAnswerText().equalsIgnoreCase(answersForQuestion.get(1).getAnswerText());
            couple.setTotalHearts(couple.getTotalHearts() + (match ? 15 : 10));
            coupleRepository.save(couple);
        }

        GameSessionDto updatedDto = buildGameSessionDto(session, user);

        // Broadcast to partner in real-time
        try {
            messagingTemplate.convertAndSend("/topic/session/" + session.getId(), updatedDto);
        } catch (Exception ignored) {
        }

        return updatedDto;
    }

    private GameSessionDto buildGameSessionDto(GameSession session, User currentUser) {
        List<GameQuestion> questions = questionRepository.findByGame(session.getGame());
        List<GameAnswer> allAnswers = answerRepository.findBySession(session);

        Couple couple = session.getCouple();
        User partner = null;
        if (couple.getPartner1() != null && couple.getPartner1().getId().equals(currentUser.getId())) {
            partner = couple.getPartner2();
        } else if (couple.getPartner2() != null) {
            partner = couple.getPartner1();
        }

        final User finalPartner = partner;

        List<GameQuestionDto> questionDtos = questions.stream().map(q -> {
            GameAnswer myAns = allAnswers.stream()
                    .filter(a -> a.getQuestion().getId().equals(q.getId()) && a.getUser().getId().equals(currentUser.getId()))
                    .findFirst().orElse(null);

            GameAnswer partnerAns = (finalPartner != null) ? allAnswers.stream()
                    .filter(a -> a.getQuestion().getId().equals(q.getId()) && a.getUser().getId().equals(finalPartner.getId()))
                    .findFirst().orElse(null) : null;

            boolean bothAnswered = (myAns != null && partnerAns != null);
            boolean isMatch = bothAnswered && myAns.getAnswerText().equalsIgnoreCase(partnerAns.getAnswerText());

            return GameQuestionDto.builder()
                    .id(q.getId())
                    .gameId(session.getGame().getId())
                    .prompt(q.getPrompt())
                    .optionA(q.getOptionA())
                    .optionB(q.getOptionB())
                    .optionC(q.getOptionC())
                    .optionD(q.getOptionD())
                    .level(q.getLevel())
                    .spiceLevel(q.getSpiceLevel())
                    .myAnswer(myAns != null ? myAns.getAnswerText() : null)
                    .partnerAnswer(bothAnswered ? partnerAns.getAnswerText() : (partnerAns != null ? "LOCKED" : null))
                    .bothAnswered(bothAnswered)
                    .isMatch(isMatch)
                    .build();
        }).collect(Collectors.toList());

        long answeredCount = questionDtos.stream().filter(GameQuestionDto::isBothAnswered).count();

        GameDto gameDto = GameDto.builder()
                .id(session.getGame().getId())
                .title(session.getGame().getTitle())
                .description(session.getGame().getDescription())
                .gameType(session.getGame().getGameType())
                .category(session.getGame().getCategory())
                .iconName(session.getGame().getIconName())
                .gradientStart(session.getGame().getGradientStart())
                .gradientEnd(session.getGame().getGradientEnd())
                .questionCount(questions.size())
                .build();

        return GameSessionDto.builder()
                .id(session.getId())
                .coupleId(session.getCouple().getId())
                .game(gameDto)
                .status(session.getStatus())
                .partner1Score(session.getPartner1Score())
                .partner2Score(session.getPartner2Score())
                .totalQuestions(questions.size())
                .answeredQuestions((int) answeredCount)
                .questions(questionDtos)
                .startedAt(session.getStartedAt())
                .build();
    }

    // Daily Question ("Our Day")
    public DailyQuestionDto getDailyQuestion(User user) {
        LocalDate today = LocalDate.now();
        DailyQuestion question = dailyQuestionRepository.findByActiveDate(today)
                .orElseGet(() -> {
                    List<DailyQuestion> all = dailyQuestionRepository.findAll();
                    if (!all.isEmpty()) {
                        int index = (int) (Math.abs(today.toEpochDay()) % all.size());
                        return all.get(index);
                    }
                    return dailyQuestionRepository.save(DailyQuestion.builder()
                            .prompt("What is one small thing your partner did recently that made you smile?")
                            .category("LOVE")
                            .activeDate(today)
                            .build());
                });

        if (user.getCoupleId() == null) {
            return DailyQuestionDto.builder()
                    .id(question.getId())
                    .prompt(question.getPrompt())
                    .category(question.getCategory())
                    .activeDate(question.getActiveDate() != null ? question.getActiveDate() : today)
                    .build();
        }

        Couple couple = coupleRepository.findById(user.getCoupleId()).orElse(null);
        if (couple == null) {
            return DailyQuestionDto.builder()
                    .id(question.getId())
                    .prompt(question.getPrompt())
                    .category(question.getCategory())
                    .activeDate(today)
                    .build();
        }

        List<DailyAnswer> answers = dailyAnswerRepository.findByCoupleAndDailyQuestion(couple, question);
        DailyAnswer myAns = answers.stream().filter(a -> a.getUser().getId().equals(user.getId())).findFirst().orElse(null);
        DailyAnswer partnerAns = answers.stream().filter(a -> !a.getUser().getId().equals(user.getId())).findFirst().orElse(null);

        boolean bothAnswered = (myAns != null && partnerAns != null);

        return DailyQuestionDto.builder()
                .id(question.getId())
                .prompt(question.getPrompt())
                .category(question.getCategory())
                .activeDate(question.getActiveDate() != null ? question.getActiveDate() : today)
                .partner1Answer(myAns != null ? myAns.getAnswerText() : null)
                .partner2Answer(bothAnswered ? (partnerAns != null ? partnerAns.getAnswerText() : null) : (partnerAns != null ? "LOCKED" : null))
                .isAnsweredByMe(myAns != null)
                .isAnsweredByPartner(partnerAns != null)
                .bothAnswered(bothAnswered)
                .build();
    }

    @Transactional
    public DailyQuestionDto answerDailyQuestion(User user, DailyAnswerRequest request) {
        if (user.getCoupleId() == null) {
            throw new IllegalArgumentException("User must be in a couple to answer daily question");
        }

        Couple couple = coupleRepository.findById(user.getCoupleId())
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));

        DailyQuestionDto current = getDailyQuestion(user);
        DailyQuestion question = dailyQuestionRepository.findById(current.getId())
                .orElseThrow(() -> new IllegalArgumentException("Daily question not found"));

        DailyAnswer answer = dailyAnswerRepository.findByCoupleAndDailyQuestionAndUser(couple, question, user)
                .orElse(DailyAnswer.builder()
                        .couple(couple)
                        .dailyQuestion(question)
                        .user(user)
                        .build());

        answer.setAnswerText(request.getAnswerText());
        answer.setAnsweredAt(LocalDateTime.now());
        dailyAnswerRepository.save(answer);

        // Streak check & reward
        if (couple.getLastInteractionDate() == null || !couple.getLastInteractionDate().equals(LocalDate.now())) {
            couple.setLastInteractionDate(LocalDate.now());
            couple.setStreakCount(couple.getStreakCount() + 1);
            couple.setTotalHearts(couple.getTotalHearts() + 20);
            coupleRepository.save(couple);
        }

        DailyQuestionDto updated = getDailyQuestion(user);

        try {
            messagingTemplate.convertAndSend("/topic/couple/" + couple.getId() + "/daily-question", updated);
        } catch (Exception ignored) {
        }

        return updated;
    }
}
