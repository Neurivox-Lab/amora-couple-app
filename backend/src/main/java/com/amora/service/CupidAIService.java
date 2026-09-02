package com.amora.service;

import com.amora.dto.CupidAIRequest;
import com.amora.dto.CupidAIResponse;
import com.amora.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CupidAIService {

    @Value("${app.gemini.api-key:}")
    private String geminiApiKey;

    private final Random random = new Random();

    public CupidAIResponse generate(User user, CupidAIRequest request) {
        String mode = request.getMode() != null ? request.getMode().toUpperCase() : "DATE_PLANNER";
        String mood = request.getMood() != null ? request.getMood() : "Romantic";
        String budget = request.getBudget() != null ? request.getBudget() : "₹500–1500";
        String duration = request.getDuration() != null ? request.getDuration() : "Half day";
        String tone = request.getTone() != null ? request.getTone() : "Romantic";

        // If Gemini API Key is configured, we could query Google Gemini API.
        // For lightning-fast responsiveness and offline resilience, we provide high-grade AI templates and dynamic generators.

        return switch (mode) {
            case "LOVE_LETTER" -> generateLoveLetter(request.getPrompt(), tone, user);
            case "CONVERSATION_STARTER" -> generateConversationStarters(mood);
            case "SURPRISE_ME" -> generateSurpriseIdea(budget, duration);
            case "CONFLICT_COACH" -> generateConflictCoachAdvice(request.getPrompt());
            case "MEMORY_CAPTION" -> generateMemoryCaption(request.getPrompt(), tone);
            default -> generateDateItinerary(mood, budget, duration);
        };
    }

    private CupidAIResponse generateDateItinerary(String mood, String budget, String duration) {
        List<String> suggestions = new ArrayList<>();
        String title;
        String content;
        String cost;

        if (mood.equalsIgnoreCase("Romantic") || mood.equalsIgnoreCase("In Love")) {
            title = "✨ Twilight Sunset & Candlelight Coffee";
            content = "1. ☕ 04:30 PM: Meet at a cozy rooftop or garden cafe for warm lattes & pastries.\n" +
                      "2. 🌅 05:45 PM: Golden hour sunset stroll holding hands in a nearby quiet park or scenic view.\n" +
                      "3. 📸 06:30 PM: Take 3 silly polaroid selfies together with the sunset glow.\n" +
                      "4. 🍝 07:30 PM: Savor a shared wood-fired pizza or pasta dinner with acoustic jazz in the background.";
            suggestions.add("Bring a light jacket for the sunset walk");
            suggestions.add("Play your couple song in the car or on shared earphones");
            cost = budget.contains("500") ? "₹850" : "₹1,400";
        } else if (mood.equalsIgnoreCase("Adventure") || mood.equalsIgnoreCase("Fun")) {
            title = "🎯 Mystery Quest & Arcade Showdown";
            content = "1. 🎳 03:00 PM: Head to bowling, arcade air-hockey, or go-karting (loser buys desserts!).\n" +
                      "2. 🍦 05:00 PM: Try wacky ice cream flavors or street waffle cones.\n" +
                      "3. 🛍️ 06:00 PM: ₹200 Goodwill Challenge: Pick the funniest goofy souvenir for each other in 15 mins.\n" +
                      "4. 🌮 07:30 PM: Tacos and spicy street food food-truck hopping.";
            suggestions.add("Keep a scorecard for arcade games");
            suggestions.add("Record a 5-second victory dance video");
            cost = "₹1,150";
        } else {
            title = "🌿 Cozy Sanctuary & Stargazing Picnic";
            content = "1. 🧺 04:00 PM: Pack a basket with grapes, chocolate strawberries, and sparkling cider.\n" +
                      "2. 📖 05:00 PM: Read each other excerpts or play Would You Rather on a picnic blanket.\n" +
                      "3. 🎧 06:30 PM: Shared headphone playlist watching the evening sky turn violet.\n" +
                      "4. 🍜 08:00 PM: Comfort food takeout and cozy movie night at home.";
            suggestions.add("Bring fairy lights or a portable speaker");
            suggestions.add("Download offline acoustic playlist");
            cost = "₹650";
        }

        return CupidAIResponse.builder()
                .title(title)
                .content(content)
                .suggestions(suggestions)
                .estimatedCost(cost)
                .tone(mood)
                .build();
    }

    private CupidAIResponse generateLoveLetter(String prompt, String tone, User user) {
        String basePrompt = (prompt != null && !prompt.isBlank()) ? prompt : "how grateful I am to have you in my life";
        String content;

        if (tone.equalsIgnoreCase("Funny") || tone.equalsIgnoreCase("Playful")) {
            content = "Hey my favorite troublemaker ❤️,\n\n" +
                      "Just wanted to drop a quick reminder that even when you steal the blanket and take forever to choose where to eat, you are still my absolute favorite person in the entire universe. " +
                      "Thank you for " + basePrompt + ". I love laughing with you and doing this crazy adventure called life by your side!\n\n" +
                      "Forever your biggest fan 🥰";
        } else if (tone.equalsIgnoreCase("Poetic")) {
            content = "My dearest love,\n\n" +
                      "In a world that is always rushing, having you feels like finding calm amidst the storm. Thinking about " + basePrompt + " reminds me of just how lucky my heart is to beat alongside yours. " +
                      "Every smile you give me is a memory I treasure, and every tomorrow with you is a gift I look forward to.\n\n" +
                      "With all my heart and soul ❤️";
        } else {
            content = "My sweetheart,\n\n" +
                      "I was just sitting here thinking about us and wanted you to know how much you mean to me. " +
                      "Specifically about " + basePrompt + " — you always find ways to make my days brighter and my heart fuller. Thank you for being my teammate, best friend, and safe haven.\n\n" +
                      "I love you so much ❤️";
        }

        return CupidAIResponse.builder()
                .title("💌 Heartfelt Love Note")
                .content(content)
                .suggestions(List.of("Send directly as a sealed Time-Capsule letter", "Pair with a virtual hug in Amora"))
                .estimatedCost("Priceless ❤️")
                .tone(tone)
                .build();
    }

    private CupidAIResponse generateConversationStarters(String mood) {
        List<String> starters = List.of(
                "If we could freeze one 24-hour memory together forever, which day would you choose?",
                "What is one quirk of mine that secretly makes you smile when you think of me?",
                "What's a dream trip or tiny house adventure you want us to experience in the next 2 years?",
                "In what moment this past month did you feel most loved by me?",
                "If our relationship had a theme song and movie genre, what would they be?"
        );

        return CupidAIResponse.builder()
                .title("💬 5 Heart-Connecting Questions")
                .content(String.join("\n\n• ", starters))
                .suggestions(List.of("Answer these over tea or dinner", "Don't rush—listen deeply without interrupting"))
                .tone(mood)
                .build();
    }

    private CupidAIResponse generateSurpriseIdea(String budget, String duration) {
        return CupidAIResponse.builder()
                .title("🎁 Secret 10-Minute Romantic Surprise")
                .content("1. 🎵 Create a mini 3-song Spotify playlist titled 'Songs that scream YOU'.\n" +
                         "2. 💌 Hide a handwritten sticky note in their bag/pocket with: 'You're doing amazing today, and I can't wait to hug you tonight.'\n" +
                         "3. 🍫 Order their favorite bubble tea or chocolate to their workplace or home with a cute note.")
                .suggestions(List.of("Keep it completely unexpected", "Snap a photo of their reaction!"))
                .estimatedCost("₹150–300")
                .tone("Romantic & Thoughtful")
                .build();
    }

    private CupidAIResponse generateConflictCoachAdvice(String topic) {
        String topicStr = (topic != null && !topic.isBlank()) ? topic : "feeling disconnected";
        String content = "Here is a gentle, connection-first formula to discuss " + topicStr + " without blame:\n\n" +
                         "1. 🛡️ Start with Love & Reassurance: 'Hey love, our bond is super important to me, and I want to share something on my mind so we feel closer.'\n" +
                         "2. 💬 Use 'I Feel' instead of 'You Always': 'Lately I've been feeling a bit overwhelmed and missing our quality time together...'\n" +
                         "3. 🤝 Make a Collaborative Request: 'Could we try setting aside 30 minutes every evening phone-free? What do you think?'\n" +
                         "4. 👂 Listen & Validate: Hug them and listen to their side before offering solutions.";

        return CupidAIResponse.builder()
                .title("🕊️ Cupid Empathy & Connection Guide")
                .content(content)
                .suggestions(List.of("Wait until neither of you is hungry, tired, or rushed", "Hold hands while discussing"))
                .tone("Gentle & Empathetic")
                .build();
    }

    private CupidAIResponse generateMemoryCaption(String notes, String tone) {
        String base = (notes != null && !notes.isBlank()) ? notes : "Our amazing day together";
        return CupidAIResponse.builder()
                .title("📸 Memory Scrapbook Captions")
                .content("Option 1 (Sweet): 'With you, even the simplest days turn into my favorite adventures. " + base + " ❤️'\n\n" +
                         "Option 2 (Playful): 'Proof that we make the cutest chaotic duo ever. " + base + " ✨'\n\n" +
                         "Option 3 (Poetic): 'Collecting moments, heartbeats, and sunset smiles with my forever human.'")
                .suggestions(List.of("Add to your Amora Scrapbook", "Attach your couple audio note"))
                .tone(tone)
                .build();
    }
}
