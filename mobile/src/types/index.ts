export interface User {
  id: number;
  name: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  birthday?: string;
  loveLanguage?: string;
  coupleId?: number;
  currentMood?: string;
}

export interface Couple {
  id: number;
  coupleCode: string;
  partner1: User;
  partner2: User | null;
  relationshipStartDate: string;
  anniversaryDate: string;
  streakCount: number;
  daysTogether: number;
  moodPartner1?: string;
  moodPartner2?: string;
  totalHearts: number;
  status: 'PENDING' | 'ACTIVE' | 'PAUSED';
}

export interface Game {
  id: number;
  title: string;
  description: string;
  gameType: 'WOULD_YOU_RATHER' | 'WHO_IS_MORE_LIKELY' | 'TRUTH_OR_DARE' | 'TRIVIA' | 'GUESS_MY_ANSWER';
  category: 'ROMANCE' | 'SPICY' | 'FUN' | 'DEEP' | 'FUTURE' | 'TRAVEL';
  iconName?: string;
  gradientStart?: string;
  gradientEnd?: string;
  questionCount?: number;
}

export interface GameQuestion {
  id: number;
  gameId: number;
  prompt: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  level?: number;
  spiceLevel?: number;
  myAnswer?: string | null;
  partnerAnswer?: string | null;
  bothAnswered?: boolean;
  isMatch?: boolean;
}

export interface GameSession {
  id: number;
  coupleId: number;
  game: Game;
  status: 'IN_PROGRESS' | 'COMPLETED';
  partner1Score: number;
  partner2Score: number;
  totalQuestions: number;
  answeredQuestions: number;
  questions: GameQuestion[];
  startedAt: string;
}

export interface DailyQuestion {
  id: number;
  prompt: string;
  category: string;
  activeDate: string;
  partner1Answer?: string | null;
  partner2Answer?: string | null;
  isAnsweredByMe: boolean;
  isAnsweredByPartner: boolean;
  bothAnswered: boolean;
}

export interface Memory {
  id: number;
  title: string;
  description?: string;
  memoryDate: string;
  locationName?: string;
  mediaUrls?: string;
  audioUrl?: string;
  moodTag?: string;
  isFavorite?: boolean;
  createdAt: string;
}

export interface LoveNote {
  id: number;
  sender: User;
  receiver: User;
  category: 'LOVE_NOTE' | 'OPEN_WHEN' | 'TIME_CAPSULE';
  title?: string;
  message: string;
  unlockCondition?: string;
  scheduledAt?: string;
  isOpened: boolean;
  openedAt?: string;
  paperTheme?: string;
  createdAt: string;
}

export interface BucketListItem {
  id: number;
  title: string;
  category: 'TRAVEL' | 'EXPERIENCES' | 'ROMANCE' | 'FOOD' | 'GOALS';
  isCompleted: boolean;
  completedAt?: string;
  photoUrl?: string;
  notes?: string;
}

export interface DatePlan {
  id: number;
  title: string;
  mood: string;
  budgetCategory: string;
  duration: string;
  itineraryJson: string;
  estimatedCost?: number;
  status: string;
  createdAt: string;
}

export interface Nudge {
  id: number;
  sender: User;
  receiver: User;
  nudgeType: 'HUG' | 'KISS' | 'HEARTBEAT' | 'MISS_YOU' | 'MASSAGE' | 'COFFEE';
  message?: string;
  isRead: boolean;
  sentAt: string;
}

export interface CupidAIResponse {
  title: string;
  content: string;
  suggestions: string[];
  estimatedCost?: string;
  tone?: string;
}

// --- NEW STORY / STATUS TYPES ---
export interface CoupleStory {
  id: string;
  authorId: number;
  authorName: string;
  type: 'NOTE' | 'VOICE' | 'VIDEO_PHOTO';
  content: string; // text note, voice duration/url, or photo/video url
  caption?: string;
  bgGradient?: readonly [string, string];
  audioDurationSec?: number;
  createdAt: string;
  expiresAt: string;
  reactions: { userId: number; emoji: string }[];
  repliesCount: number;
  isViewed?: boolean;
}

// --- NEW COUPLE CHAT TYPES ---
export interface ChatMessage {
  id: string;
  senderId: number;
  senderName: string;
  text: string;
  type: 'TEXT' | 'VOICE' | 'PHOTO' | 'STICKER' | 'STORY_REPLY' | 'QUIZ_INVITE';
  storyReplyQuote?: {
    storyId: string;
    storyType: 'NOTE' | 'VOICE' | 'VIDEO_PHOTO';
    snippet: string;
  };
  quizInviteData?: {
    quizId: string;
    quizTitle: string;
    senderScore?: number;
  };
  mediaUrl?: string;
  audioDurationSec?: number;
  reactions?: string[];
  timestamp: string;
  isDelivered?: boolean;
  isRead?: boolean;
}

// --- NEW SCENARIO & 500+ QUIZ TYPES ---
export interface QuizQuestionItem {
  id: number;
  scenario: string; // e.g., "When your partner has a terrible day at work, what is the best thing to do?"
  options: {
    id: string;
    text: string;
    category?: string;
  }[];
  category: string;
}

export interface CompatibilityQuizModule {
  id: string;
  title: string;
  tagline: string;
  category: 'SITUATIONS' | 'FAVORITES' | 'BETTER_LOVE' | 'COMMUNICATION' | 'FUTURE_DREAMS' | 'SPICY';
  iconEmoji: string;
  gradient: readonly [string, string];
  totalQuestions: number;
  questions: QuizQuestionItem[];
}

export interface QuizAttempt {
  quizId: string;
  partner1Answers: Record<number, string>;
  partner2Answers: Record<number, string>;
  isPartner1Completed: boolean;
  isPartner2Completed: boolean;
  bothCompleted: boolean;
  matchPercentage: number;
  matchedCount: number;
  totalQuestions: number;
  cupidInsight: string;
}
