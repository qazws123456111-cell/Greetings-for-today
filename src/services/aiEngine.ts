import type { Relationship, RelationshipType, Quest } from '../types';

const TEMPLATES: Record<RelationshipType, { title: string; description: string; templateMessage: string }[]> = {
  family: [
    {
      title: "부모님께 따뜻한 안부 전화 드리기",
      description: "바쁜 하루 속 5분의 시간으로 부모님의 목소리를 들어보세요. 가장 큰 효도입니다.",
      templateMessage: "엄마, 아빠! 오늘 하루 잘 보내셨어요? 갑자기 생각나서 톡 남겨요. 밥은 챙겨 드셨죠? 항상 건강하세요! 사랑해요! ❤️"
    },
    {
      title: "가족 단체방에 기분 좋은 아침 인사 남기기",
      description: "단조로운 일상 속에 따뜻한 아침 인사 한마디로 가족들의 하루를 활기차게 열어보세요.",
      templateMessage: "가족 여러분, 활기찬 아침이에요! 오늘도 다들 건강하고 기분 좋은 하루 보내세요! 오늘 하루도 화이팅! ☀️"
    },
    {
      title: "추억이 담긴 옛날 사진 한 장 공유하기",
      description: "추억은 나눌수록 커집니다. 옛날 앨범 속 사진을 찍어 보내며 이야기를 시작해 보세요.",
      templateMessage: "이 사진 기억나세요? 옛날 사진 보다가 생각나서 보내요. 이때 진짜 재밌었는데! 조만간 다 같이 맛있는 거 먹으러 가요. 🥰"
    }
  ],
  friend: [
    {
      title: "오랜 친구에게 근황 묻는 메시지 보내기",
      description: "한동안 연락이 뜸했던 친구에게 가볍게 안부를 물으며 잊고 있던 우정을 깨워보세요.",
      templateMessage: "안녕! 요즘 어떻게 지내? 바빠서 통 연락을 못 했네. 별일 없지? 날씨 좋은데 조만간 밥 한번 먹자! 🍜"
    },
    {
      title: "재미있거나 유익한 소식 공유하기",
      description: "친구의 취향에 딱 맞을 만한 유머 짤, 영상, 혹은 맛집 정보를 보내며 웃음을 나누세요.",
      templateMessage: "야, 이거 보자마자 진짜 네 생각 나서 보낸다 ㅋㅋㅋ 완전 취향 저격이지? 오늘 하루도 화이팅하고 맛점해! 😆"
    },
    {
      title: "바쁜 친구를 응원하는 모바일 기프티콘 보내기",
      description: "지쳐있을 친구에게 소소한 음료 쿠폰 하나와 함께 진심 어린 응원을 보내보세요.",
      templateMessage: "오늘 날씨도 덥고 피곤할 텐데, 힘내라고 최애 커피 보낸다! 커피 한 잔 마시면서 힘차게 오후 보내! ☕✨"
    }
  ],
  lover: [
    {
      title: "퇴근길/하굣길 위로의 응원 남기기",
      description: "하루의 피로가 사르르 녹아내릴 수 있도록, 퇴근 무렵 따뜻한 사랑의 말 한마디를 전하세요.",
      templateMessage: "오늘 하루도 너무 고생 많았어 자기야. 집에 조심히 들어오고, 저녁 맛있는 거 꼭 챙겨 먹어! 빨리 보고 싶다. ❤️"
    },
    {
      title: "오늘 보았던 아름다운 풍경 사진 공유하기",
      description: "길을 걷다 마주한 예쁜 하늘, 핀 꽃, 혹은 감성 있는 풍경을 연인에게 나누며 감성을 공유하세요.",
      templateMessage: "오늘 가다 보니까 하늘이 너무 예쁘더라고. 보자마자 자기 생각나서 찍었어! 사진 보구 기분 좋은 하루 보내! 🥰📸"
    },
    {
      title: "새삼스럽고 고마운 내 마음 고백하기",
      description: "익숙함 속에 속아 소중함을 잃지 않도록, 평소에 전하지 못했던 감사의 마음을 손편지 쓰듯 적어보세요.",
      templateMessage: "새삼스럽지만 내 옆에 항상 든든하게 있어 줘서 정말 고마워. 말로는 다 못하지만 진심으로 사랑해. 이따 만나자! 😘💞"
    }
  ],
  acquaintance: [
    {
      title: "주말 뒤 월요일 아침, 정중한 안부 인사",
      description: "한 주의 시작, 다소 격조했던 지인에게 따뜻하고 정중하게 건강과 행운을 빌어주세요.",
      templateMessage: "안녕하세요! 주말은 편안하게 보내셨나요? 한 주의 시작인 월요일인데, 이번 주도 기분 좋은 일 가득하시길 바랍니다. 감기 조심하세요! 😊"
    },
    {
      title: "최근 축하할 일에 대해 기분 좋은 톡 나누기",
      description: "승진, 생일, 개업 등 소식을 들었다면 미루지 말고 따뜻한 축하 톡을 보내 관계의 불씨를 지피세요.",
      templateMessage: "안녕하세요! 최근 들은 반가운 소식 정말 축하드립니다. 역시 해내실 줄 알았어요! 바쁘시겠지만 늘 건강 유의하시고 조만간 뵙겠습니다. 👍"
    },
    {
      title: "계절과 날씨 변화에 맞춘 건강 리마인드 안부",
      description: "환절기나 혹한, 혹서기에 지인의 건강을 염려하는 다정한 안부로 세심한 배려를 보여주세요.",
      templateMessage: "안녕하세요! 요즘 일교차가 무척 심한데 감기 걸리지 않고 건강히 잘 지내시죠? 늘 챙겨주셔서 감사하고, 오늘 하루도 따뜻하고 활기차게 보내세요! 🍀"
    }
  ]
};

/**
 * 관계 데이터를 분석하여 맞춤 퀘스트를 동적으로 생성합니다.
 * 실제 AI 연동을 위해 비동기(Promise) 스트림으로 작동하도록 설계되었습니다.
 */
export const generateQuestForRelationship = async (relationship: Relationship): Promise<Quest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const templates = TEMPLATES[relationship.type] || TEMPLATES.acquaintance;
      // 무작위로 하나의 템플릿 선택
      const randomIndex = Math.floor(Math.random() * templates.length);
      const chosen = templates[randomIndex];

      const quest: Quest = {
        id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        relationshipId: relationship.id,
        relationshipName: relationship.name,
        relationshipType: relationship.type,
        title: chosen.title,
        description: chosen.description,
        templateMessage: chosen.templateMessage,
        status: 'pending',
        createdAt: new Date().toISOString(),
        completedAt: null,
        emotion: null,
        actionType: null
      };

      resolve(quest);
    }, 400); // AI 분석 딜레이 연출
  });
};

/**
 * 초기 Mock 관계 데이터에 대한 최초 퀘스트 리스트를 동적으로 생성합니다.
 */
export const generateInitialQuests = async (relationships: Relationship[]): Promise<Quest[]> => {
  const activeQuests = await Promise.all(
    relationships.slice(0, 3).map(rel => generateQuestForRelationship(rel))
  );
  return activeQuests;
};
