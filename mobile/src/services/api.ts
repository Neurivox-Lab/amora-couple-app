import { Storage } from './storage';
import { 
  User, 
  Couple, 
  Game, 
  GameSession, 
  DailyQuestion, 
  Memory, 
  LoveNote, 
  BucketListItem, 
  DatePlan, 
  CupidAIResponse,
  Nudge
} from '../types';
import { 
  mockUser1, 
  mockUser2, 
  mockCouple, 
  mockDailyQuestion, 
  mockGames, 
  mockMemories, 
  mockLoveNotes, 
  mockBucketList, 
  mockDatePlans 
} from './mockData';

const BASE_URL = 'http://localhost:8080/api';

class ApiClient {
  private token: string | null = null;
  private currentUser: User | null = null;
  private currentCouple: Couple | null = null;
  private memories: Memory[] = [...mockMemories];
  private loveNotes: LoveNote[] = [...mockLoveNotes];
  private bucketList: BucketListItem[] = [...mockBucketList];
  private dailyQuestion: DailyQuestion = { ...mockDailyQuestion };
  private datePlans: DatePlan[] = [...mockDatePlans];
  private isDemoMode: boolean = false;

  async init() {
    const savedToken = await Storage.getItem<string>('auth_token');
    const savedUser = await Storage.getItem<User>('current_user');
    const savedCouple = await Storage.getItem<Couple>('current_couple');
    const savedMemories = await Storage.getItem<Memory[]>('saved_memories');
    const savedNotes = await Storage.getItem<LoveNote[]>('saved_notes');
    const savedBucket = await Storage.getItem<BucketListItem[]>('saved_bucket');

    if (savedToken) this.token = savedToken;
    if (savedUser) this.currentUser = savedUser;
    if (savedCouple) this.currentCouple = savedCouple;
    if (savedMemories) this.memories = savedMemories;
    if (savedNotes) this.loveNotes = savedNotes;
    if (savedBucket) this.bucketList = savedBucket;
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      Storage.setItem('auth_token', token);
    } else {
      Storage.removeItem('auth_token');
    }
  }

  // Switch demo user between Srinija and Partner to test dual-user interactions!
  switchDemoUser(targetUser: 'partner1' | 'partner2') {
    if (targetUser === 'partner1') {
      this.currentUser = mockUser1;
    } else {
      this.currentUser = mockUser2;
    }
    Storage.setItem('current_user', this.currentUser);
    return this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentCouple(): Couple | null {
    return this.currentCouple;
  }

  async loginCoupleDirect(params: {
    partner1Name: string;
    partner1Nickname?: string;
    partner2Name: string;
    partner2Nickname?: string;
    partner1Email?: string;
    partner2Email?: string;
    daysTogether?: number;
  }) {
    const p1Name = params.partner1Name?.trim() || 'Partner 1';
    const p1Nick = params.partner1Nickname?.trim() || p1Name;
    const p2Name = params.partner2Name?.trim() || 'Partner 2';
    const p2Nick = params.partner2Nickname?.trim() || p2Name;
    const days = params.daysTogether !== undefined ? Math.max(1, params.daysTogether) : 1;

    const user1: User = {
      id: Date.now(),
      name: p1Name,
      nickname: p1Nick,
      email: params.partner1Email || `${p1Name.toLowerCase().replace(/\s+/g, '')}@couplefriendly.app`,
      currentMood: 'in_love',
      heartsCount: 0,
    };

    const user2: User = {
      id: Date.now() + 1,
      name: p2Name,
      nickname: p2Nick,
      email: params.partner2Email || `${p2Name.toLowerCase().replace(/\s+/g, '')}@couplefriendly.app`,
      currentMood: 'in_love',
      heartsCount: 0,
    };

    const couple: Couple = {
      id: Date.now(),
      coupleCode: 'CF-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      partner1: user1,
      partner2: user2,
      status: 'ACTIVE',
      relationshipStartDate: new Date(Date.now() - (days - 1) * 86400000).toISOString(),
      daysTogether: days,
      streakCount: 1,
      totalHearts: 0,
      moodPartner1: 'in_love',
      moodPartner2: 'in_love',
      createdAt: new Date().toISOString(),
    };

    this.currentUser = user1;
    this.currentCouple = couple;
    this.memories = [];
    this.loveNotes = [];
    this.setToken('mock-jwt-direct-' + Date.now());

    // Save to multi-user database
    const usersDb = (await Storage.getItem<Record<string, User>>('users_db')) || {};
    usersDb[user1.email!] = user1;
    usersDb[user2.email!] = user2;
    await Storage.setItem('users_db', usersDb);

    const couplesDb = (await Storage.getItem<Record<string, Couple>>('couples_db')) || {};
    couplesDb[couple.coupleCode] = couple;
    await Storage.setItem('couples_db', couplesDb);

    await Storage.setItem('current_user', this.currentUser);
    await Storage.setItem('current_couple', this.currentCouple);
    await Storage.setItem('saved_memories', []);
    await Storage.setItem('saved_notes', []);
    return { token: this.token, user: this.currentUser, couple: this.currentCouple };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      // Offline / Demo fallback
      console.log(`Backend unreachable for ${endpoint}, using local state.`);
      return this.handleFallback<T>(endpoint, options);
    }
  }

  private async handleFallback<T>(endpoint: string, options: RequestInit): Promise<T> {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : {};

    if (endpoint === '/auth/register') {
      const rawName = body.name?.trim() || 'User';
      const rawEmail = (body.email?.trim() || `${rawName.toLowerCase()}@couplefriendly.app`).toLowerCase();
      const newUser: User = {
        id: Date.now(),
        name: rawName,
        nickname: body.nickname?.trim() || rawName,
        email: rawEmail,
        phone: body.phone?.trim(),
        currentMood: 'in_love',
        heartsCount: 0,
      };
      this.currentUser = newUser;
      this.memories = [];
      this.loveNotes = [];

      const usersDb = (await Storage.getItem<Record<string, User>>('users_db')) || {};
      usersDb[rawEmail] = newUser;
      await Storage.setItem('users_db', usersDb);

      const code = 'CF-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      this.currentCouple = {
        id: Date.now(),
        coupleCode: code,
        partner1: newUser,
        partner2: undefined,
        status: 'PENDING',
        relationshipStartDate: new Date().toISOString(),
        daysTogether: 1,
        streakCount: 1,
        totalHearts: 0,
        moodPartner1: 'in_love',
        moodPartner2: undefined,
        createdAt: new Date().toISOString(),
      };

      const couplesDb = (await Storage.getItem<Record<string, Couple>>('couples_db')) || {};
      couplesDb[code] = this.currentCouple;
      await Storage.setItem('couples_db', couplesDb);

      this.setToken('mock-jwt-token-' + Date.now());
      await Storage.setItem('current_user', this.currentUser);
      await Storage.setItem('current_couple', this.currentCouple);
      await Storage.setItem('saved_memories', []);
      await Storage.setItem('saved_notes', []);
      return { token: this.token, user: this.currentUser, couple: this.currentCouple } as unknown as T;
    }

    if (endpoint === '/auth/login') {
      const id = (body.identifier || body.email || body.name || 'User').trim().toLowerCase();
      const usersDb = (await Storage.getItem<Record<string, User>>('users_db')) || {};
      const couplesDb = (await Storage.getItem<Record<string, Couple>>('couples_db')) || {};

      let loggedInUser: User | undefined = usersDb[id];
      if (!loggedInUser) {
        // Search by name
        loggedInUser = Object.values(usersDb).find(
          u => u.name.toLowerCase() === id || u.nickname?.toLowerCase() === id
        );
      }

      if (!loggedInUser) {
        const displayName = id.includes('@') ? id.split('@')[0] : id;
        const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        loggedInUser = {
          id: Date.now(),
          name: formattedName,
          nickname: formattedName,
          email: id.includes('@') ? id : `${displayName}@couplefriendly.app`,
          currentMood: 'in_love',
          heartsCount: 0,
        };
        usersDb[loggedInUser.email!] = loggedInUser;
        await Storage.setItem('users_db', usersDb);
      }

      this.currentUser = loggedInUser;

      // Find couple belonging to this user
      let matchedCouple = Object.values(couplesDb).find(
        c => c.partner1?.id === loggedInUser!.id || c.partner2?.id === loggedInUser!.id || c.partner1?.email === loggedInUser!.email || c.partner2?.email === loggedInUser!.email
      );

      if (!matchedCouple) {
        matchedCouple = {
          id: Date.now(),
          coupleCode: 'CF-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
          partner1: loggedInUser,
          partner2: undefined,
          status: 'ACTIVE',
          relationshipStartDate: new Date().toISOString(),
          daysTogether: 1,
          streakCount: 1,
          totalHearts: 0,
          moodPartner1: 'in_love',
          moodPartner2: 'in_love',
          createdAt: new Date().toISOString(),
        };
        couplesDb[matchedCouple.coupleCode] = matchedCouple;
        await Storage.setItem('couples_db', couplesDb);
      }

      this.currentCouple = matchedCouple;
      this.setToken('mock-jwt-token-' + Date.now());
      await Storage.setItem('current_user', this.currentUser);
      await Storage.setItem('current_couple', this.currentCouple);
      return { token: this.token, user: this.currentUser, couple: this.currentCouple } as unknown as T;
    }

    if (endpoint === '/couples/status') {
      return this.currentCouple as unknown as T;
    }

    if (endpoint === '/couples/invite-code') {
      return this.currentCouple as unknown as T;
    }

    if (endpoint === '/couples/pair') {
      const code = (body.coupleCode || body.code || '').trim().toUpperCase();
      const couplesDb = (await Storage.getItem<Record<string, Couple>>('couples_db')) || {};

      let targetCouple = couplesDb[code] || this.currentCouple;
      if (targetCouple) {
        const partner2User: User = this.currentUser || {
          id: Date.now(),
          name: body.partnerName || 'Partner',
          nickname: body.partnerNickname || 'My Love',
          email: body.email || 'partner@couplefriendly.app',
          currentMood: 'happy',
          heartsCount: 0,
        };
        targetCouple = {
          ...targetCouple,
          partner2: partner2User,
          status: 'ACTIVE',
        };
        couplesDb[targetCouple.coupleCode] = targetCouple;
        await Storage.setItem('couples_db', couplesDb);
        this.currentCouple = targetCouple;
      } else {
        this.currentCouple = {
          id: Date.now(),
          coupleCode: code || 'CF-8X7K',
          partner1: this.currentUser || { id: 1, name: 'Partner 1', nickname: 'My Love', currentMood: 'in_love', heartsCount: 0 },
          partner2: { id: 2, name: 'Partner 2', nickname: 'Sweetheart', currentMood: 'happy', heartsCount: 0 },
          status: 'ACTIVE',
          relationshipStartDate: new Date().toISOString(),
          daysTogether: 1,
          streakCount: 1,
          totalHearts: 0,
          moodPartner1: 'in_love',
          moodPartner2: 'in_love',
          createdAt: new Date().toISOString(),
        };
      }
      await Storage.setItem('current_couple', this.currentCouple);
      return this.currentCouple as unknown as T;
    }

    if (endpoint === '/couples/mood') {
      if (this.currentUser.id === 1) {
        this.currentCouple.moodPartner1 = body.mood;
      } else {
        this.currentCouple.moodPartner2 = body.mood;
      }
      this.currentUser.currentMood = body.mood;
      await Storage.setItem('current_user', this.currentUser);
      await Storage.setItem('current_couple', this.currentCouple);
      return this.currentCouple as unknown as T;
    }

    if (endpoint === '/couples/nudge') {
      this.currentCouple.totalHearts += 5;
      await Storage.setItem('current_couple', this.currentCouple);
      const nudge: Nudge = {
        id: Date.now(),
        sender: this.currentUser,
        receiver: this.currentUser.id === 1 ? mockUser2 : mockUser1,
        nudgeType: body.nudgeType || 'HUG',
        message: body.message,
        isRead: false,
        sentAt: new Date().toISOString(),
      };
      return nudge as unknown as T;
    }

    if (endpoint === '/games') {
      return mockGames as unknown as T;
    }

    if (endpoint === '/games/daily-question') {
      return this.dailyQuestion as unknown as T;
    }

    if (endpoint === '/games/daily-question/answer') {
      if (this.currentUser.id === 1) {
        this.dailyQuestion.partner1Answer = body.answerText;
      } else {
        this.dailyQuestion.partner2Answer = body.answerText;
      }
      this.dailyQuestion.bothAnswered = !!(this.dailyQuestion.partner1Answer && this.dailyQuestion.partner2Answer);
      this.dailyQuestion.isAnsweredByMe = true;
      this.currentCouple.totalHearts += 20;
      await Storage.setItem('current_couple', this.currentCouple);
      return this.dailyQuestion as unknown as T;
    }

    if (endpoint.startsWith('/games/session/')) {
      const gameId = parseInt(endpoint.split('/').pop() || '1');
      const game = mockGames.find(g => g.id === gameId) || mockGames[0];
      const session: GameSession = {
        id: 101,
        coupleId: this.currentCouple.id,
        game,
        status: 'IN_PROGRESS',
        partner1Score: 4,
        partner2Score: 4,
        totalQuestions: 6,
        answeredQuestions: 2,
        startedAt: new Date().toISOString(),
        questions: [
          {
            id: 1,
            gameId: game.id,
            prompt: 'Live in a cozy mountain cabin with a fireplace OR a breezy beachfront villa?',
            optionA: 'Mountain Cabin 🏔️',
            optionB: 'Beachfront Villa 🏖️',
            myAnswer: 'Beachfront Villa 🏖️',
            partnerAnswer: 'Beachfront Villa 🏖️',
            bothAnswered: true,
            isMatch: true,
          },
          {
            id: 2,
            gameId: game.id,
            prompt: 'Have breakfast in bed made by your partner OR cook an extravagant dinner together with wine?',
            optionA: 'Breakfast in Bed ☕',
            optionB: 'Cook Dinner Together 🍷',
            myAnswer: 'Cook Dinner Together 🍷',
            partnerAnswer: 'Cook Dinner Together 🍷',
            bothAnswered: true,
            isMatch: true,
          },
          {
            id: 3,
            gameId: game.id,
            prompt: 'Take a spontaneous 2-week backpacking road trip OR relax at a 5-star luxury all-inclusive resort?',
            optionA: 'Road Trip Adventure 🚗',
            optionB: 'Luxury Resort 🌴',
            myAnswer: null,
            partnerAnswer: 'LOCKED',
            bothAnswered: false,
            isMatch: false,
          },
          {
            id: 4,
            gameId: game.id,
            prompt: 'Spend a rainy evening watching movies under a blanket fort OR slow dancing to acoustic songs in the kitchen?',
            optionA: 'Movie Blanket Fort 🍿',
            optionB: 'Slow Dance in Kitchen 🎶',
            myAnswer: null,
            partnerAnswer: null,
            bothAnswered: false,
            isMatch: false,
          }
        ]
      };
      return session as unknown as T;
    }

    if (endpoint === '/memories') {
      if (method === 'POST') {
        const newMemory: Memory = {
          id: Date.now(),
          title: body.title || 'New Memory',
          description: body.description,
          memoryDate: body.memoryDate || new Date().toISOString().split('T')[0],
          locationName: body.locationName,
          mediaUrls: body.mediaUrls || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop',
          moodTag: body.moodTag || 'Romantic',
          isFavorite: body.isFavorite || false,
          createdAt: new Date().toISOString(),
        };
        this.memories.unshift(newMemory);
        this.currentCouple.totalHearts += 15;
        await Storage.setItem('saved_memories', this.memories);
        await Storage.setItem('current_couple', this.currentCouple);
        return newMemory as unknown as T;
      }
      return this.memories as unknown as T;
    }

    if (endpoint === '/love-notes') {
      if (method === 'POST') {
        const newNote: LoveNote = {
          id: Date.now(),
          sender: this.currentUser,
          receiver: this.currentUser.id === 1 ? mockUser2 : mockUser1,
          category: body.category || 'LOVE_NOTE',
          title: body.title,
          message: body.message,
          unlockCondition: body.unlockCondition,
          scheduledAt: body.scheduledAt,
          paperTheme: body.paperTheme || 'rose',
          isOpened: false,
          createdAt: new Date().toISOString(),
        };
        this.loveNotes.unshift(newNote);
        this.currentCouple.totalHearts += 10;
        await Storage.setItem('saved_notes', this.loveNotes);
        await Storage.setItem('current_couple', this.currentCouple);
        return newNote as unknown as T;
      }
      return this.loveNotes as unknown as T;
    }

    if (endpoint === '/memories/bucket-list') {
      if (method === 'POST') {
        const newItem: BucketListItem = {
          id: Date.now(),
          title: body.title,
          category: body.category || 'TRAVEL',
          isCompleted: false,
          notes: body.notes,
        };
        this.bucketList.unshift(newItem);
        await Storage.setItem('saved_bucket', this.bucketList);
        return newItem as unknown as T;
      }
      return this.bucketList as unknown as T;
    }

    if (endpoint.startsWith('/memories/bucket-list/') && endpoint.endsWith('/toggle')) {
      const id = parseInt(endpoint.split('/')[3]);
      const item = this.bucketList.find(b => b.id === id);
      if (item) {
        item.isCompleted = !item.isCompleted;
        if (item.isCompleted) {
          item.completedAt = new Date().toISOString().split('T')[0];
          this.currentCouple.totalHearts += 25;
          await Storage.setItem('current_couple', this.currentCouple);
        }
        await Storage.setItem('saved_bucket', this.bucketList);
      }
      return item as unknown as T;
    }

    if (endpoint === '/cupid-ai/generate') {
      const res: CupidAIResponse = {
        title: body.mode === 'LOVE_LETTER' ? '💌 Handcrafted Love Letter' : '✨ Twilight Sunset & Candlelight Coffee',
        content: body.mode === 'LOVE_LETTER' 
          ? `Hey my love ❤️,\n\nI was just thinking about us and how lucky I am to have you in my life. ${body.prompt || 'Thank you for all the sweet moments and making everyday special.'}\n\nForever yours 🥰`
          : '1. ☕ 04:30 PM: Meet at a cozy rooftop cafe for hazelnut coffee & strawberry cheesecake.\n2. 🌅 05:45 PM: Golden hour sunset walk holding hands at the lakeside park.\n3. 📸 06:30 PM: Take 3 silly selfies together.\n4. 🍕 07:30 PM: Shared gourmet pizza dinner with acoustic jazz music.',
        suggestions: ['Bring a light jacket for the sunset walk', 'Play your favorite couple song in the car'],
        estimatedCost: '₹1,200',
        tone: body.tone || 'Romantic'
      };
      return res as unknown as T;
    }

    return {} as T;
  }

  // API Call Wrappers
  login = (identifier: string, password?: string) => this.request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password: password || 'Password123!' }) });
  register = (data: any) => this.request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  getCoupleStatus = () => this.request<Couple>('/couples/status');
  getInviteCode = () => this.request<Couple>('/couples/invite-code');
  pairWithCode = (coupleCode: string, relationshipStartDate?: string) => this.request<Couple>('/couples/pair', { method: 'POST', body: JSON.stringify({ coupleCode, relationshipStartDate }) });
  updateMood = (mood: string) => this.request<Couple>('/couples/mood', { method: 'PUT', body: JSON.stringify({ mood }) });
  sendNudge = (nudgeType: string, message?: string) => this.request<Nudge>('/couples/nudge', { method: 'POST', body: JSON.stringify({ nudgeType, message }) });
  
  getGames = () => this.request<Game[]>('/games');
  getDailyQuestion = () => this.request<DailyQuestion>('/games/daily-question');
  answerDailyQuestion = (answerText: string) => this.request<DailyQuestion>('/games/daily-question/answer', { method: 'POST', body: JSON.stringify({ answerText }) });
  startGameSession = (gameId: number) => this.request<GameSession>(`/games/session/${gameId}`, { method: 'POST' });
  submitGameAnswer = (sessionId: number, questionId: number, answerText: string) => this.request<GameSession>('/games/answer', { method: 'POST', body: JSON.stringify({ sessionId, questionId, answerText }) });
  
  getMemories = () => this.request<Memory[]>('/memories');
  createMemory = (data: any) => this.request<Memory>('/memories', { method: 'POST', body: JSON.stringify(data) });
  getLoveNotes = () => this.request<LoveNote[]>('/love-notes');
  createLoveNote = (data: any) => this.request<LoveNote>('/love-notes', { method: 'POST', body: JSON.stringify(data) });
  openLoveNote = (id: number) => this.request<LoveNote>(`/love-notes/${id}/open`, { method: 'PUT' });
  
  getBucketList = () => this.request<BucketListItem[]>('/memories/bucket-list');
  addBucketItem = (data: any) => this.request<BucketListItem>('/memories/bucket-list', { method: 'POST', body: JSON.stringify(data) });
  toggleBucketItem = (id: number) => this.request<BucketListItem>(`/memories/bucket-list/${id}/toggle`, { method: 'PUT' });

  generateCupidAI = (data: any) => this.request<CupidAIResponse>('/cupid-ai/generate', { method: 'POST', body: JSON.stringify(data) });
}

export const api = new ApiClient();
