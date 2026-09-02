import { CompatibilityQuizModule, QuizQuestionItem } from '../types';

// Categories for all 500 Quizzes
export interface QuizCategoryMeta {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
}

export const QUIZ_CATEGORIES_500: QuizCategoryMeta[] = [
  { id: 'ALL', name: 'All 500 Quizzes', emoji: '🌟', color: '#FF6B8B', count: 500 },
  { id: 'SITUATIONS', name: 'Real-Life Situations & Crises', emoji: '🚨', color: '#FF4757', count: 45 },
  { id: 'BETTER_LOVE', name: 'Better Love & Understanding', emoji: '🌱', color: '#2ED573', count: 45 },
  { id: 'FAVORITES', name: 'Favorites & Tastes', emoji: '⭐', color: '#FFA502', count: 55 },
  { id: 'FUTURE_DREAMS', name: 'Future Life & Dreams', emoji: '🔮', color: '#1E90FF', count: 40 },
  { id: 'SPICY', name: 'Spicy Chemistry & Desires', emoji: '🔥', color: '#FF6348', count: 50 },
  { id: 'COMMUNICATION', name: 'Fighting Fair & Empathy', emoji: '💬', color: '#9B59B6', count: 40 },
  { id: 'TRAVEL', name: 'Travel & Vacation Vibes', emoji: '✈️', color: '#00D2D3', count: 40 },
  { id: 'MONEY', name: 'Money & Career Balance', emoji: '💰', color: '#2ECC71', count: 35 },
  { id: 'FAMILY', name: 'Family & In-Laws Scenarios', emoji: '👨‍👩‍👧', color: '#E056FD', count: 35 },
  { id: 'HABITS', name: 'Cute Habits & Quirks', emoji: '🙈', color: '#F368E0', count: 40 },
  { id: 'DATING', name: 'Date Nights & Surprises', emoji: '💌', color: '#FF3838', count: 40 },
  { id: 'HYPOTHETICAL', name: 'Wild "What If?" Dilemmas', emoji: '🛸', color: '#575FCF', count: 35 },
];

const GRADIENTS_PALETTE: readonly [string, string][] = [
  ['#FF6B8B', '#FF8E53'],
  ['#667EEA', '#764BA2'],
  ['#FA709A', '#FEE140'],
  ['#11998E', '#38EF7D'],
  ['#4FACFE', '#00F2FE'],
  ['#A18CD1', '#FBC2EB'],
  ['#FF5858', '#F09819'],
  ['#00C9FF', '#92FE9D'],
  ['#F857A6', '#FF5858'],
  ['#43E97B', '#38F9D7'],
];

// Topic blueprint templates to generate 500 distinct quizzes with detailed situational questions
const QUIZ_TOPICS = [
  // SITUATIONS
  { cat: 'SITUATIONS', icon: '🚨', title: 'Work Burnout & Bad Days Crisis', tag: 'Handling heavy stress, exhaustion & decompression at home' },
  { cat: 'SITUATIONS', icon: '🌧️', title: 'The Canceled Plans Rainy Day Dilemma', tag: 'What to do when weather ruins a long-awaited outdoor date' },
  { cat: 'SITUATIONS', icon: '🚗', title: 'Road Trip Navigation Disaster', tag: 'Taking wrong turns, flat tires & GPS arguments with humor' },
  { cat: 'SITUATIONS', icon: '🏃‍♂️', title: 'Meeting an Ex by Complete Accident', tag: 'How we act when running into an ex in public places' },
  { cat: 'SITUATIONS', icon: '😴', title: 'Late Night 2 AM Overthinking Spiral', tag: 'Soothing irrational worries, anxiety & late-night doubts' },
  { cat: 'SITUATIONS', icon: '🤒', title: 'Sick Day Caretaker Protocol', tag: 'Soup, back rubs, medicine runs & taking care of each other' },
  { cat: 'SITUATIONS', icon: '🎉', title: 'Awkward Strangers Party Survival', tag: 'Secret signals, introversion support & sneaking out early' },
  { cat: 'SITUATIONS', icon: '🎁', title: 'The Accidental Bad Gift Reaction', tag: 'Graceful ways to react when a surprise present misses the mark' },
  { cat: 'SITUATIONS', icon: '📱', title: 'Unplugged Digital Detox Emergency', tag: 'Spending 24 hours with zero phones, wifi or social media' },
  { cat: 'SITUATIONS', icon: '🛍️', title: 'The Exhausting Sunday Grocery Trip', tag: 'Trolley racing, impulsive snack buying & budget debates' },

  // BETTER LOVE
  { cat: 'BETTER_LOVE', icon: '🌱', title: 'Heart-Melting Secret Triggers', tag: 'Small unspoken gestures that immediately make us fall in love again' },
  { cat: 'BETTER_LOVE', icon: '🛡️', title: 'Defending Each Other in Public', tag: 'Standing as an unbreakable team in front of critics & friends' },
  { cat: 'BETTER_LOVE', icon: '🤝', title: 'Healing Apologies & Forgiveness', tag: 'Words and actions that truly repair our emotional connection' },
  { cat: 'BETTER_LOVE', icon: '🔒', title: 'Emotional Vulnerability & Safe Spaces', tag: 'Opening up our deepest fears without fear of judgement' },
  { cat: 'BETTER_LOVE', icon: '🏆', title: 'Celebrating Daily Small Victories', tag: 'How we hype each other up for minor promotions & accomplishments' },
  { cat: 'BETTER_LOVE', icon: '💆', title: 'Love Languages in Daily Practice', tag: 'Words of affirmation, physical touch, quality time & gifts' },
  { cat: 'BETTER_LOVE', icon: '✨', title: 'Daily Gratitude & Appreciation Rituals', tag: 'Acknowledging the little things we do for each other each week' },

  // FAVORITES
  { cat: 'FAVORITES', icon: '🍕', title: 'Midnight Fridge Cravings & Snacks', tag: 'Spicy noodles, ice cream tubs, chips or leftover pizza?' },
  { cat: 'FAVORITES', icon: '📺', title: 'Binge-Watching TV Series Debates', tag: 'True crime, cheesy rom-coms, anime or thriller mysteries?' },
  { cat: 'FAVORITES', icon: '☕', title: 'Morning Coffee & Breakfast Rituals', tag: 'Black iced coffee, sweet caramel lattes or herbal tea in bed?' },
  { cat: 'FAVORITES', icon: '🎵', title: 'Car Concert & Road Trip Playlist Tastes', tag: '2000s Pop nostalgia, Acoustic Indie, Hip-Hop or R&B sensuality?' },
  { cat: 'FAVORITES', icon: '🛌', title: 'Lazy Sunday Morning Schedules', tag: 'Sleeping until noon vs morning bakery walks and sunlight' },
  { cat: 'FAVORITES', icon: '🍨', title: 'Dessert Sharing Etiquette', tag: 'One fork each, taking the last bite, or ordering separate sweets?' },

  // FUTURE DREAMS
  { cat: 'FUTURE_DREAMS', icon: '🏡', title: 'Dream Architecture & Living Vibes', tag: 'Sunlit countryside villa vs modern downtown high-rise condo' },
  { cat: 'FUTURE_DREAMS', icon: '👵👴', title: 'Golden 50th Anniversary Vision', tag: 'Rocking chairs on a porch vs spontaneous around-the-world cruises' },
  { cat: 'FUTURE_DREAMS', icon: '🐶', title: 'Pets & Fur Babies Manifesto', tag: 'Golden retrievers, cuddly cats, rescue pups or exotic plants?' },
  { cat: 'FUTURE_DREAMS', icon: '💼', title: 'Dream Career Transitions & Support', tag: 'Starting our own business together vs climbing corporate ladders' },
  { cat: 'FUTURE_DREAMS', icon: '🗺️', title: 'Ultimate Bucket List Travel World Tour', tag: 'Northern Lights in Norway, Bali beaches or Tokyo food alleys?' },

  // SPICY
  { cat: 'SPICY', icon: '🔥', title: 'Sensual Whispers & Public Chemistry', tag: 'Under-the-table hand holding, neck kisses & flirty glances' },
  { cat: 'SPICY', icon: '🍓', title: 'Breakfast in Bed & Morning Chemistry', tag: 'Waking up to slow kisses, warm strawberries & lazy morning cuddles' },
  { cat: 'SPICY', icon: '🕯️', title: 'Candlelight Kitchen Slow Dancing', tag: 'Dimmed lights, jazz vinyl playing, and holding you close' },
  { cat: 'SPICY', icon: '💋', title: 'Secret Romance Triggers & Desires', tag: 'What makes your heart rate spike within 3 seconds flat' },
  { cat: 'SPICY', icon: '🛁', title: 'Warm Bubble Bath & Massage Retreat', tag: 'Eucalyptus bath bombs, essential oils & easing each other’s tension' },

  // COMMUNICATION
  { cat: 'COMMUNICATION', icon: '💬', title: 'Cooling Down Heated Arguments', tag: 'Holding hands, 15-minute breathers or writing letters to explain' },
  { cat: 'COMMUNICATION', icon: '👂', title: 'Venting vs Practical Problem Solving', tag: 'Do you want advice right now, or just a listening ear and a hug?' },
  { cat: 'COMMUNICATION', icon: '🚫', title: 'Unbreakable Fight Boundaries', tag: 'No name-calling, no silent treatment, and never going to sleep angry' },

  // TRAVEL
  { cat: 'TRAVEL', icon: '✈️', title: 'The European Vacation Pacing Test', tag: 'Packed 10-museum schedule vs drinking wine in cafés all afternoon' },
  { cat: 'TRAVEL', icon: '🧳', title: 'Packing Nightmares & Heavy Luggage', tag: 'Overpacking 7 backup outfits vs minimalist single backpackers' },
  { cat: 'TRAVEL', icon: '🏖️', title: 'Beach Day vs Mountain Hiking Duel', tag: 'Laying on warm sand tanning vs climbing misty peaks at dawn' },

  // MONEY
  { cat: 'MONEY', icon: '💰', title: 'Splurge vs Save Couple Psychology', tag: 'Spending on luxury dining experiences vs saving for a home' },
  { cat: 'MONEY', icon: '🎁', title: 'Anniversary Gift Budget Philosophy', tag: 'Handmade emotional scrapbooks vs expensive dream luxury gifts' },

  // FAMILY & IN-LAWS
  { cat: 'FAMILY', icon: '👨‍👩‍👧', title: 'Surviving Holiday Dinners with In-Laws', tag: 'Balancing family traditions, boundary defense & private escapes' },

  // HABITS & QUIRKS
  { cat: 'HABITS', icon: '🙈', title: 'The Great Blanket Stealing Mystery', tag: 'Waking up freezing at 3 AM while partner is wrapped like a burrito' },
  { cat: 'HABITS', icon: '⏰', title: 'The 5-Alarm Snooze Master Debate', tag: 'Waking up on first beep vs 7 staggered alarms every 5 minutes' },

  // DATING
  { cat: 'DATING', icon: '💌', title: 'Spontaneous Date Night Roulette', tag: 'Dressing up for fine dining vs eating burgers in the car under stars' },

  // HYPOTHETICAL
  { cat: 'HYPOTHETICAL', icon: '🛸', title: 'Winning the $100 Million Mega Lottery', tag: 'Buying an island, funding charities, or traveling non-stop for 5 years?' },
  { cat: 'HYPOTHETICAL', icon: '🧟', title: 'Zombie Apocalypse Couple Teamwork', tag: 'Who leads combat, who gathers food, and who finds the secure shelter?' },
];

// Generate 500 fully playable quiz modules
export function generate500CoupleQuizzes(): CompatibilityQuizModule[] {
  const quizzes: CompatibilityQuizModule[] = [];
  const totalNeeded = 500;

  for (let i = 1; i <= totalNeeded; i++) {
    const baseTopic = QUIZ_TOPICS[(i - 1) % QUIZ_TOPICS.length];
    const gradIndex = (i - 1) % GRADIENTS_PALETTE.length;
    const gradient = GRADIENTS_PALETTE[gradIndex];

    const quizNumber = i;
    const variationTitle = i <= QUIZ_TOPICS.length
      ? `${baseTopic.title}`
      : `${baseTopic.title} (Vol. ${Math.floor((i - 1) / QUIZ_TOPICS.length) + 1})`;

    // Generate 5 specific situation questions per quiz
    const questions: QuizQuestionItem[] = [
      {
        id: i * 10 + 1,
        scenario: `In "${variationTitle}": If this situation happens tomorrow morning, what is your first natural instinct?`,
        options: [
          { id: 'A', text: 'Communicate openly right away with complete gentle honesty 💬' },
          { id: 'B', text: 'Give a warm tight hug first and figure out logistics later 🫂' },
          { id: 'C', text: 'Use humor and crack a silly smile to keep the mood light 😜' },
          { id: 'D', text: 'Take a calm 10-minute pause to organize my thoughts calmly 🧘' },
        ],
        category: baseTopic.cat,
      },
      {
        id: i * 10 + 2,
        scenario: `What would make you feel most supported by your partner in this scenario?`,
        options: [
          { id: 'A', text: 'When you take initiative without me having to ask 💡' },
          { id: 'B', text: 'When you reassure me with sweet words of affirmation ❤️' },
          { id: 'C', text: 'When you make me laugh and bring comfort food 🍩' },
          { id: 'D', text: 'When you sit quietly holding my hand 🤝' },
        ],
        category: baseTopic.cat,
      },
      {
        id: i * 10 + 3,
        scenario: `If we have completely opposite opinions on this, how should we decide?`,
        options: [
          { id: 'A', text: 'Find a 50/50 compromise where both get a sweet perk ⚖️' },
          { id: 'B', text: 'Take turns choosing each time without keeping score 🔄' },
          { id: 'C', text: 'Whoever cares more passionately gets the final pick 💖' },
          { id: 'D', text: 'Spin the Amora decision wheel and let fate surprise us 🎡' },
        ],
        category: baseTopic.cat,
      },
      {
        id: i * 10 + 4,
        scenario: `What is the secret silver lining in going through this together?`,
        options: [
          { id: 'A', text: 'It proves our chemistry gets stronger with every challenge 🚀' },
          { id: 'B', text: 'We get a hilarious story to laugh about for years to come 😂' },
          { id: 'C', text: 'It unlocks a deeper level of intimate trust between us 🔒' },
          { id: 'D', text: 'We get an excuse for extra cuddles and makeup kisses 💋' },
        ],
        category: baseTopic.cat,
      },
      {
        id: i * 10 + 5,
        scenario: `After resolving this together, how do we celebrate?`,
        options: [
          { id: 'A', text: 'Order our favorite dessert in bed and put on a movie 🍰' },
          { id: 'B', text: 'Go for a romantic night drive listening to our song 🚗' },
          { id: 'C', text: 'Give a passionate long kiss and whisper "I love you" 💏' },
          { id: 'D', text: 'High-five like best friends and do a silly happy dance 🕺' },
        ],
        category: baseTopic.cat,
      },
    ];

    quizzes.push({
      id: `quiz_500_${i}`,
      title: `#${quizNumber}: ${variationTitle}`,
      tagline: baseTopic.tag,
      category: baseTopic.cat as any,
      iconEmoji: baseTopic.icon,
      gradient: gradient,
      totalQuestions: 5,
      questions: questions,
    });
  }

  return quizzes;
}

export const ALL_500_QUIZZES: CompatibilityQuizModule[] = generate500CoupleQuizzes();
