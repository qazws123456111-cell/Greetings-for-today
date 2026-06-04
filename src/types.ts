export type RelationshipType = 'family' | 'friend' | 'lover' | 'acquaintance';

export type ContactPeriod = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface Relationship {
  id: string;
  name: string;
  type: RelationshipType;
  closeness: number; // 1 to 5
  period: ContactPeriod;
  lastContacted: string; // ISO Date String or ""
  createdAt: string;
}

export type QuestStatus = 'pending' | 'completed' | 'skipped';

export interface Quest {
  id: string;
  relationshipId: string;
  relationshipName: string;
  relationshipType: RelationshipType;
  title: string;
  description: string;
  templateMessage: string;
  status: QuestStatus;
  createdAt: string;
  completedAt: string | null;
  emotion: EmotionType | null;
  actionType: 'template' | 'custom' | null;
}

export type EmotionType = 'love' | 'happy' | 'neutral' | 'awkward';

export interface HistoryLog {
  id: string;
  relationshipId: string;
  relationshipName: string;
  relationshipType: RelationshipType;
  actionType: 'template' | 'custom';
  message: string;
  timestamp: string;
  emotion: EmotionType;
  pointsEarned: number;
  letterContent?: string; // 작성한 편지 내용
  skinId?: string | null; // 적용된 편지지 스킨 ID
}

export type RewardCategory = 'gifticon' | 'character' | 'skin';

export interface RewardItem {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string; // Emoji
  unlocked: boolean;
  unlockedAt: string | null;
  category: RewardCategory;
}

export interface User {
  id: string;
  name: string;
  createdAt: string; // 가입 일시 타임스탬프
}

export interface StoreState {
  currentUser: User | null; // 현재 로그인된 유저
  currentDay: number; // 가입 후 경과한 일수 (1일차, 2일차...)
  relationships: Relationship[];
  quests: Quest[];
  history: HistoryLog[];
  points: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  rewards: RewardItem[];
  equippedItems: string[]; // IDs of equipped character items
  equippedSkin: string | null; // ID of equipped letter background skin
  dailyAdChargeCount: number; // 일일 광고 충전 횟수 (최대 5회)
  dailyQuestRefreshCount: number; // 일일 퀘스트 새로고침 횟수 (최대 3회)
}


