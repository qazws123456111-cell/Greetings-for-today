import { useState, useEffect } from 'react';
import { AntigravityProvider, useAntigravity } from './store/AntigravityStore';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Relationship } from './components/Relationship';
import { History } from './components/History';
import { Store } from './components/Store';
import { FeedbackModal } from './components/FeedbackModal';
import { Confetti } from './components/Confetti';
import { Auth } from './components/Auth';
import { MyPage } from './components/MyPage';
import { LetterEditor } from './components/LetterEditor';
import type { Quest, EmotionType } from './types';
import { Send, MessageCircle, X } from 'lucide-react';
import './styles/main.css';
import './styles/components.css';

function MainApp() {
  const { completeQuest, state } = useAntigravity();
  const [activeTab, setActiveTab] = useState<'home' | 'relationships' | 'history' | 'shop' | 'mypage'>('home');
  
  // 퀘스트 완료 관련 상태
  const [activeQuestAction, setActiveQuestAction] = useState<{ quest: Quest; actionType: 'template' | 'custom' } | null>(null);
  
  // 가상 메신저 시뮬레이터 팝업 상태
  const [showMessengerMock, setShowMessengerMock] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  
  // 마음의 온도 기록 피드백 모달 상태
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [targetFeedbackQuest, setTargetFeedbackQuest] = useState<Quest | null>(null);
  const [feedbackActionType, setFeedbackActionType] = useState<'template' | 'custom'>('template');

  // 하트 폭죽 애니메이션 트리거
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  // 스킨 적용 편지 쓰기 상태
  const [showLetterEditor, setShowLetterEditor] = useState(false);
  const [writingLetterSkin, setWritingLetterSkin] = useState<string | null>(null);

  // 연락하기 버튼 클릭 시 가상 메신저 팝업 트리거
  const handleStartQuestAction = (quest: Quest, actionType: 'template' | 'custom') => {
    setActiveQuestAction({ quest, actionType });
    setFeedbackActionType(actionType);
    setTargetFeedbackQuest(quest);
    
    // 추천 템플릿 복사인 경우 미리 세팅, 직접 연락인 경우 공란
    setCustomMessage(actionType === 'template' ? quest.templateMessage : '');
    
    // 가상 메신저 시뮬레이터 오픈!
    setShowMessengerMock(true);
  };

  // 가상 메신저에서 메시지 '발송' 버튼을 클릭한 경우
  const handleSendMessageMock = () => {
    setShowMessengerMock(false);
    
    // 실제 모바일 앱의 '포커스 아웃 후 복귀' 느낌을 살리기 위해, 
    // 발송 직후 0.6초 뒤에 부드럽게 감정 기록 피드백 팝업이 뜨도록 시뮬레이션합니다.
    setTimeout(() => {
      setShowFeedbackModal(true);
    }, 600);
  };

  // 사용자가 외부 메신저에 직접 다녀오는 포커스 복귀 이벤트 감지 (신뢰 기반 감지 시스템)
  useEffect(() => {
    const handleWindowFocus = () => {
      // 만약 메신저 팝업이 열려 있는 상태에서 브라우저 탭을 나갔다 돌아오면 
      // 다녀왔음을 자동 인지하여 메신저를 닫고 즉시 감정 피드백 모달로 안내합니다!
      if (showMessengerMock) {
        setShowMessengerMock(false);
        setTimeout(() => {
          setShowFeedbackModal(true);
        }, 500);
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [showMessengerMock]);

  // 감정 이모지 선택 완료 시 최종 보상 수여 및 타임라인 등록
  const handleSelectEmotion = (emotion: EmotionType) => {
    if (!targetFeedbackQuest) return;

    // 스토어 완료 로직 실행 (+100xp 적립)
    completeQuest(targetFeedbackQuest.id, feedbackActionType, emotion);
    
    // 피드백 모달 닫기
    setShowFeedbackModal(false);
    setActiveQuestAction(null);
    setTargetFeedbackQuest(null);

    // 축하 하트 폭죽 폭발! 🎉
    setConfettiTrigger(true);
    setTimeout(() => {
      setConfettiTrigger(false);
    }, 2000); // 2초 후 캔버스 리셋
  };

  // 1. 로그인 여부 가로채기
  if (!state.currentUser) {
    return <Auth />;
  }

  // 2. 스킨 적용 안부 편지 에디터 모드
  if (showLetterEditor) {
    return (
      <div className="simulator-container">
        <div className="simulator-notch" />
        <div className="app-viewport" style={{ display: 'flex', flexDirection: 'column' }}>
          <LetterEditor
            initialSkinId={writingLetterSkin}
            onClose={() => setShowLetterEditor(false)}
            onLetterSent={() => {
              setActiveTab('history');
              setConfettiTrigger(true);
              setTimeout(() => {
                setConfettiTrigger(false);
              }, 2000);
            }}
          />
        </div>
        <div className="simulator-home-bar" />
      </div>
    );
  }


  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* 탭 뷰 렌더링 */}
      {activeTab === 'home' && (
        <Dashboard onStartQuestAction={handleStartQuestAction} />
      )}
      {activeTab === 'relationships' && (
        <Relationship />
      )}
      {activeTab === 'history' && (
        <History />
      )}
      {activeTab === 'shop' && (
        <Store />
      )}
      {activeTab === 'mypage' && (
        <MyPage onWriteLetterWithSkin={(skinId) => {
          setWritingLetterSkin(skinId);
          setShowLetterEditor(true);
        }} />
      )}

      {/* 캔버스 폭죽 효과 오버레이 */}
      <Confetti trigger={confettiTrigger} />

      {/* 1. 가상 메신저(카카오톡 스타일) 시뮬레이터 팝업 */}
      {showMessengerMock && activeQuestAction && (
        <div className="modal-overlay" style={{ zIndex: 999 }}>
          <div 
            className="modal-content"
            style={{
              maxWidth: '350px',
              width: '90%',
              margin: 'auto',
              borderRadius: '24px',
              background: '#FDE500', // 카카오 노랑 컬러 매칭
              padding: '0',
              overflow: 'hidden',
              boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
            }}
          >
            {/* 메신저 헤더 */}
            <div 
              style={{
                backgroundColor: '#3C2E2A',
                color: 'white',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageCircle size={18} fill="#FDE500" stroke="none" />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>
                  {`${activeQuestAction.quest.relationshipName}님께 안부 나누기`}
                </span>
              </div>
              <button 
                onClick={() => setShowMessengerMock(false)}
                style={{ color: '#AFA6A1' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* 메신저 바디 */}
            <div 
              style={{
                height: '240px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                overflowY: 'auto',
                position: 'relative',
                transition: 'background 0.3s ease',
                // 스킨별 테마 스타일 적용
                ...(state.equippedSkin === 'skin-night' ? {
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
                  color: '#E5E7EB'
                } : state.equippedSkin === 'skin-cherry' ? {
                  background: 'linear-gradient(135deg, #FFF0F2 0%, #FFE3E8 100%)',
                  color: '#3E3835'
                } : state.equippedSkin === 'skin-sunset' ? {
                  background: 'linear-gradient(135deg, #FED7AA 0%, #FECDD3 100%)',
                  color: '#3E3835'
                } : {
                  backgroundColor: '#B2C7DA',
                  color: '#3E3835'
                })
              }}
            >
              {/* 스킨별 장식 레이어 */}
              {state.equippedSkin === 'skin-night' && (
                <div style={{ position: 'absolute', top: 12, left: 12, right: 12, pointerEvents: 'none', opacity: 0.3, fontSize: '9px', letterSpacing: '4px', textAlign: 'center', color: '#FFF' }}>
                  🌌 ✦ 🌟 ✦ 🌌 ✦ 🌟
                </div>
              )}
              {state.equippedSkin === 'skin-cherry' && (
                <div style={{ position: 'absolute', top: 12, left: 12, right: 12, pointerEvents: 'none', opacity: 0.4, fontSize: '9px', letterSpacing: '4px', textAlign: 'center', color: '#FFA5A5' }}>
                  🌸 ❀ 🌸 ❀ 🌸 ❀ 🌸
                </div>
              )}
              {state.equippedSkin === 'skin-sunset' && (
                <div style={{ position: 'absolute', top: 12, left: 12, right: 12, pointerEvents: 'none', opacity: 0.3, fontSize: '9px', letterSpacing: '4px', textAlign: 'center', color: '#D97706' }}>
                  🌇 🌅 🌇 🌅 🌇 🌅 🌇
                </div>
              )}

              {/* 말풍선 가상 노출 */}
              <div 
                style={{
                  alignSelf: 'flex-end',
                  backgroundColor: '#FDE500',
                  color: '#3C2E2A',
                  padding: '10px 12px',
                  borderRadius: '14px 0 14px 14px',
                  fontSize: '11px',
                  lineHeight: '1.5',
                  maxWidth: '85%',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                  wordBreak: 'break-all',
                  zIndex: 1
                }}
              >
                {customMessage || "따뜻한 안부 내용을 직접 적어 전송해 보세요! 😊"}
              </div>
              
              <div style={{ textAlign: 'right', fontSize: '8px', color: state.equippedSkin === 'skin-night' ? '#AFA6A1' : '#778899', marginTop: '2px', marginRight: '4px', zIndex: 1 }}>
                방금 발송 대기 • 읽지않음 1
              </div>
            </div>

            {/* 메신저 입력창 & 컨트롤 */}
            <div 
              style={{
                backgroundColor: 'white',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <textarea
                style={{
                  width: '100%',
                  height: '56px',
                  border: '1px solid #E5DDD7',
                  borderRadius: '12px',
                  padding: '8px 10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-family)',
                  resize: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)'
                }}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={
                  activeQuestAction.actionType === 'custom'
                    ? "본인만의 진심 어린 말투로 따뜻한 마음을 입력해 보세요..."
                    : "추천 문구가 자동 입력되었습니다. 다듬어서 전송하셔도 좋아요..."
                }
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                  {activeQuestAction.actionType === 'template' ? '✨ AI 템플릿' : '✍️ 직접 입력'}
                  {state.equippedSkin && ' • 🎨 스킨 적용됨'}
                </span>
                
                <button
                  onClick={handleSendMessageMock}
                  style={{
                    backgroundColor: '#3C2E2A',
                    color: '#FDE500',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Send size={11} fill="#FDE500" stroke="none" />
                  전송 및 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 감정 기록 피드백 모달 */}
      {showFeedbackModal && targetFeedbackQuest && (
        <FeedbackModal
          quest={targetFeedbackQuest}
          onSelectEmotion={handleSelectEmotion}
          onClose={() => {
            setShowFeedbackModal(false);
            setActiveQuestAction(null);
            setTargetFeedbackQuest(null);
          }}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <AntigravityProvider>
      <MainApp />
    </AntigravityProvider>
  );
}
