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
  mockGames, 
  mockDailyQuestion 
} from './mockData';

const BASE_URL = 'http://localhost:8080/api';

export interface UserRecord extends User {
  password?: string;
  phone?: string;
}

class ApiClient {
  private token: string | null = null;
  private currentUser: User | null = null;
  private currentCouple: Couple | null = null;
  private memories: Memory[] = [];
  private loveNotes: LoveNote[] = [];
  private bucketList: BucketListItem[] = [];
  private dailyQuestion: DailyQuestion = { 
    ...mockDailyQuestion, 
    partner1Answer: undefined, 
    partner2Answer: undefined, 
    bothAnswered: false, 
    isAnsweredByMe: false 
  };
  private datePlans: DatePlan[] = [];

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

  // Switch demo user between Partner 1 and Partner 2
  switchDemoUser(targetUser: 'partner1' | 'partner2') {
    if (this.currentCouple) {
      if (targetUser === 'partner1' && this.currentCouple.partner1) {
        this.currentUser = this.currentCouple.partner1;
      } else if (targetUser === 'partner2' && this.currentCouple.partner2) {
        this.currentUser = this.currentCouple.partner2;
      }
    }
    if (this.currentUser) {
      Storage.setItem('current_user', this.currentUser);
    }
    return this.currentUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentCouple(): Couple | null {
    return this.currentCouple;
  }

  async login(identifier: string, password?: string) {
    return this.request<{ token: string; user: User; couple: Couple }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  }

  async register(data: {
    name: string;
    nickname?: string;
    phone: string;
    password: string;
    email?: string;
    coupleCode?: string;
  }) {
    return this.request<{ token: string; user: User; couple: Couple }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async loginCoupleDirect(params: {
    partner1Name: string;
    partner1Nickname?: string;
    partner1Phone?: string;
    partner2Name: string;
    partner2Nickname?: string;
    partner2Phone?: string;
    daysTogether?: number;
  }) {
    const p1Name = params.partner1Name?.trim() || 'Partner 1';
    const p1Nick = params.partner1Nickname?.trim() || p1Name;
    const p2Name = params.partner2Name?.trim() || 'Partner 2';
    const p2Nick = params.partner2Nickname?.trim() || p2Name;
    const days = params.daysTogether !== undefined ? Math.max(1, params.daysTogether) : 1;

    const user1: UserRecord = {
      id: Date.now(),
      name: p1Name,
      nickname: p1Nick,
      phone: params.partner1Phone || '9876543210',
      email: `${p1Name.toLowerCase().replace(/\s+/g, '')}@couplefriendly.app`,
      currentMood: 'in_love',
      heartsCount: 0,
    };

    const user2: UserRecord = {
      id: Date.now() + 1,
      name: p2Name,
      nickname: p2Nick,
      phone: params.partner2Phone || '9876543211',
      email: `${p2Name.toLowerCase().replace(/\s+/g, '')}@couplefriendly.app`,
      currentMood: 'in_love',
      heartsCount: 0,
    };

    const code = 'CF-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const couple: Couple = {
      id: Date.now(),
      coupleCode: code,
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
    this.bucketList = [];
    this.setToken('mock-jwt-direct-' + Date.now());

    // Save to multi-user database
    const usersDb = (await Storage.getItem<Record<string, UserRecord>>('users_db')) || {};
    usersDb[user1.phone!] = user1;
    usersDb[user2.phone!] = user2;
    await Storage.setItem('users_db', usersDb);

    const couplesDb = (await Storage.getItem<Record<string, Couple>>('couples_db')) || {};
    couplesDb[couple.coupleCode] = couple;
    await Storage.setItem('couples_db', couplesDb);

    await Storage.setItem('current_user', this.currentUser);
    await Storage.setItem('current_couple', this.currentCouple);
    await Storage.setItem('saved_memories', []);
    await Storage.setItem('saved_notes', []);
    await Storage.setItem('saved_bucket', []);
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
      // Client-side offline / mobile local DB fallback
      return this.handleFallback<T>(endpoint, options);
    }
  }

  private async handleFallback<T>(endpoint: string, options: RequestInit): Promise<T> {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body as string) : {};

    if (endpoint === '/auth/register') {
      const rawName = body.name?.trim() || 'User';
      const rawPhone = (body.phone?.trim() || body.mobile?.trim() || '').replace(/\s+/g, '');
      const rawPassword = body.password?.trim() || '';
      const rawNickname = body.nickname?.trim() || rawName;

      const newUser: UserRecord = {
        id: Date.now(),
        name: rawName,
        nickname: rawNickname,
        phone: rawPhone,
        password: rawPassword,
        email: body.email?.trim() || `${rawName.toLowerCase()}@couplefriendly.app`,
        currentMood: 'in_love',
        heartsCount: 0,
      };

      const usersDb = (await Storage.getItem<Record<string, UserRecord>>('users_db')) || {};
      usersDb[rawPhone] = newUser;
      if (newUser.email) usersDb[newUser.email.toLowerCase()] = newUser;
      await Storage.setItem('users_db', usersDb);

      this.currentUser = newUser;
      this.memories = [];
      this.loveNotes = [];
      this.bucketList = [];

      const couplesDb = (await Storage.getItem<Record<string, Couple>>('couples_db')) || {};

      // If user provided a partner's couple code during registration
      const targetCode = (body.coupleCode || '').trim().toUpperCase();
      if (targetCode && couplesDb[targetCode]) {
        const existingCouple = couplesDb[targetCode];
        this.currentCouple = {
          ...existingCouple,
          partner2: newUser,
          status: 'ACTIVE',
        };
        couplesDb[targetCode] = this.currentCouple;
      } else {
        const newCode = 'CF-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        this.currentCouple = {
          id: Date.now(),
          coupleCode: newCode,
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
        couplesDb[newCode] = this.currentCouple;
      }

      await Storage.setItem('couples_db', couplesDb);
      this.setToken('mock-jwt-token-' + Date.now());
      await Storage.setItem('current_user', this.currentUser);
      await Storage.setItem('current_couple', this.currentCouple);
      await Storage.setItem('saved_memories', []);
      await Storage.setItem('saved_notes', []);
      await Storage.setItem('saved_bucket', []);
      return { token: this.token, user: this.currentUser, couple: this.currentCouple } as unknown as T;
    }

    if (endpoint === '/auth/login') {
      const id = (body.identifier || body.phone || body.email || body.name || '').trim().toLowerCase().replace(/\s+/g, '');
      const inputPass = (body.password || '').trim();

      const usersDb = (await Storage.getItem<Record<string, UserRecord>>('users_db')) || {};
      const couplesDb = (await Storage.getItem<Record<string, Couple>>('couples_db')) || {};

      let loggedInUser: UserRecord | undefined = usersDb[id];
      if (!loggedInUser) {
        // Search by phone, email, or name
        loggedInUser = Object.values(usersDb).find(
          u => (u.phone && u.phone.replace(/\s+/g, '') === id) || 
               (u.email && u.email.toLowerCase() === id) || 
               u.name.toLowerCase() === id || 
               u.nickname?.toLowerCase() === id
        );
      }

      if (!loggedInUser) {
        // Create new profile with clean 0 stats if not found
        const isPhone = /^\+?[0-9]{7,15}$/.test(id);
        const displayName = isPhone ? `User-${id.slice(-4)}` : id.charAt(0).toUpperCase() + id.slice(1);
        loggedInUser = {
          id: Date.now(),
          name: displayName,
          nickname: displayName,
          phone: isPhone ? id : undefined,
          password: inputPass || 'Password123',
          email: !isPhone && id.includes('@') ? id : `${displayName.toLowerCase()}@couplefriendly.app`,
          currentMood: 'in_love',
          heartsCount: 0,
        };
        usersDb[id] = loggedInUser;
        await Storage.setItem('users_db', usersDb);
      }

      this.currentUser = loggedInUser;

      // Find couple belonging to this user
      let matchedCouple = Object.values(couplesDb).find(
        c => c.partner1?.id === loggedInUser!.id || 
             c.partner2?.id === loggedInUser!.id || 
             (c.partner1 as UserRecord)?.phone === loggedInUser!.phone || 
             (c.partner2 as UserRecord)?.phone === loggedInUser!.phone ||
             c.partner1?.email === loggedInUser!.email || 
             c.partner2?.email === loggedInUser!.email
      );

      if (!matchedCouple) {
        const code = 'CF-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        matchedCouple = {
          id: Date.now(),
          coupleCode: code,
          partner1: loggedInUser,
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
        couplesDb[code] = matchedCouple;
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
          phone: body.phone || '9876543210',
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
      if (this.currentCouple) {
        const isP1 = this.currentUser?.id === this.currentCouple.partner1?.id;
        if (isP1) {
          this.currentCouple.moodPartner1 = body.mood;
        } else {
          this.currentCouple.moodPartner2 = body.mood;
        }
        await Storage.setItem('current_couple', this.currentCouple);
      }
      if (this.currentUser) {
        this.currentUser.currentMood = body.mood;
        await Storage.setItem('current_user', this.currentUser);
      }
      return this.currentCouple as unknown as T;
    }

    if (endpoint === '/couples/nudge') {
      if (this.currentCouple) {
        this.currentCouple.totalHearts += 5;
        await Storage.setItem('current_couple', this.currentCouple);
      }
      const nudge: Nudge = {
        id: Date.now(),
        sender: this.currentUser!,
        receiver: (this.currentUser?.id === this.currentCouple?.partner1?.id ? this.currentCouple?.partner2 : this.currentCouple?.partner1) || this.currentUser!,
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
      const isP1 = this.currentUser?.id === this.currentCouple?.partner1?.id;
      if (isP1) {
        this.dailyQuestion.partner1Answer = body.answerText;
      } else {
        this.dailyQuestion.partner2Answer = body.answerText;
      }
      this.dailyQuestion.bothAnswered = !!(this.dailyQuestion.partner1Answer && this.dailyQuestion.partner2Answer);
      this.dailyQuestion.isAnsweredByMe = true;
      if (this.currentCouple) {
        this.currentCouple.totalHearts += 20;
        await Storage.setItem('current_couple', this.currentCouple);
      }
      return this.dailyQuestion as unknown as T;
    }

    if (endpoint === '/memories') {
      return this.memories as unknown as T;
    }

    if (endpoint === '/memories/create') {
      const newMem: Memory = {
        id: Date.now(),
        coupleId: this.currentCouple?.id || 1,
        title: body.title || 'Special Memory',
        description: body.description || '',
        memoryDate: body.memoryDate || new Date().toISOString(),
        imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop',
        tags: body.tags || 'DATE_NIGHT',
        createdById: this.currentUser?.id || 1,
        createdAt: new Date().toISOString(),
      };
      this.memories.unshift(newMem);
      await Storage.setItem('saved_memories', this.memories);
      if (this.currentCouple) {
        this.currentCouple.totalHearts += 15;
        await Storage.setItem('current_couple', this.currentCouple);
      }
      return newMem as unknown as T;
    }

    if (endpoint === '/love-notes') {
      return this.loveNotes as unknown as T;
    }

    if (endpoint === '/love-notes/create') {
      const newNote: LoveNote = {
        id: Date.now(),
        sender: this.currentUser!,
        content: body.content || '',
        fontStyle: body.fontStyle || 'HANDWRITTEN',
        bgTheme: body.bgTheme || 'ROSE_GOLD',
        isSealed: body.isSealed ?? false,
        openDate: body.openDate,
        createdAt: new Date().toISOString(),
      };
      this.loveNotes.unshift(newNote);
      await Storage.setItem('saved_notes', this.loveNotes);
      if (this.currentCouple) {
        this.currentCouple.totalHearts += 10;
        await Storage.setItem('current_couple', this.currentCouple);
      }
      return newNote as unknown as T;
    }

    if (endpoint === '/bucket-list') {
      return this.bucketList as unknown as T;
    }

    if (endpoint === '/bucket-list/create') {
      const newItem: BucketListItem = {
        id: Date.now(),
        title: body.title || 'Dream Date',
        description: body.description,
        isCompleted: false,
        suggestedBy: this.currentUser!,
        category: body.category || 'ADVENTURE',
      };
      this.bucketList.push(newItem);
      await Storage.setItem('saved_bucket', this.bucketList);
      return newItem as unknown as T;
    }

    return {} as unknown as T;
  }

  async getCoupleStatus(): Promise<Couple> {
    return this.request<Couple>('/couples/status');
  }

  async pairWithCode(code: string, startDate?: string): Promise<Couple> {
    return this.request<Couple>('/couples/pair', {
      method: 'POST',
      body: JSON.stringify({ coupleCode: code, startDate }),
    });
  }

  async updateMood(mood: string): Promise<Couple> {
    return this.request<Couple>('/couples/mood', {
      method: 'POST',
      body: JSON.stringify({ mood }),
    });
  }

  async sendNudge(nudgeType: string, message?: string): Promise<Nudge> {
    return this.request<Nudge>('/couples/nudge', {
      method: 'POST',
      body: JSON.stringify({ nudgeType, message }),
    });
  }

  async getDailyQuestion(): Promise<DailyQuestion> {
    return this.request<DailyQuestion>('/games/daily-question');
  }

  async answerDailyQuestion(answerText: string): Promise<DailyQuestion> {
    return this.request<DailyQuestion>('/games/daily-question/answer', {
      method: 'POST',
      body: JSON.stringify({ answerText }),
    });
  }

  async getMemories(): Promise<Memory[]> {
    return this.request<Memory[]>('/memories');
  }

  async createMemory(data: Partial<Memory>): Promise<Memory> {
    return this.request<Memory>('/memories/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLoveNotes(): Promise<LoveNote[]> {
    return this.request<LoveNote[]>('/love-notes');
  }

  async createLoveNote(data: Partial<LoveNote>): Promise<LoveNote> {
    return this.request<LoveNote>('/love-notes/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBucketList(): Promise<BucketListItem[]> {
    return this.request<BucketListItem[]>('/bucket-list');
  }

  async createBucketListItem(data: Partial<BucketListItem>): Promise<BucketListItem> {
    return this.request<BucketListItem>('/bucket-list/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
