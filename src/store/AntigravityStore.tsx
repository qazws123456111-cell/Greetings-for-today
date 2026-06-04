import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Relationship, HistoryLog, RewardItem, StoreState, RelationshipType, ContactPeriod, EmotionType, User } from '../types';
import { generateQuestForRelationship } from '../services/aiEngine';

interface AntigravityContextType {
  state: StoreState;
  signup: (id: string, password: string, name: string) => { success: boolean; message: string };
  login: (id: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  addRelationship: (name: string, type: RelationshipType, period: ContactPeriod, closeness: number) => void;
  updateRelationship: (id: string, name: string, type: RelationshipType, period: ContactPeriod, closeness: number) => void;
  deleteRelationship: (id: string) => void;
  completeQuest: (questId: string, actionType: 'template' | 'custom', emotion: EmotionType, letterContent?: string) => void;
  refreshQuest: (questId: string) => Promise<void>;
  generateNewQuests: () => Promise<void>;
  purchaseReward: (rewardId: string) => boolean;
  addPoints: (amount: number) => void;
  resetAllData: () => void;
  toggleEquipItem: (itemId: string) => void;
  equipSkin: (skinId: string | null) => void;
  advanceDayForDemo: () => void; // 데모를 위한 1일 강제 시간 흐름 시뮬레이션
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
];

const USERS_LIST_KEY = 'today_hello_users_v3';
const ACTIVE_SESSION_KEY = 'today_hello_active_session_v3';

export const AntigravityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoreState>({
    currentUser: null,
    currentDay: 1,
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

  // 로컬 가상 유저 DB 관리
  const getUsersFromStorage = (): (User & { password?: string })[] => {
    const saved = localStorage.getItem(USERS_LIST_KEY);
    return saved ? JSON.parse(saved) : [];
  };

  const saveUsersToStorage = (users: any[]) => {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  };

  // 가입일 기준 경과 일수 계산 (1일차, 2일차...)
  const calculateDayDiff = (createdAtStr: string): number => {
    const start = new Date(createdAtStr).getTime();
    const now = new Date().getTime();
    // 가입 당일은 1일차
    const diffTime = now - start;
    const diffDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    return diffDays + 1;
  };

  // 회원가입
  const signup = (id: string, password: string, name: string) => {
    const users = getUsersFromStorage();
    if (users.some(u => u.id === id)) {
      return { success: false, message: '이미 존재하는 아이디입니다.' };
    }

    const newUser: User & { password?: string } = {
      id,
      name,
      createdAt: new Date().toISOString(),
      password, // 가상 DB에 간단히 저장
    };

    saveUsersToStorage([...users, newUser]);

    // 해당 신규 유저를 위한 초기 데이터 구축 및 로그인
    const initialUser: User = { id: newUser.id, name: newUser.name, createdAt: newUser.createdAt };
    
    // 비동기로 최초 퀘스트를 받아와서 상태 초기화
    setupInitialStateForUser(initialUser);

    return { success: true, message: '회원가입이 완료되었습니다!' };
  };

  // 로그인
  const login = (id: string, password: string) => {
    const users = getUsersFromStorage();
    const foundUser = users.find(u => u.id === id && u.password === password);
    if (!foundUser) {
      return { success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' };
    }

    const activeUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      createdAt: foundUser.createdAt,
    };

    localStorage.setItem(ACTIVE_SESSION_KEY, activeUser.id);
    loadUserState(activeUser);

    return { success: true, message: '로그인에 성공했습니다!' };
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    setState({
      currentUser: null,
      currentDay: 1,
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
  };

  // 유저별 초기 상태 생성 및 로드
  const setupInitialStateForUser = async (user: User) => {
    const activeQuests = await Promise.all([
      generateQuestForRelationship(INITIAL_RELATIONSHIPS[0]), // 엄마
      generateQuestForRelationship(INITIAL_RELATIONSHIPS[1]), // 김민우
      generateQuestForRelationship(INITIAL_RELATIONSHIPS[2]), // 소희
    ]);

    const initialUserState: StoreState = {
      currentUser: user,
      currentDay: 1,
      relationships: INITIAL_RELATIONSHIPS,
      quests: activeQuests,
      history: [],
      points: 250, // 초기 가입 보너스
      streak: 0,
      lastActiveDate: '',
      rewards: INITIAL_REWARDS,
      equippedItems: [],
      equippedSkin: null,
    };

    localStorage.setItem(ACTIVE_SESSION_KEY, user.id);
    localStorage.setItem(`today_hello_state_${user.id}`, JSON.stringify(initialUserState));
    setState(initialUserState);
  };

  // 유저별 세이브 파일 로드 및 경과 일수 체크
  const loadUserState = (user: User) => {
    const savedState = localStorage.getItem(`today_hello_state_${user.id}`);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        
        // 가입일 기반 일차 계산
        const computedDay = calculateDayDiff(user.createdAt);
        const prevDay = parsed.currentDay || 1;

        let updatedState = {
          ...parsed,
          currentUser: user,
          currentDay: computedDay
        };

        // 날짜가 넘어갔을 때 (일차 경과) 초기화 메커니즘 트리거
        if (computedDay > prevDay) {
          updatedState = triggerNewDayTransition(updatedState, computedDay);
        }

        setState(updatedState);
      } catch (e) {
        console.error("Failed to load user state", e);
        setupInitialStateForUser(user);
      }
    } else {
      setupInitialStateForUser(user);
    }
  };

  // 새로운 일차 진입 시의 초기화 및 포인트 보상 지급 로직
  const triggerNewDayTransition = (prevState: StoreState, computedDay: number): StoreState => {
    // 1. 오늘의 퀘스트 완료 상태 리셋 및 신규 퀘스트 일괄 갱신
    // 미완료 퀘스트는 skipped/expired 상태로 두거나, 그냥 아예 새로운 관계들로 퀘스트를 다시 생성합니다.
    const activeRels = prevState.relationships;
    let newQuests = prevState.quests;

    if (activeRels.length > 0) {
      // 새로운 퀘스트 생성 (동기 형태로 mock 템플릿 사용 또는 aiEngine 임시 호출)
      // 비동기 처리가 필요하지만, UI 원활성을 위해 이전 퀘스트들을 pending으로 돌려놓거나
      // 혹은 static하게 매핑해 줍니다. 여기서는 간단히 기존 퀘스트들의 완료 여부 초기화 및 templateMessage 재사용/status 리셋 처리.
      newQuests = prevState.quests.map(q => ({
        ...q,
        status: 'pending',
        completedAt: null,
        emotion: null,
        actionType: null,
        id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 새 ID 부여
      }));
    }

    // 2. 일차 진입에 따른 보상 포인트 지급
    // 새로운 날 출석(기본 포인트) +50xp 적립
    const baseDailyReward = 50;

    return {
      ...prevState,
      currentDay: computedDay,
      quests: newQuests,
      points: prevState.points + baseDailyReward,
      // 날짜가 넘어갔으므로 마지막 활성화 날짜 리셋 혹은 갱신 가능성 열어두기
    };
  };

  // 데모를 위한 날짜 강제 경과 함수 (회원가입 createdAt을 하루 과거로 끎)
  const advanceDayForDemo = () => {
    if (!state.currentUser) return;
    
    const userList = getUsersFromStorage();
    const updatedUserList = userList.map(u => {
      if (u.id === state.currentUser?.id) {
        // createdAt을 24시간 이전으로 당김
        const prevCreatedAt = new Date(new Date(u.createdAt).getTime() - 24 * 60 * 60 * 1000).toISOString();
        return { ...u, createdAt: prevCreatedAt };
      }
      return u;
    });

    saveUsersToStorage(updatedUserList);

    // 현재 메모리 상태도 동기화
    const updatedUser: User = {
      ...state.currentUser,
      createdAt: new Date(new Date(state.currentUser.createdAt).getTime() - 24 * 60 * 60 * 1000).toISOString()
    };

    const nextDay = state.currentDay + 1;
    
    setState(prev => {
      const nextState = triggerNewDayTransition(prev, nextDay);
      return {
        ...nextState,
        currentUser: updatedUser,
        currentDay: nextDay
      };
    });
  };

  // 최초 로드 시 세션 확인
  useEffect(() => {
    const activeUserId = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (activeUserId) {
      const users = getUsersFromStorage();
      const activeUser = users.find(u => u.id === activeUserId);
      if (activeUser) {
        loadUserState({ id: activeUser.id, name: activeUser.name, createdAt: activeUser.createdAt });
      }
    }
    setIsLoaded(true);
  }, []);

  // 로그인 상태에서 상태 변경 시 로컬 스토리지에 유저 데이터 자동 백업
  useEffect(() => {
    if (isLoaded && state.currentUser) {
      localStorage.setItem(`today_hello_state_${state.currentUser.id}`, JSON.stringify(state));
    }
  }, [state, isLoaded]);

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

  // 관계 삭제
  const deleteRelationship = (id: string) => {
    setState(prev => ({
      ...prev,
      relationships: prev.relationships.filter(rel => rel.id !== id),
      quests: prev.quests.filter(q => q.relationshipId !== id)
    }));
  };

  // 퀘스트 완료 및 히스토리 기록 (편지 작성 내용 및 스킨 ID 반영)
  const completeQuest = (questId: string, actionType: 'template' | 'custom', emotion: EmotionType, letterContent?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setState(prev => {
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

      const updatedRelationships = prev.relationships.map(rel => 
        rel.id === targetQuest.relationshipId 
          ? { ...rel, lastContacted: new Date().toISOString() } 
          : rel
      );

      // 신규 히스토리 로그 생성 (편지 본문 및 스킨 적용 정보 저장)
      const newHistoryLog: HistoryLog = {
        id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        relationshipId: targetQuest.relationshipId,
        relationshipName: targetQuest.relationshipName,
        relationshipType: targetQuest.relationshipType,
        actionType,
        message: letterContent || (actionType === 'template' ? targetQuest.title : `${targetQuest.relationshipName}님께 직접 따뜻한 마음 전송`),
        timestamp: new Date().toISOString(),
        emotion,
        pointsEarned: 100,
        letterContent: letterContent,
        skinId: prev.equippedSkin,
      };

      let newStreak = prev.streak;
      if (prev.lastActiveDate !== todayStr) {
        if (prev.lastActiveDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]) {
          newStreak += 1;
        } else if (prev.lastActiveDate === '') {
          newStreak = 1;
        } else {
          newStreak = 1;
        }
      }

      let bonusPoints = 0;
      if (newStreak === 3 && prev.streak !== 3) {
        bonusPoints = 50;
      } else if (newStreak === 7 && prev.streak !== 7) {
        bonusPoints = 200;
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

  // 단일 퀘스트 수동 새로고침
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

  // 퀘스트 일괄 생성/갱신
  const generateNewQuests = async () => {
    const activeRels = [...state.relationships];
    if (activeRels.length === 0) return;

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

  // 상점 교환/구매
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

  // 코디 장착/해제 토글
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

  const addPoints = (amount: number) => {
    setState(prev => ({ ...prev, points: prev.points + amount }));
  };

  const resetAllData = () => {
    if (state.currentUser) {
      localStorage.removeItem(`today_hello_state_${state.currentUser.id}`);
      setupInitialStateForUser(state.currentUser);
    }
  };

  return (
    <AntigravityContext.Provider
      value={{
        state,
        signup,
        login,
        logout,
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
        equipSkin,
        advanceDayForDemo
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
