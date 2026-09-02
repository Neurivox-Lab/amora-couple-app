import { CompatibilityQuizModule } from '../types';

export const DEEP_COMPATIBILITY_QUIZZES: CompatibilityQuizModule[] = [
  // 1. SITUATION ANALYSIS & REAL-LIFE CRISES 🚨
  {
    id: 'situations_crises',
    title: 'Situations & Crisis Analysis 🚨',
    tagline: 'How we handle bad days, sudden arguments & emergencies',
    category: 'SITUATIONS',
    iconEmoji: '🧠',
    gradient: ['#FF6B8B', '#FF8E53'],
    totalQuestions: 10,
    questions: [
      {
        id: 1,
        scenario: 'When I come home completely exhausted and stressed from work, what should you do first?',
        options: [
          { id: 'A', text: 'Give a tight silent warm hug and a cup of warm tea ☕' },
          { id: 'B', text: 'Give me 30 minutes of quiet space to unwind alone 🧘' },
          { id: 'C', text: 'Ask me to vent and rant about everything that happened 🗣️' },
          { id: 'D', text: 'Order our favorite comfort food and put on a funny movie 🍕' },
        ],
        category: 'Emotional Support',
      },
      {
        id: 2,
        scenario: 'If we get into a heated disagreement, what is the best way to cool down?',
        options: [
          { id: 'A', text: 'Hold hands immediately and talk softly without walking away 🤝' },
          { id: 'B', text: 'Take a 15-minute cool-off breather, then hug and talk ⏳' },
          { id: 'C', text: 'Use humor or make a goofy face to break the tension 😜' },
          { id: 'D', text: 'Write down our thoughts in a note to explain calmly 📝' },
        ],
        category: 'Conflict Resolution',
      },
      {
        id: 3,
        scenario: 'On a sudden rainy weekend when all outdoor date plans get canceled:',
        options: [
          { id: 'A', text: 'Build a giant cozy blanket fort and have a movie marathon 🏰' },
          { id: 'B', text: 'Bake cookies or cook spicy noodles from scratch together 🍲' },
          { id: 'C', text: 'Grab one umbrella and go for a playful romantic rain walk ☔' },
          { id: 'D', text: 'Play board games, light candles, and drink hot cocoa ☕' },
        ],
        category: 'Spontaneity',
      },
      {
        id: 4,
        scenario: 'If one of us is feeling insecure or overthinking late at night:',
        options: [
          { id: 'A', text: 'Whisper 5 specific reasons why I adore you until you fall asleep 🌙' },
          { id: 'B', text: 'Stay up talking until every fear is spoken out and resolved 💬' },
          { id: 'C', text: 'Cuddle tightly with zero words needed, just warmth 🫂' },
          { id: 'D', text: 'Play our favorite soft love song and stroke hair gently 🎵' },
        ],
        category: 'Late Night Comfort',
      },
      {
        id: 5,
        scenario: 'When attending a crowded party where we barely know anyone:',
        options: [
          { id: 'A', text: 'Stick together by the side like two secret agents 🕵️‍♀️' },
          { id: 'B', text: 'Split up to socialize but exchange secret flirty eye contacts 😉' },
          { id: 'C', text: 'Stay for 45 minutes, eat all the snacks, then sneak out home 🚗' },
          { id: 'D', text: 'Be the life of the party together on the dance floor 💃' },
        ],
        category: 'Social Vibes',
      },
    ],
  },

  // 2. DOING THINGS BETTER: UNDERSTANDING & GROWTH 🌱
  {
    id: 'better_understanding',
    title: 'Understanding & Doing Things Better 🌱',
    tagline: 'Deep dive into what makes our connection thrive',
    category: 'BETTER_LOVE',
    iconEmoji: '🌱',
    gradient: ['#11998E', '#38EF7D'],
    totalQuestions: 10,
    questions: [
      {
        id: 11,
        scenario: 'What is the absolute fastest way to melt my heart when I am grumpy?',
        options: [
          { id: 'A', text: 'Surprise me with my favorite snack or coffee 🍩' },
          { id: 'B', text: 'Give a gentle back rub and kiss on the temple 💆‍♂️' },
          { id: 'C', text: 'Tell me a ridiculous joke or do a silly happy dance 🕺' },
          { id: 'D', text: 'Take care of a chore I was dreading doing 🧹' },
        ],
        category: 'Love Languages',
      },
      {
        id: 12,
        scenario: 'How do I feel most respected and valued by you in daily life?',
        options: [
          { id: 'A', text: 'When you ask for my opinion before making big decisions 💡' },
          { id: 'B', text: 'When you brag about my achievements to friends and family 🏆' },
          { id: 'C', text: 'When you remember small random details I mentioned weeks ago 🧠' },
          { id: 'D', text: 'When you defend and stand by me in front of others 🛡️' },
        ],
        category: 'Appreciation',
      },
      {
        id: 13,
        scenario: 'What is our couple superpower that keeps us so strong?',
        options: [
          { id: 'A', text: 'We laugh at the exact same weird, silly things 😂' },
          { id: 'B', text: 'Unconditional trust — zero secrets, complete openness 🔒' },
          { id: 'C', text: 'Physical chemistry and constant affection 💋' },
          { id: 'D', text: 'We inspire each other to be better every single day 🚀' },
        ],
        category: 'Core Bond',
      },
      {
        id: 14,
        scenario: 'If we could improve one daily routine together:',
        options: [
          { id: 'A', text: '10 minutes of screen-free pillow talk every morning & night 📱' },
          { id: 'B', text: 'Cooking fresh dinner together instead of ordering takeout 🍳' },
          { id: 'C', text: 'Evening walking or working out together 🏃' },
          { id: 'D', text: 'Setting weekly surprise date nights without fail 📅' },
        ],
        category: 'Growth Habits',
      },
    ],
  },

  // 3. FAVORITES, OPINIONS & TASTES 🌟
  {
    id: 'favorites_tastes',
    title: 'Favorites, Tastes & Daily Opinions 🌟',
    tagline: 'Test how well you know each other’s secret preferences',
    category: 'FAVORITES',
    iconEmoji: '⭐',
    gradient: ['#667EEA', '#764BA2'],
    totalQuestions: 10,
    questions: [
      {
        id: 21,
        scenario: 'What is my ultimate guilty pleasure on a lazy afternoon?',
        options: [
          { id: 'A', text: 'Binge-watching trashy reality TV in pajamas 📺' },
          { id: 'B', text: 'Ordering expensive dessert and eating it in bed 🍰' },
          { id: 'C', text: 'Scrolling memes and TikTok for 2 hours straight 📱' },
          { id: 'D', text: 'Taking a 3-hour power nap with 4 blankets 😴' },
        ],
        category: 'Guilty Pleasures',
      },
      {
        id: 22,
        scenario: 'If we could only eat one cuisine together for a whole month:',
        options: [
          { id: 'A', text: 'Italian (Creamy Pastas, Pizzas & Garlic Breads) 🍝' },
          { id: 'B', text: 'Asian / Japanese (Ramen, Sushi & Dumplings) 🍣' },
          { id: 'C', text: 'Indian Comfort (Biryani, Butter Naan & Curries) 🍛' },
          { id: 'D', text: 'Street Food & Burgers (Loaded Fries & Shakes) 🍔' },
        ],
        category: 'Foodie Vibes',
      },
      {
        id: 23,
        scenario: 'What kind of music playlist defines our romantic road trip?',
        options: [
          { id: 'A', text: '2000s Pop & Bollywood Nostalgia we scream-sing together 🎤' },
          { id: 'B', text: 'Acoustic Indie & Sunset Chill vibes 🎸' },
          { id: 'C', text: 'Late Night R&B & Sensual Grooves 🎷' },
          { id: 'D', text: 'High-energy EDM & Hip-Hop bangers ⚡' },
        ],
        category: 'Music & Mood',
      },
    ],
  },

  // 4. FUTURE DREAMS & LIFE BLUEPRINT 🔮
  {
    id: 'future_blueprint',
    title: 'Future Dreams & Life Blueprint 🔮',
    tagline: 'Dream homes, career goals, finances & growing old together',
    category: 'FUTURE_DREAMS',
    iconEmoji: '🏡',
    gradient: ['#4FACFE', '#00F2FE'],
    totalQuestions: 10,
    questions: [
      {
        id: 31,
        scenario: 'What is our ultimate dream home vibe?',
        options: [
          { id: 'A', text: 'Modern minimalist penthouse with floor-to-ceiling city views 🏙️' },
          { id: 'B', text: 'Rustic sunlit cottage with a blooming backyard garden 🌻' },
          { id: 'C', text: 'Cozy beach bungalow where we hear the ocean waves 🌊' },
          { id: 'D', text: 'Secluded mountain lodge with wood fireplaces and snow ❄️' },
        ],
        category: 'Home & Living',
      },
      {
        id: 32,
        scenario: 'When we celebrate our 50th golden anniversary, what will we be doing?',
        options: [
          { id: 'A', text: 'Holding hands on our porch rocking chairs laughing at memories 👵👴' },
          { id: 'B', text: 'Still traveling the world on spontaneous cruise adventures 🚢' },
          { id: 'C', text: 'Throwing a huge lavish dance party for our children & friends 🎉' },
          { id: 'D', text: 'Baking bread and running a peaceful countryside bookstore 📖' },
        ],
        category: 'Forever Love',
      },
    ],
  },

  // 5. LATE NIGHT INTIMACY & SPICY DESIRES 🔥
  {
    id: 'spicy_intimacy',
    title: 'Spicy Desires & Intimate Chemistry 🔥',
    tagline: 'Sensual preferences, romance triggers & secret desires',
    category: 'SPICY',
    iconEmoji: '🔥',
    gradient: ['#FA709A', '#FEE140'],
    totalQuestions: 10,
    questions: [
      {
        id: 41,
        scenario: 'What is the most irresistible romantic gesture during a date night?',
        options: [
          { id: 'A', text: 'Gentle hand on my thigh under the table at dinner 🔥' },
          { id: 'B', text: 'Whispering a spicy secret in my ear with a smile 💋' },
          { id: 'C', text: 'Pulling me in for a sudden passionate kiss out of nowhere 💏' },
          { id: 'D', text: 'Slow dancing in the kitchen with the lights dimmed 🕯️' },
        ],
        category: 'Romantic Chemistry',
      },
      {
        id: 42,
        scenario: 'Our ideal weekend morning in bed:',
        options: [
          { id: 'A', text: 'Endless lazy morning cuddles under heavy duvet 🛌' },
          { id: 'B', text: 'Passionate morning kisses leading to breakfast in bed 🍓' },
          { id: 'C', text: 'Listening to rain while talking about life dreams 🌧️' },
          { id: 'D', text: 'Playful tickle fights and silliness 😜' },
        ],
        category: 'Intimate Moments',
      },
    ],
  },

  // 6. COMMUNICATION STYLES & EMOTIONAL SAFETY 💬
  {
    id: 'communication_safety',
    title: 'Communication & Emotional Safety 💬',
    tagline: 'How we express vulnerability, boundaries & deep needs',
    category: 'COMMUNICATION',
    iconEmoji: '💌',
    gradient: ['#A18CD1', '#FBC2EB'],
    totalQuestions: 10,
    questions: [
      {
        id: 51,
        scenario: 'When I am sharing a problem with you, what do I need most?',
        options: [
          { id: 'A', text: 'Just listen with full empathy and validate my feelings 👂' },
          { id: 'B', text: 'Give me practical solutions and an action plan 💡' },
          { id: 'C', text: 'Distract me and take my mind completely off it 🎈' },
          { id: 'D', text: 'Hold me in silence until I feel steady again 🫂' },
        ],
        category: 'Listening Needs',
      },
      {
        id: 52,
        scenario: 'When you are mad at me, what should I never do?',
        options: [
          { id: 'A', text: 'Give the cold silent treatment for hours ❄️' },
          { id: 'B', text: 'Bring up old past mistakes from months ago 📜' },
          { id: 'C', text: 'Invalidate my feelings by calling me overly dramatic 🚫' },
          { id: 'D', text: 'Walk away mid-conversation without saying when we will talk 🚪' },
        ],
        category: 'Emotional Boundaries',
      },
    ],
  },

  // 7. TRAVEL & ADVENTURE COMPATIBILITY ✈️
  {
    id: 'travel_adventures',
    title: 'Travel & Spontaneous Adventures ✈️',
    tagline: 'Vacation styles, budget spending & packing vibes',
    category: 'FAVORITES',
    iconEmoji: '🗺️',
    gradient: ['#00C9FF', '#92FE9D'],
    totalQuestions: 10,
    questions: [
      {
        id: 61,
        scenario: 'On our dream European vacation, our daily pace is:',
        options: [
          { id: 'A', text: 'Packed sightseeing itinerary from 8 AM to midnight 🏛️' },
          { id: 'B', text: 'Slow café mornings, reading, and strolling quiet cobblestones ☕' },
          { id: 'C', text: 'Food tour hopping from bakery to winery to street stalls 🍷' },
          { id: 'D', text: 'Relaxing 5-star resort pool with cocktails and zero schedule 🍹' },
        ],
        category: 'Vacation Style',
      },
      {
        id: 62,
        scenario: 'If our flight gets delayed by 6 hours at the airport:',
        options: [
          { id: 'A', text: 'Find the airport lounge and drink free wine together 🥂' },
          { id: 'B', text: 'Explore duty-free shops and spray expensive perfumes on each other 🛍️' },
          { id: 'C', text: 'Find a quiet corner, put on a podcast, and nap shoulder-to-shoulder 😴' },
          { id: 'D', text: 'Play card games and people-watch funny travelers 🃏' },
        ],
        category: 'Crisis Humor',
      },
    ],
  },
];
