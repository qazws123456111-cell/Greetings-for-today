import type { Relationship, RelationshipType, Quest, ContactPurpose, LastMeetPeriod } from '../types';

// ─────────────────────────────────────────────
// 풍부한 안부 문구 라이브러리 (관계 유형별 10개+)
// ─────────────────────────────────────────────
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
    },
    {
      title: "건강 걱정이 담긴 진심 안부 보내기",
      description: "환절기나 날씨 변화에 가족 건강을 먼저 챙기는 따뜻한 메시지를 보내보세요.",
      templateMessage: "요즘 날씨가 많이 변덕스럽더라고요. 감기 걸리지 않게 조심하시고, 따뜻하게 입고 다니세요! 건강이 최고예요. 항상 사랑합니다 💛"
    },
    {
      title: "주말 나들이 계획 함께 세우기",
      description: "바쁜 평일을 이겨내고 가족과 함께하는 소소한 주말 계획을 이야기해 보세요.",
      templateMessage: "이번 주말에 뭐 해요? 오랜만에 다 같이 모여서 맛있는 거 먹으러 가면 어떨까요? 어디 좋은 데 있으면 알려줘요! 😊"
    },
    {
      title: "소중한 가족에게 감사 편지 남기기",
      description: "평소 말로 표현하기 어려웠던 감사함을 솔직하게 적어 전하세요.",
      templateMessage: "항상 든든하게 곁에 있어줘서 정말 고마워요. 말로는 잘 못 표현하는데, 당신 덕분에 많은 힘을 얻고 있어요. 앞으로도 잘 부탁드려요 💌"
    },
    {
      title: "생일/기념일 미리 축하 메시지 보내기",
      description: "소중한 날을 미리 기억하고 챙겨주는 것만으로도 큰 사랑의 표현이 됩니다.",
      templateMessage: "곧 특별한 날이 다가오네요! 미리 축하드려요 🎂 건강하고 행복한 하루가 되길 바라며, 늘 사랑합니다. 특별한 날에 맛있는 거 먹어요!"
    },
    {
      title: "응원과 위로를 담은 짧은 한 마디",
      description: "힘들어 보이는 가족에게 잠깐의 위로와 응원을 전해보세요.",
      templateMessage: "요즘 많이 힘들죠? 그래도 잘 하고 있어요, 진짜로. 조금만 더 힘내고, 뭔가 필요한 게 있으면 언제든지 말해요. 내가 있잖아요! 🤗"
    },
    {
      title: "같이 보고 싶은 영화/콘텐츠 추천하기",
      description: "가족과 공통 취미를 나누며 대화의 물꼬를 트는 좋은 방법입니다.",
      templateMessage: "저 요즘 이 드라마 보고 있는데 너무 재밌어요! 같이 봐요. 다음 주에 시간 맞춰서 같이 보면서 야식 먹어요 🍿 완전 기대됩니다!"
    },
    {
      title: "계절 변화에 맞춰 따뜻한 선물 전하기",
      description: "계절마다 작은 선물로 마음을 전하면 더욱 특별한 추억이 됩니다.",
      templateMessage: "날이 많이 따뜻해졌네요. 생각나서 작은 거 하나 보내려고요. 마음에 들었으면 좋겠어요! 항상 건강하고 행복하세요 🌸"
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
    },
    {
      title: "오늘 있었던 웃긴 에피소드 공유하기",
      description: "일상 속 소소한 웃음거리를 친구와 나누며 친밀감을 높여보세요.",
      templateMessage: "야 나 오늘 진짜 웃긴 일 있었어 ㅋㅋㅋ 들어봐봐! 나중에 통화해서 얘기하자. 근데 요즘 어떻게 지내고 있어? 보고싶다 진짜로 😂"
    },
    {
      title: "좋아하는 맛집/플레이스 추천해주기",
      description: "요즘 핫한 맛집이나 카페를 친구에게 소개하며 같이 가자고 제안해보세요.",
      templateMessage: "나 얼마 전에 진짜 맛있는 곳 발견했어! 우리 이번 주말에 같이 가자! 네가 분명히 좋아할 것 같아서. 스케줄 확인하고 연락줘! 🍽️"
    },
    {
      title: "힘든 시기를 보내는 친구에게 위로 전하기",
      description: "말없이 힘든 친구에게 곁에 있다는 것을 느끼게 해주세요.",
      templateMessage: "요즘 많이 힘들지? 아무 말 없어도 알아. 뭔가 하고 싶거나 먹고 싶은 거 있으면 말해, 내가 맞춰줄게. 항상 내가 네 편이야 💙"
    },
    {
      title: "공통 추억 소환하며 그때를 회상하기",
      description: "함께 했던 특별한 순간을 꺼내며 우정의 빛을 다시 밝혀보세요.",
      templateMessage: "갑자기 우리 그때 ○○갔던 거 생각난다 ㅋㅋ 진짜 그때 얼마나 웃었는지. 우리 언제 또 그런 거 하자! 요즘 너무 각자 바쁘게 살고 있어 😅"
    },
    {
      title: "서로의 요즘 관심사 나누기",
      description: "최근 관심 갖게 된 취미나 활동을 서로 공유하며 새로운 대화를 시작해보세요.",
      templateMessage: "야 나 요즘 이거에 빠졌어! 너는 요즘 뭔가 새로 시작한 거 있어? 한번 같이 해봐도 재밌을 것 같은데. 연락 자주 하자 진짜로 👋"
    },
    {
      title: "생일 미리 챙겨주기 (D-7 이내)",
      description: "친구의 생일을 미리 챙겨주면 더욱 특별하고 감동적인 추억이 됩니다.",
      templateMessage: "생일 축하해!! 🎉 올해도 더 행복하고 건강한 한 해 되길! 보고 싶은데 조만간 꼭 만나자. 작은 선물 준비해놨어, 보여줄게! 🎁"
    },
    {
      title: "밤에 갑자기 생각나서 보내는 안부",
      description: "문득 떠오른 친구에게 솔직하게 생각났다고 전해보세요. 소소하지만 진심입니다.",
      templateMessage: "갑자기 생각나서 ㅋㅋ 별 이유 없어, 그냥 네 생각 나서. 잘 지내고 있지? 요즘 바쁘겠지만 건강 챙겨! 언제 한번 보자 진짜 🌙"
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
    },
    {
      title: "오늘 아침 사랑스러운 굿모닝 메시지",
      description: "하루의 시작을 사랑하는 사람의 따뜻한 메시지로 열어주세요.",
      templateMessage: "좋은 아침 자기야! 🌅 오늘도 예쁜 하루 보내! 밥 꼭 챙겨 먹고, 오늘 하루도 빛나게 잘 보내! 사랑해 💕"
    },
    {
      title: "보고 싶다는 솔직한 감정 전하기",
      description: "말하기 쑥스러운 감정도 문자로 용기내어 표현해보세요.",
      templateMessage: "갑자기 너무 보고 싶어진다. 오늘 저녁에 시간 돼? 맛있는 거 먹으러 가고 싶어. 아니면 그냥 잠깐이라도 보자! 😊"
    },
    {
      title: "함께 가고 싶은 여행지/장소 공유하기",
      description: "함께 가고 싶은 곳을 공유하며 미래 데이트를 설레게 계획해보세요.",
      templateMessage: "나 이 카페 발견했는데 우리 꼭 같이 가야 해! 분위기가 완전 우리 취향이야. 다음에 데이트할 때 여기 가자! 💑"
    },
    {
      title: "힘든 하루에 당신을 응원하는 메시지",
      description: "상대방이 힘든 날을 보내고 있을 때 가장 따뜻한 위로자가 되어주세요.",
      templateMessage: "오늘 힘들었지? 다 알아. 그래도 너는 최선을 다하고 있어, 그걸로 충분해. 오늘 밤은 그냥 편하게 쉬어. 내가 옆에 있을게 💆‍♀️"
    },
    {
      title: "오늘 있었던 소소한 일상 나누기",
      description: "특별한 일이 없어도 일상을 나누는 것이 친밀감을 키우는 가장 좋은 방법입니다.",
      templateMessage: "자기야 나 오늘 점심에 엄청 맛있는 거 먹었어! 너한테 보여주려고 사진 찍었는데 ㅋㅋ 이따 퇴근하면 얘기 들어줘! 오늘도 사랑해 🍱"
    },
    {
      title: "기념일/특별한 날 D-7 설레는 카운트다운",
      description: "중요한 날을 미리부터 함께 기대하며 설레는 감정을 나눠보세요.",
      templateMessage: "우리 기념일이 벌써 일주일 밖에 안 남았다! 🎉 특별한 하루 만들어줄게, 기대해도 돼. 미리미리 설레고 있는 나만의 특별한 날 🥳"
    },
    {
      title: "밤 인사와 함께 꿈나라 안부 전하기",
      description: "잠들기 전 따뜻한 밤 인사로 하루를 사랑스럽게 마무리해보세요.",
      templateMessage: "잘 자기야 🌙 오늘도 하루 수고 많았어. 좋은 꿈 꿔! 내일 아침에 또 연락할게. 자도 자도 보고 싶어, 사랑해 💤💕"
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
    },
    {
      title: "오랜만에 정중히 안부 여쭈기",
      description: "오랫동안 연락이 없었던 지인에게 먼저 예의 바르게 인사를 건네보세요.",
      templateMessage: "안녕하세요, 오랜만에 연락드립니다! 그간 잘 지내셨죠? 갑자기 생각이 나서 안부 인사 드리고 싶었어요. 요즘도 건강하고 행복하게 지내고 계시죠? 😊"
    },
    {
      title: "유용한 정보나 좋은 기사 공유하기",
      description: "상대방에게 도움이 될 만한 정보나 흥미로운 소식을 공유하며 자연스럽게 연락해보세요.",
      templateMessage: "안녕하세요! 최근에 읽은 글인데 혹시 도움이 되실까 해서 공유드립니다. 바쁘신 와중에도 유익한 정보가 되길 바라며, 건강하게 잘 지내시길 바랍니다! 📰"
    },
    {
      title: "명절/연말 인사 드리기",
      description: "특별한 시즌에 먼저 따뜻한 인사를 건네는 것은 관계를 이어가는 좋은 기회입니다.",
      templateMessage: "안녕하세요! 좋은 계절을 맞이하여 간단하게나마 안부 인사 드립니다. 가족분들과 행복한 시간 보내시고, 늘 건강하시길 진심으로 바랍니다. 🌟"
    },
    {
      title: "감사 인사 늦지 않게 전하기",
      description: "받은 도움이나 배려에 대해 늦지 않게 감사함을 표현해보세요.",
      templateMessage: "안녕하세요! 저번에 도와주신 덕분에 정말 많은 도움이 되었습니다. 감사한 마음을 꼭 전하고 싶었어요. 언제 기회가 되면 꼭 식사 한 번 대접하고 싶습니다 😊"
    },
    {
      title: "업무 협력 후 마무리 인사 남기기",
      description: "함께 프로젝트를 마친 후 마무리 인사를 나누며 좋은 인상을 남기세요.",
      templateMessage: "안녕하세요! 이번에 함께 작업하면서 정말 많이 배웠습니다. 덕분에 좋은 결과를 낼 수 있었어요. 앞으로도 좋은 인연으로 함께하길 바랍니다! 🤝"
    },
    {
      title: "근처 지나다가 생각나서 보내는 안부",
      description: "특별한 이유 없이 먼저 연락하는 것이 때로는 가장 진심 어린 표현입니다.",
      templateMessage: "안녕하세요! 오늘 근처를 지나다가 갑자기 생각이 나서 안부 전합니다. 바쁘시더라도 건강 꼭 챙기시고, 언제 한번 뵙게 되길 기대합니다! 😊"
    },
    {
      title: "새해/새 출발을 응원하는 인사",
      description: "새로운 시작을 앞둔 지인에게 진심 어린 응원과 격려를 보내보세요.",
      templateMessage: "안녕하세요! 새로운 시작을 앞두신 것 같던데, 진심으로 응원합니다. 새로운 환경에서도 잘 하실 거라 믿어요. 좋은 소식 기다리겠습니다! 🌱"
    }
  ]
};

// ─────────────────────────────────────────────
// 친밀도별 추가 컨텍스트 (closeness 1-5 기반)
// ─────────────────────────────────────────────
const getClosenessContext = (closeness: number): string => {
  if (closeness >= 5) return '매우 가까운 사이로, 솔직하고 애정 넘치는 말투를 사용해 주세요.';
  if (closeness >= 4) return '꽤 가까운 사이로, 친근하고 편안한 말투로 전해 주세요.';
  if (closeness >= 3) return '보통 친밀도로, 따뜻하지만 적절히 예의 있는 말투가 좋습니다.';
  if (closeness >= 2) return '조금 서먹한 사이로, 정중하면서도 살짝 따뜻한 표현을 써주세요.';
  return '아직 가까워지는 중인 사이로, 예의 바르고 부담 없는 가벼운 안부를 건네주세요.';
};

// ─────────────────────────────────────────────
// 연락 목적별 추가 문구 힌트
// ─────────────────────────────────────────────
const getPurposeHint = (purpose: ContactPurpose | undefined): string => {
  switch (purpose) {
    case 'cheer': return '상대방을 응원하고 격려하는 메시지를 강조해 주세요.';
    case 'memory': return '함께한 추억이나 옛날 이야기를 소환하는 맥락을 넣어주세요.';
    case 'business': return '비즈니스/협업 맥락을 존중하며 정중하고 프로페셔널하게 표현해주세요.';
    default: return '자연스럽고 일상적인 안부를 전해주세요.';
  }
};

// ─────────────────────────────────────────────
// 최근 만난 시점별 문구 조정
// ─────────────────────────────────────────────
const getMeetPeriodNote = (period: LastMeetPeriod | undefined): string => {
  switch (period) {
    case 'within_week': return '최근에 만났으니 그때 이야기를 이어가거나 짧은 안부로도 충분합니다.';
    case 'within_month': return '한 달 안에 만난 사이이니, 자연스럽게 근황을 물어보세요.';
    case 'within_3months': return '몇 달 만의 연락이니, 오랜만이라는 표현을 살짝 넣어도 좋습니다.';
    case 'over_6months': return '오랫동안 못 만난 사이입니다. 많이 보고 싶었다는 감정을 담아주세요.';
    default: return '';
  }
};

/**
 * 관계 데이터를 분석하여 맞춤 퀘스트를 동적으로 생성합니다.
 * 친밀도(closeness), 연락 목적(contactPurpose), 최근 만남(lastMeetPeriod)을 반영합니다.
 */
export const generateQuestForRelationship = async (relationship: Relationship): Promise<Quest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const templates = TEMPLATES[relationship.type] || TEMPLATES.acquaintance;

      // 겹침 방지: 최근 completedAt 기준으로 마지막에 사용된 인덱스와 다른 것 선택
      // 단순히 현재 시간 기반 seed를 사용하여 랜덤성 확보
      const seed = (Date.now() + Math.floor(Math.random() * 1000)) % templates.length;
      const chosen = templates[seed];

      // 친밀도/목적/만남 기반 컨텍스트 반영
      const closenessCtx = getClosenessContext(relationship.closeness);
      const purposeHint = getPurposeHint(relationship.contactPurpose);
      const meetNote = getMeetPeriodNote(relationship.lastMeetPeriod);
      const aiGuide = `\n(AI 가이드: ${closenessCtx} ${purposeHint} ${meetNote ? ' ' + meetNote : ''})`;

      // 친밀도에 따라 더 적합한 템플릿 선택 (고친밀도 → 더 개인적인 템플릿 우선)
      let finalTemplate = chosen;
      if (relationship.closeness >= 4 && templates.length >= 6) {
        // 친밀도가 높으면 더 감성적인 뒤쪽 템플릿 우선 선택
        const highClosenessIdx = (seed + Math.floor(templates.length / 2)) % templates.length;
        finalTemplate = templates[highClosenessIdx];
      } else if (relationship.closeness <= 2) {
        // 친밀도가 낮으면 격식체 앞쪽 템플릿 선택
        const lowClosenessIdx = seed % Math.min(4, templates.length);
        finalTemplate = templates[lowClosenessIdx];
      }

      // 연락 목적이 응원(cheer)이면 응원 관련 템플릿 우선
      if (relationship.contactPurpose === 'cheer') {
        const cheerTemplates = templates.filter(t =>
          t.title.includes('응원') || t.title.includes('위로') || t.title.includes('힘')
        );
        if (cheerTemplates.length > 0) {
          finalTemplate = cheerTemplates[Math.floor(Math.random() * cheerTemplates.length)];
        }
      }

      // 연락 목적이 추억(memory)이면 추억 관련 템플릿 우선
      if (relationship.contactPurpose === 'memory') {
        const memoryTemplates = templates.filter(t =>
          t.title.includes('추억') || t.title.includes('옛날') || t.title.includes('사진')
        );
        if (memoryTemplates.length > 0) {
          finalTemplate = memoryTemplates[Math.floor(Math.random() * memoryTemplates.length)];
        }
      }

      // 오래 못 만난 경우 보고싶다 관련 강조
      if (relationship.lastMeetPeriod === 'over_6months') {
        const longMissTemplates = templates.filter(t =>
          t.title.includes('오랜만') || t.title.includes('보고 싶') || t.templateMessage.includes('오랜만')
        );
        if (longMissTemplates.length > 0) {
          finalTemplate = longMissTemplates[Math.floor(Math.random() * longMissTemplates.length)];
        }
      }

      const quest: Quest = {
        id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        relationshipId: relationship.id,
        relationshipName: relationship.name,
        relationshipType: relationship.type,
        title: finalTemplate.title,
        description: finalTemplate.description + aiGuide,
        templateMessage: finalTemplate.templateMessage,
        status: 'pending',
        createdAt: new Date().toISOString(),
        completedAt: null,
        emotion: null,
        actionType: null
      };

      resolve(quest);
    }, 300); // AI 분석 딜레이 연출
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
