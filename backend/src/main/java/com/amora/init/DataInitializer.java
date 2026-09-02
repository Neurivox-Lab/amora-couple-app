package com.amora.init;

import com.amora.model.*;
import com.amora.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;
    private final GameRepository gameRepository;
    private final GameQuestionRepository questionRepository;
    private final DailyQuestionRepository dailyQuestionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (gameRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial data load.");
            return;
        }

        log.info("Seeding starter couple games, questions, and daily prompts...");

        // 1. Seed Games
        Game wyrRomance = gameRepository.save(Game.builder()
                .title("Would You Rather: Romantic & Future")
                .description("Discover your partner's secret dreams, vacation vibes, and relationship preferences.")
                .gameType("WOULD_YOU_RATHER")
                .category("ROMANCE")
                .iconName("heart")
                .gradientStart("#FF6B8B")
                .gradientEnd("#FF8E53")
                .build());

        Game wyrSpicy = gameRepository.save(Game.builder()
                .title("Would You Rather: Late Night & Spicy 🔥")
                .description("Turn up the heat with playful, flirty, and spicy dilemma choices.")
                .gameType("WOULD_YOU_RATHER")
                .category("SPICY")
                .iconName("flame")
                .gradientStart("#FA709A")
                .gradientEnd("#FEE140")
                .build());

        Game moreLikely = gameRepository.save(Game.builder()
                .title("Who Is More Likely To?")
                .description("Vote on who is more likely to do silly, adorable, or chaotic things!")
                .gameType("WHO_IS_MORE_LIKELY")
                .category("FUN")
                .iconName("sparkles")
                .gradientStart("#4FACFE")
                .gradientEnd("#00F2FE")
                .build());

        Game truthOrDare = gameRepository.save(Game.builder()
                .title("Truth or Dare: Couple Edition")
                .description("Intimate questions and spicy dares to test your courage and bond.")
                .gameType("TRUTH_OR_DARE")
                .category("ROMANCE")
                .iconName("zap")
                .gradientStart("#A18CD1")
                .gradientEnd("#FBC2EB")
                .build());

        Game knowMe = gameRepository.save(Game.builder()
                .title("How Well Do You Know Me?")
                .description("Guess your partner's exact favorites, guilty pleasures, and childhood memories.")
                .gameType("GUESS_MY_ANSWER")
                .category("DEEP")
                .iconName("smile")
                .gradientStart("#FF9A8B")
                .gradientEnd("#FF6A88")
                .build());

        // 2. Seed Questions for "Would You Rather: Romantic & Future"
        saveWYR(wyrRomance, "Live in a cozy mountain cabin with a fireplace OR a breezy beachfront villa?", "Mountain Cabin 🏔️", "Beachfront Villa 🏖️", 1);
        saveWYR(wyrRomance, "Have breakfast in bed made by your partner OR cook an extravagant dinner together with wine?", "Breakfast in Bed ☕", "Cook Dinner Together 🍷", 1);
        saveWYR(wyrRomance, "Take a spontaneous 2-week backpacking road trip OR relax at a 5-star luxury all-inclusive resort?", "Road Trip Adventure 🚗", "Luxury Resort 🌴", 1);
        saveWYR(wyrRomance, "Have a huge dream wedding party OR a private intimate elopement in Paris/Maldives?", "Dream Wedding Party 💃", "Private Intimate Elopement 💍", 1);
        saveWYR(wyrRomance, "Never have to do dishes again OR never have to do laundry again?", "No More Dishes 🍽️", "No More Laundry 🧺", 1);
        saveWYR(wyrRomance, "Spend a rainy evening watching movies under a blanket fort OR slow dancing to acoustic songs in the kitchen?", "Movie Blanket Fort 🍿", "Slow Dance in Kitchen 🎶", 1);

        // 3. Seed Questions for "Would You Rather: Spicy 🔥"
        saveWYR(wyrSpicy, "Receive a 20-minute relaxing full-body massage OR give a playful sensual massage with aromatic oils?", "Receive Massage 💆‍♀️", "Give Massage 💆‍♂️", 2);
        saveWYR(wyrSpicy, "Send flirty secret texts during a crowded dinner OR steal passionate kisses in an elevator?", "Flirty Secret Texts 📱", "Elevator Kisses 💋", 3);
        saveWYR(wyrSpicy, "Wake up to gentle kisses and cuddling OR spontaneous late-night adventures under moonlight?", "Morning Cuddles 🌅", "Midnight Adventures 🌙", 2);
        saveWYR(wyrSpicy, "A romantic bubble bath with candles & champagne OR skinny dipping in a private secluded pool?", "Candlelit Bubble Bath 🛁", "Private Skinny Dipping 🌊", 3);
        saveWYR(wyrSpicy, "Whisper secrets in my ear all night OR hold hands and never let go the whole day?", "Whisper Secrets 🤫", "Hold Hands All Day 🤝", 2);

        // 4. Seed Questions for "Who Is More Likely To?"
        saveMoreLikely(moreLikely, "Who is more likely to fall asleep 10 minutes into a movie?", 1);
        saveMoreLikely(moreLikely, "Who is more likely to get lost even with Google Maps open?", 1);
        saveMoreLikely(moreLikely, "Who is more likely to start singing loudly in the shower?", 1);
        saveMoreLikely(moreLikely, "Who is more likely to buy something silly and useless online at 2 AM?", 1);
        saveMoreLikely(moreLikely, "Who takes longer to get ready before going out?", 1);
        saveMoreLikely(moreLikely, "Who is more likely to eat the last slice of pizza without asking?", 1);
        saveMoreLikely(moreLikely, "Who gets dramatic over a tiny cold or papercut?", 1);
        saveMoreLikely(moreLikely, "Who says 'I'm not hungry' then eats half your fries?", 1);

        // 5. Seed Truth or Dare Questions
        saveTruthOrDare(truthOrDare, "Truth: What was the exact moment or first impression when you fell for me?", "TRUTH", 1);
        saveTruthOrDare(truthOrDare, "Dare: Give your partner a 2-minute foot or shoulder massage right now without stopping.", "DARE", 1);
        saveTruthOrDare(truthOrDare, "Truth: What is one secret outfit or hairstyle you think I look insanely attractive in?", "TRUTH", 2);
        saveTruthOrDare(truthOrDare, "Dare: Stare into each other's eyes for 60 seconds without laughing or looking away.", "DARE", 1);
        saveTruthOrDare(truthOrDare, "Truth: If you could change one funny habit of mine, what would it be?", "TRUTH", 1);
        saveTruthOrDare(truthOrDare, "Dare: Send a 10-second voice note describing your favorite physical feature of mine.", "DARE", 2);

        // 6. Seed How Well Do You Know Me?
        saveKnowMe(knowMe, "What is my dream travel destination?", "Japan 🇯🇵", "Switzerland 🇨🇭", "Maldives 🏝️", "Paris 🥐");
        saveKnowMe(knowMe, "What is my go-to comfort food when I've had a tough day?", "Pizza / Pasta 🍕", "Ice Cream / Chocolate 🍫", "Biryani / Curry 🍛", "Burgers & Fries 🍔");
        saveKnowMe(knowMe, "What is my absolute biggest pet peeve?", "People being late ⏰", "Chewing loudly 🍽️", "Not listening 🙉", "Slow Wi-Fi 📶");
        saveKnowMe(knowMe, "What's my favorite way to spend a lazy Sunday morning?", "Sleeping in till noon 😴", "Coffee & Reading ☕", "Going for a morning walk 🌿", "Making big pancakes 🥞");

        // 7. Seed Daily Questions ("Our Day")
        List<String> dailyPrompts = List.of(
                "What is one small thing your partner did recently that made you feel deeply loved?",
                "If you could teleport us anywhere in the world for 3 hours tonight, where would we go?",
                "What's a funny inside joke between us that never fails to make you smile?",
                "What's one song that instantly reminds you of our relationship?",
                "What is your favorite memory of us from this past year?",
                "What is one goal or dream you want us to accomplish together before this year ends?",
                "What nickname or gesture of mine makes your heart flutter the most?",
                "If we opened a cafe or food truck together, what would we name it and what would we sell?"
        );

        for (int i = 0; i < dailyPrompts.size(); i++) {
            dailyQuestionRepository.save(DailyQuestion.builder()
                    .prompt(dailyPrompts.get(i))
                    .category("LOVE")
                    .activeDate(LocalDate.now().plusDays(i))
                    .build());
        }

        // 8. Seed Demo Users & Couple (Srinija & Partner)
        User srinija = userRepository.save(User.builder()
                .name("Srinija")
                .nickname("Sri ❤️")
                .email("srinija@amora.love")
                .phone("+919876543210")
                .password(passwordEncoder.encode("Password123!"))
                .birthday(LocalDate.of(2000, 1, 16))
                .loveLanguage("Quality Time")
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=Srinija&gender=female")
                .currentMood("in_love")
                .build());

        User partner = userRepository.save(User.builder()
                .name("Partner")
                .nickname("Babe 🥰")
                .email("partner@amora.love")
                .phone("+919876543211")
                .password(passwordEncoder.encode("Password123!"))
                .birthday(LocalDate.of(1999, 8, 22))
                .loveLanguage("Physical Touch")
                .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&gender=male")
                .currentMood("happy")
                .build());

        Couple demoCouple = coupleRepository.save(Couple.builder()
                .coupleCode("AM-8X7K")
                .partner1(srinija)
                .partner2(partner)
                .relationshipStartDate(LocalDate.now().minusDays(428))
                .anniversaryDate(LocalDate.now().plusMonths(4))
                .streakCount(12)
                .lastInteractionDate(LocalDate.now())
                .moodPartner1("in_love")
                .moodPartner2("happy")
                .totalHearts(350)
                .status("ACTIVE")
                .build());

        srinija.setCoupleId(demoCouple.getId());
        partner.setCoupleId(demoCouple.getId());
        userRepository.save(srinija);
        userRepository.save(partner);

        log.info("Initialization completed successfully! Demo couple code: AM-8X7K");
    }

    private void saveWYR(Game game, String prompt, String optionA, String optionB, int spiceLevel) {
        questionRepository.save(GameQuestion.builder()
                .game(game)
                .prompt(prompt)
                .optionA(optionA)
                .optionB(optionB)
                .spiceLevel(spiceLevel)
                .level(1)
                .build());
    }

    private void saveMoreLikely(Game game, String prompt, int level) {
        questionRepository.save(GameQuestion.builder()
                .game(game)
                .prompt(prompt)
                .optionA("Me 🙋‍♀️")
                .optionB("My Partner 🙋‍♂️")
                .optionC("Both of Us 👫")
                .level(level)
                .spiceLevel(1)
                .build());
    }

    private void saveTruthOrDare(Game game, String prompt, String type, int spiceLevel) {
        questionRepository.save(GameQuestion.builder()
                .game(game)
                .prompt(prompt)
                .optionA(type.equals("TRUTH") ? "I answered honestly ❤️" : "Dare Completed 🔥")
                .optionB("Passed / Chicken Out 🐔")
                .level(1)
                .spiceLevel(spiceLevel)
                .build());
    }

    private void saveKnowMe(Game game, String prompt, String optA, String optB, String optC, String optD) {
        questionRepository.save(GameQuestion.builder()
                .game(game)
                .prompt(prompt)
                .optionA(optA)
                .optionB(optB)
                .optionC(optC)
                .optionD(optD)
                .level(1)
                .spiceLevel(1)
                .build());
    }
}
