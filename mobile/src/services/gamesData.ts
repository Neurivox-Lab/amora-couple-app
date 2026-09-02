export interface GameDeck {
  id: string;
  title: string;
  subtitle: string;
  category: 'SPICY' | 'ROMANTIC' | 'FUN' | 'DEEP' | 'CHALLENGE';
  icon: string;
  spiceLevel: number; // 1 to 3
  gradient: readonly [string, string];
  questions: {
    id: number;
    prompt: string;
    optionA?: string;
    optionB?: string;
    type?: 'WYR' | 'LIKELY' | 'TRUTH_DARE' | 'NEVER_EVER' | 'KNOW_ME' | 'RAPID';
    truth?: string;
    dare?: string;
    forfeit?: string;
  }[];
}

export const ALL_GAME_DECKS: GameDeck[] = [
  // 1. WOULD YOU RATHER: LATE NIGHT & SPICY 🔥
  {
    id: 'wyr_spicy',
    title: 'Late Night & Spicy 🔥',
    subtitle: 'Sensual flirty dilemmas to turn up the heat',
    category: 'SPICY',
    icon: 'Flame',
    spiceLevel: 3,
    gradient: ['#FA709A', '#FEE140'],
    questions: [
      {
        id: 1,
        prompt: 'Receive a 20-minute relaxing full-body massage OR give me a sensual slow massage with scented oils?',
        optionA: 'Receive Massage 💆‍♀️',
        optionB: 'Give Massage 💆‍♂️',
        type: 'WYR',
      },
      {
        id: 2,
        prompt: 'Send flirty secret messages to me during a crowded family dinner OR steal passionate kisses in a slow elevator?',
        optionA: 'Flirty Secret Texts 📱',
        optionB: 'Elevator Kisses 💋',
        type: 'WYR',
      },
      {
        id: 3,
        prompt: 'A romantic candlelit bubble bath with champagne OR midnight skinny dipping in a private secluded pool?',
        optionA: 'Candlelit Bubble Bath 🛁',
        optionB: 'Private Skinny Dipping 🌊',
        type: 'WYR',
      },
      {
        id: 4,
        prompt: 'Whisper sweet spicy secrets in my ear all night OR hold hands and cuddle without letting go until morning?',
        optionA: 'Whisper Secrets 🤫',
        optionB: 'Cuddle All Night 🫂',
        type: 'WYR',
      },
      {
        id: 5,
        prompt: 'Wear matching silky couple pajamas OR sleep in only my oversized hoodie?',
        optionA: 'Matching Silky Pajamas 👚',
        optionB: 'Your Oversized Hoodie 👕',
        type: 'WYR',
      },
      {
        id: 6,
        prompt: 'Blindfolded chocolate strawberry feeding OR slow sensual dancing with no music in candlelight?',
        optionA: 'Blindfold Strawberries 🍓',
        optionB: 'Candlelight Slow Dance 🕯️',
        type: 'WYR',
      },
      {
        id: 7,
        prompt: 'Spontaneous passionate weekend getaway OR a 24-hour cozy bedroom lockdown with snacks and zero phones?',
        optionA: 'Spontaneous Getaway ✈️',
        optionB: '24-Hour Bedroom Lockdown 🔒',
        type: 'WYR',
      },
      {
        id: 8,
        prompt: 'A gentle neck kiss while cooking dinner OR a sudden passionate embrace against the wall?',
        optionA: 'Gentle Neck Kiss 🍳',
        optionB: 'Passionate Wall Embrace 🔥',
        type: 'WYR',
      },
    ],
  },

  // 2. WOULD YOU RATHER: ROMANTIC & FUTURE 🏡
  {
    id: 'wyr_romantic',
    title: 'Romantic Dreams & Future 💍',
    subtitle: 'Explore our dream house, travel, and wedding vibes',
    category: 'ROMANTIC',
    icon: 'Heart',
    spiceLevel: 1,
    gradient: ['#FF6B8B', '#FF8E53'],
    questions: [
      {
        id: 101,
        prompt: 'Live in a cozy mountain cabin with a fireplace OR a breezy beachfront villa with private ocean views?',
        optionA: 'Mountain Cabin 🏔️',
        optionB: 'Beachfront Villa 🏖️',
        type: 'WYR',
      },
      {
        id: 102,
        prompt: 'Breakfast in bed made with love every Sunday OR gourmet dinners cooked together with wine every Friday?',
        optionA: 'Breakfast in Bed ☕',
        optionB: 'Cook Dinner Together 🍷',
        type: 'WYR',
      },
      {
        id: 103,
        prompt: 'A huge grand dream wedding with all our friends OR an intimate romantic elopement in Amalfi/Santorini?',
        optionA: 'Grand Dream Wedding 💃',
        optionB: 'Intimate Elopement 💍',
        type: 'WYR',
      },
      {
        id: 104,
        prompt: 'Adopt two fluffy golden retrievers OR have a cozy house filled with indoor plants and a reading nook?',
        optionA: 'Two Cute Dogs 🐶',
        optionB: 'Indoor Plant Jungle 🌿',
        type: 'WYR',
      },
      {
        id: 105,
        prompt: 'Never have to do dishes again for life OR never have to fold laundry again?',
        optionA: 'No More Dishes 🍽️',
        optionB: 'No More Laundry 🧺',
        type: 'WYR',
      },
      {
        id: 106,
        prompt: 'Spontaneous 2-week backpacking adventure in Japan OR 2 weeks of ultra luxury in a Maldives overwater bungalow?',
        optionA: 'Japan Adventure 🇯🇵',
        optionB: 'Maldives Luxury 🏝️',
        type: 'WYR',
      },
    ],
  },

  // 3. WHO IS MORE LIKELY TO? 😂
  {
    id: 'likely_chaos',
    title: 'Who Is More Likely? 😂',
    subtitle: 'Vote on silly habits, who gets lost, and inside jokes',
    category: 'FUN',
    icon: 'Sparkles',
    spiceLevel: 1,
    gradient: ['#4FACFE', '#00F2FE'],
    questions: [
      {
        id: 201,
        prompt: 'Who is more likely to fall asleep 10 minutes into a movie they picked?',
        type: 'LIKELY',
      },
      {
        id: 202,
        prompt: 'Who is more likely to get completely lost even with Google Maps open?',
        type: 'LIKELY',
      },
      {
        id: 203,
        prompt: 'Who says "I am not hungry" and then proceeds to eat half of the other’s food?',
        type: 'LIKELY',
      },
      {
        id: 204,
        prompt: 'Who is more likely to buy something ridiculous online at 2:00 AM?',
        type: 'LIKELY',
      },
      {
        id: 205,
        prompt: 'Who takes 3x longer to get dressed and ready before a date?',
        type: 'LIKELY',
      },
      {
        id: 206,
        prompt: 'Who is more dramatic when they catch a mild common cold?',
        type: 'LIKELY',
      },
      {
        id: 207,
        prompt: 'Who is more likely to cry during a heartwarming animated movie?',
        type: 'LIKELY',
      },
      {
        id: 208,
        prompt: 'Who steals the blanket and takes up 80% of the bed?',
        type: 'LIKELY',
      },
    ],
  },

  // 4. TRUTH OR DARE: COUPLE EDITION 🔥
  {
    id: 'truth_dare_intimate',
    title: 'Truth or Dare: Couple Edition ⚡',
    subtitle: 'Spicy real-time dares and deepest confessions',
    category: 'CHALLENGE',
    icon: 'Zap',
    spiceLevel: 2,
    gradient: ['#A18CD1', '#FBC2EB'],
    questions: [
      {
        id: 301,
        prompt: 'Choose your card: Deep Truth or Romantic Dare!',
        truth: 'What was the exact moment or first impression when you fell for me?',
        dare: 'Give your partner a slow 2-minute foot or shoulder massage right now without stopping.',
        type: 'TRUTH_DARE',
      },
      {
        id: 302,
        prompt: 'Choose your card: Deep Truth or Romantic Dare!',
        truth: 'What is one secret outfit or look of mine that you find insanely attractive?',
        dare: 'Stare deeply into each other’s eyes for 60 seconds without laughing or looking away.',
        type: 'TRUTH_DARE',
      },
      {
        id: 303,
        prompt: 'Choose your card: Deep Truth or Romantic Dare!',
        truth: 'If you could relive any single 24 hours of our relationship, which day would it be?',
        dare: 'Whisper 3 romantic reasons you love your partner in their ear in your most attractive voice.',
        type: 'TRUTH_DARE',
      },
      {
        id: 304,
        prompt: 'Choose your card: Deep Truth or Romantic Dare!',
        truth: 'What is a funny quirk or habit of mine that you secretly find irresistible?',
        dare: 'Give your partner 10 kisses in 10 different spots on their face & neck.',
        type: 'TRUTH_DARE',
      },
      {
        id: 305,
        prompt: 'Choose your card: Deep Truth or Romantic Dare!',
        truth: 'What is your favorite physical feature of mine and why?',
        dare: 'Put on our favorite song and slow dance in the room right now.',
        type: 'TRUTH_DARE',
      },
    ],
  },

  // 5. NEVER HAVE I EVER: COUPLE EDITION 🙈
  {
    id: 'never_ever',
    title: 'Never Have I Ever 🙈',
    subtitle: 'Confess your secrets! Forfeit: Give a kiss or sip',
    category: 'SPICY',
    icon: 'Smile',
    spiceLevel: 2,
    gradient: ['#FF9A8B', '#FF6A88'],
    questions: [
      {
        id: 401,
        prompt: 'Never have I ever pretended to be asleep just so you would get up and turn off the light.',
        type: 'NEVER_EVER',
        forfeit: 'Give a 10-second kiss 💋',
      },
      {
        id: 402,
        prompt: 'Never have I ever stalked your old social media photos from years before we met.',
        type: 'NEVER_EVER',
        forfeit: 'Compliment 3 things you love about them ❤️',
      },
      {
        id: 403,
        prompt: 'Never have I ever secretly smelled your hoodie or perfume when you were away because I missed you.',
        type: 'NEVER_EVER',
        forfeit: 'Give a tight warm hug 🤗',
      },
      {
        id: 404,
        prompt: 'Never have I ever blamed a weird sound on the house when it was actually me.',
        type: 'NEVER_EVER',
        forfeit: 'Confess one funny embarrassing secret 😂',
      },
      {
        id: 405,
        prompt: 'Never have I ever had a spicy romantic dream about you and blushed the next morning.',
        type: 'NEVER_EVER',
        forfeit: 'Whisper a flirty secret into their ear 🔥',
      },
      {
        id: 406,
        prompt: 'Never have I ever looked at you while you were busy working and thought "Damn, I am so lucky."',
        type: 'NEVER_EVER',
        forfeit: 'Kiss them on the forehead 🥰',
      },
    ],
  },

  // 6. HOW WELL DO YOU KNOW ME? 🧠
  {
    id: 'know_me',
    title: 'How Well Do You Know Me? 🧠',
    subtitle: 'Guess your partner’s exact favorites & guilty pleasures',
    category: 'DEEP',
    icon: 'Award',
    spiceLevel: 1,
    gradient: ['#667EEA', '#764BA2'],
    questions: [
      {
        id: 501,
        prompt: 'What is my ultimate dream vacation destination?',
        optionA: 'Japan (Kyoto & Tokyo) 🇯🇵',
        optionB: 'Switzerland & Alps 🇨🇭',
        type: 'WYR',
      },
      {
        id: 502,
        prompt: 'What is my go-to comfort food when I’ve had an exhausting day?',
        optionA: 'Cheesy Pizza & Garlic Bread 🍕',
        optionB: 'Warm Chocolate Fudge & Ice Cream 🍨',
        type: 'WYR',
      },
      {
        id: 503,
        prompt: 'What is my absolute biggest pet peeve?',
        optionA: 'People arriving late / Disorganized plans ⏰',
        optionB: 'Loud chewing / Slow internet 📶',
        type: 'WYR',
      },
      {
        id: 504,
        prompt: 'What is my ideal lazy Sunday morning ritual?',
        optionA: 'Sleeping in until noon & cuddles 😴',
        optionB: 'Fresh pour-over coffee & a slow walk ☕',
        type: 'WYR',
      },
    ],
  },
];
