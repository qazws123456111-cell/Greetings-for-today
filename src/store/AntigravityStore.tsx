import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Relationship, HistoryLog, RewardItem, StoreState, RelationshipType, ContactPeriod, EmotionType } from '../types';
import { generateQuestForRelationship } from '../services/aiEngine';

interface AntigravityContextType {
  state: StoreState;
  addRelationship: (name: string, type: RelationshipType, period: ContactPeriod, closeness: number) => void;
  updateRelationship: (id: string, name: string, type: RelationshipType, period: ContactPeriod, closeness: number) => void;
  deleteRelationship: (id: string) => void;
  completeQuest: (questId: string, actionType: 'template' | 'custom', emotion: EmotionType) => void;
  refreshQuest: (questId: string) => Promise<void>;
  generateNewQuests: () => Promise<void>;
  purchaseReward: (rewardId: string) => boolean;
  addPoints: (amount: number) => void;
  resetAllData: () => void;
  toggleEquipItem: (itemId: string) => void;
  equipSkin: (skinId: string | null) => void;
}

const AntigravityContext = createContext<AntigravityContextType | undefined>(undefined);

// 기본 리워드 상점 품목 (기프티콘 + 디지털 콘텐츠)
const INITIAL_REWARDS: RewardItem[] = [
  // 1. 기프티콘 교환 상품
  { id: 'r1', name: '따뜻한 아메리카노 기프티콘', price: 500, description: '소중한 이에게 또는 수고한 자신에게 선물하세요 ☕', icon: '☕', unlocked: false, unlockedAt: null, category: 'gifticon' },
  { id: 'r2', name: '감동 가득 커스텀 편지 템플릿', price: 200, description: '평소 전하지 못한 더 깊은 마음을 전하는 템플릿 💌', icon: '💌', unlocked: false, unlockedAt: null, category: 'gifticon' },
  { id: 'r3', name: '부모님 맞춤 효도 안마 쿠폰', price: 300, description: '부모님의 피로를 싹 날려줄 깜짝 실물 쿠폰 🎫', icon: '🎫', unlocked: false, unlockedAt: null, category: 'gifticon' },
  { id: 'r4', name: '달콤한 편의점 초콜릿 기프트', price: 150, description: '가벼운 안부와 함께 톡으로 쓱 건네기 좋은 선물 🍫', icon: '🍫', unlocked: false, unlockedAt: null, category: 'gifticon' },

  // 2. 캐릭터 꾸미기 상품
  { id: 'item-scarf', name: '따뜻한 겨울 목도리', price: 100, description: '안부 요정 온이에게 둘러줄 수 있는 따스한 빨간 목도리 🧣', icon: '🧣', unlocked: false, unlockedAt: null, category: 'character' },
  { id: 'item-crown', name: '안부 마스터 왕관', price: 150, description: '꾸준히 안부를 잘 전하는 마스터를 위한 황금 왕관 👑', icon: '👑', unlocked: false, unlockedAt: null, category: 'character' },
  { id: 'item-glasses', name: '스마트 골드 안경', price: 80, description: '온이의 지적인 분위기와 다정한 눈빛을 연출하는 안경 👓', icon: '👓', unlocked: false, unlockedAt: null, category: 'character' },

  // 3. 편지지 스킨 상품
  { id: 'skin-night', name: '별이 빛나는 밤 편지지', price: 120, description: '잔잔한 밤하늘 감성을 담은 어두운 톤의 가상 메신저 스킨 🌌', icon: '🌌', unlocked: false, unlockedAt: null, category: 'skin' },
  { id: 'skin-cherry', name: '벚꽃 가득 봄날 편지지', price: 120, description: '화사한 벚꽃 잎이 날리는 핑크빛 가상 메신저 스킨 🌸', icon: '🌸', unlocked: false, unlockedAt: null, category: 'skin' },
  { id: 'skin-sunset', name: '노을빛 하늘 편지지', price: 100, description: '따스한 저녁 노을빛을 머금은 감성 메신저 스킨 🌇', icon: '🌇', unlocked: false, unlockedAt: null, category: 'skin' },
];

// 초기 관계 Mock 데이터
const INITIAL_RELATIONSHIPS: Relationship[] = [
  { id: 'rel-1', name: '엄마', type: 'family', closeness: 5, period: 'weekly', lastContacted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'rel-2', name: '김민우 (친구)', type: 'friend', closeness: 4, period: 'biweekly', lastContacted: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'rel-3', name: '소희 (연인)', type: 'lover', closeness: 5, period: 'daily', lastContacted: new Date().toISOString(), createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'rel-4', name: '팀장님 (지인)', type: 'acquaintance', closeness: 3, period: 'monthly', lastContacted: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
];

// 초기 히스토리 기록 Mock 데이터
const INITIAL_HISTORY: HistoryLog[] = [
  { id: 'h-1', relationshipId: 'rel-3', relationshipName: '소희 (연인)', relationshipType: 'lover', actionType: 'custom', message: '본인의 진심을 담은 직접 연락', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), emotion: 'love', pointsEarned: 100 },
  { id: 'h-2', relationshipId: 'rel-1', relationshipName: '엄마', relationshipType: 'family', actionType: 'template', message: '가족 단체방에 기분 좋은 아침 인사 남기기', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), emotion: 'happy', pointsEarned: 100 },
  { id: 'h-3', relationshipId: 'rel-2', relationshipName: '김민우 (친구)', relationshipType: 'friend', actionType: 'template', message: '오랜 친구에게 근황 묻는 메시지 보내기', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), emotion: 'neutral', pointsEarned: 100 },
];

const LOCAL_STORAGE_KEY = 'today_hello_state_v3';

export const AntigravityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>({
    relationships: [],
    quests: [],
    history: [],
    points: 0,
    streak: 0,
    lastActiveDate: '',
    rewards: [],
    equippedItems: [],
    equippedSkin: null,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // 최초 로드 시 LocalStorage에서 데이터를 읽거나 초기 데이터 세팅
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 마이그레이션: 기존 저장된 리워드 상품 상태를 유지하며 신규 디지털 품목들을 병합
        const mergedRewards = INITIAL_REWARDS.map(initialItem => {
          const savedItem = parsed.rewards?.find((r: any) => r.id === initialItem.id);
          return savedItem ? { ...initialItem, unlocked: savedItem.unlocked, unlockedAt: savedItem.unlockedAt } : initialItem;
        });

        setState({
          relationships: parsed.relationships || [],
          quests: parsed.quests || [],
          history: parsed.history || [],
          points: typeof parsed.points === 'number' ? parsed.points : 0,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          lastActiveDate: parsed.lastActiveDate || '',
          rewards: mergedRewards,
          equippedItems: parsed.equippedItems || [],
          equippedSkin: parsed.equippedSkin || null,
        });
      } catch (e) {
        console.error("Failed to parse local storage state", e);
        initializeDefaultState();
      }
    } else {
      initializeDefaultState();
    }
    setIsLoaded(true);
  }, []);

  // 상태가 바뀔 때마다 LocalStorage에 저장
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const initializeDefaultState = async () => {
    // 뼈대 관계에 근거하여 초기 퀘스트 3개 자동 생성
    const activeQuests = await Promise.all([
      generateQuestForRelationship(INITIAL_RELATIONSHIPS[0]), // 엄마
      generateQuestForRelationship(INITIAL_RELATIONSHIPS[1]), // 김민우
      generateQuestForRelationship(INITIAL_RELATIONSHIPS[2]), // 소희
    ]);

    setState({
      relationships: INITIAL_RELATIONSHIPS,
      quests: activeQuests,
      history: INITIAL_HISTORY,
      points: 250, // 초기 축하 보너스 포인트
      streak: 3,   // 3일 연속 스트릭 상태로 시작하여 흥미 유발
      lastActiveDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 어제 날짜
      rewards: INITIAL_REWARDS,
      equippedItems: [],
      equippedSkin: null,
    });
  };

  // 관계 추가
  const addRelationship = (name: string, type: RelationshipType, period: ContactPeriod, closeness: number) => {
    const newRel: Relationship = {
      id: `rel-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      type,
      closeness,
      period,
      lastContacted: '',
      createdAt: new Date().toISOString()
    };

    // 즉시 해당 관계에 대한 AI 안부 퀘스트 생성하여 추가
    generateQuestForRelationship(newRel).then((quest) => {
      setState(prev => ({
        ...prev,
        relationships: [...prev.relationships, newRel],
        quests: [...prev.quests, quest]
      }));
    });
  };

  // 관계 수정
  const updateRelationship = (id: string, name: string, type: RelationshipType, period: ContactPeriod, closeness: number) => {
    setState(prev => ({
      ...prev,
      relationships: prev.relationships.map(rel => 
        rel.id === id ? { ...rel, name, type, period, closeness } : rel
      )
    }));
  };

  // 관계 삭제 (연관된 퀘스트도 함께 정리)
  const deleteRelationship = (id: string) => {
    setState(prev => ({
      ...prev,
      relationships: prev.relationships.filter(rel => rel.id !== id),
      quests: prev.quests.filter(q => q.relationshipId !== id)
    }));
  };

  // 퀘스트 완료 및 감정 기록 & 리워드 지급 (+100xp)
  const completeQuest = (questId: string, actionType: 'template' | 'custom', emotion: EmotionType) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setState(prev => {
      // 대상 퀘스트 탐색
      const questIndex = prev.quests.findIndex(q => q.id === questId);
      if (questIndex === -1) return prev;

      const targetQuest = prev.quests[questIndex];
      const updatedQuests = [...prev.quests];
      updatedQuests[questIndex] = {
        ...targetQuest,
        status: 'completed',
        completedAt: new Date().toISOString(),
        emotion,
        actionType
      };

      // 해당 관계의 '마지막 연락일' 업데이트
      const updatedRelationships = prev.relationships.map(rel => 
        rel.id === targetQuest.relationshipId 
          ? { ...rel, lastContacted: new Date().toISOString() } 
          : rel
      );

      // 신규 타임라인 히스토리 로그 생성
      const newHistoryLog: HistoryLog = {
        id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        relationshipId: targetQuest.relationshipId,
        relationshipName: targetQuest.relationshipName,
        relationshipType: targetQuest.relationshipType,
        actionType,
        message: actionType === 'template' ? targetQuest.title : `${targetQuest.relationshipName}님께 직접 따뜻한 마음 전송`,
        timestamp: new Date().toISOString(),
        emotion,
        pointsEarned: 100
      };

      // 스트릭 계산
      let newStreak = prev.streak;
      if (prev.lastActiveDate !== todayStr) {
        if (prev.lastActiveDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]) {
          newStreak += 1; // 연속 일수 1일 증가
        } else if (prev.lastActiveDate === '') {
          newStreak = 1;  // 최초 완료
        } else {
          newStreak = 1;  // 스트릭이 끊겼던 경우 리셋 후 1일차 시작
        }
      }

      // 포인트 가산 (+100xp) + 보너스 스트릭 포인트 적립
      let bonusPoints = 0;
      if (newStreak === 3 && prev.streak !== 3) {
        bonusPoints = 50; // 3일 연속 달성 보너스
      } else if (newStreak === 7 && prev.streak !== 7) {
        bonusPoints = 200; // 7일 연속 달성 보너스
      }

      const totalEarned = 100 + bonusPoints;

      return {
        ...prev,
        quests: updatedQuests,
        relationships: updatedRelationships,
        history: [newHistoryLog, ...prev.history],
        points: prev.points + totalEarned,
        streak: newStreak,
        lastActiveDate: todayStr
      };
    });
  };

  // 단일 퀘스트 수동 새로고침 (AI 재분석)
  const refreshQuest = async (questId: string) => {
    const targetQuest = state.quests.find(q => q.id === questId);
    if (!targetQuest) return;

    const relationship = state.relationships.find(r => r.id === targetQuest.relationshipId);
    if (!relationship) return;

    const newQuest = await generateQuestForRelationship(relationship);
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(q => q.id === questId ? newQuest : q)
    }));
  };

  // 모든 관계에 대해 '오늘의 퀘스트' 일괄 생성/갱신 (새로운 아침 퀘스트 시작)
  const generateNewQuests = async () => {
    const activeRels = [...state.relationships];
    if (activeRels.length === 0) return;

    // 모든 관계를 랜덤하게 셔플하여 최대 3개의 퀘스트 생성
    const shuffled = activeRels.sort(() => 0.5 - Math.random());
    const targetRels = shuffled.slice(0, Math.min(3, shuffled.length));

    const newQuests = await Promise.all(
      targetRels.map(rel => generateQuestForRelationship(rel))
    );

    setState(prev => ({
      ...prev,
      quests: newQuests
    }));
  };

  // 리워드 상점 구매 로직
  const purchaseReward = (rewardId: string): boolean => {
    let success = false;
    setState(prev => {
      const reward = prev.rewards.find(r => r.id === rewardId);
      if (!reward || prev.points < reward.price) return prev;

      success = true;
      return {
        ...prev,
        points: prev.points - reward.price,
        rewards: prev.rewards.map(r => 
          r.id === rewardId 
            ? { ...r, unlocked: true, unlockedAt: new Date().toISOString() } 
            : r
        )
      };
    });
    return success;
  };

  // 캐릭터 아이템 장착 토글
  const toggleEquipItem = (itemId: string) => {
    setState(prev => {
      const equippedItems = prev.equippedItems || [];
      const isEquipped = equippedItems.includes(itemId);
      const updated = isEquipped
        ? equippedItems.filter(id => id !== itemId)
        : [...equippedItems, itemId];
      return { ...prev, equippedItems: updated };
    });
  };

  // 편지지 배경 스킨 적용
  const equipSkin = (skinId: string | null) => {
    setState(prev => ({
      ...prev,
      equippedSkin: skinId
    }));
  };

  // 수동 포인트 가산 (디버깅 / 데모용)
  const addPoints = (amount: number) => {
    setState(prev => ({ ...prev, points: prev.points + amount }));
  };

  // 초기화 (완전 리셋)
  const resetAllData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    initializeDefaultState();
  };

  return (
    <AntigravityContext.Provider
      value={{
        state,
        addRelationship,
        updateRelationship,
        deleteRelationship,
        completeQuest,
        refreshQuest,
        generateNewQuests,
        purchaseReward,
        addPoints,
        resetAllData,
        toggleEquipItem,
        equipSkin
      }}
    >
      {children}
    </AntigravityContext.Provider>
  );
};

export const useAntigravity = () => {
  const context = useContext(AntigravityContext);
  if (!context) {
    throw new Error('useAntigravity must be used within an AntigravityProvider');
  }
  return context;
};
