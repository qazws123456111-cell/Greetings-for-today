import React, { useState } from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import { Send, ArrowLeft, Share2 } from 'lucide-react';
import type { EmotionType } from '../types';

interface LetterEditorProps {
  initialSkinId: string | null;
  onClose: () => void;
  onLetterSent: () => void;
}

export const LetterEditor: React.FC<LetterEditorProps> = ({ initialSkinId, onClose, onLetterSent }) => {
  const { state, completeQuest, addPoints } = useAntigravity();
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string>(
    state.relationships[0]?.id || ''
  );
  
  // 감정 선택 상태 (편지 보내기 전 감정 체크)
  const [showEmotionSelect, setShowEmotionSelect] = useState(false);
  
  const [letterText, setLetterText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const relationship = state.relationships.find(r => r.id === selectedRelationshipId);

  // 스킨 테마 스타일 정의
  const getSkinStyle = () => {
    switch (initialSkinId) {
      case 'skin-night':
        return {
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
          color: '#F8FAFC',
          borderColor: '#38BDF8',
          bubbleBg: 'rgba(255, 255, 255, 0.1)',
          inputBg: 'rgba(15, 23, 42, 0.6)',
          inputText: '#F8FAFC',
          badges: '🌌 별이 빛나는 밤',
          decor: '✦ 🌟 ✦ 🌌 ✦ 🌟'
        };
      case 'skin-cherry':
        return {
          background: 'linear-gradient(135deg, #FFF0F2 0%, #FFE3E8 100%)',
          color: '#4C1D24',
          borderColor: '#FB7185',
          bubbleBg: 'rgba(255, 255, 255, 0.5)',
          inputBg: 'rgba(255, 240, 242, 0.6)',
          inputText: '#4C1D24',
          badges: '🌸 벚꽃 가득 봄날',
          decor: '❀ 🌸 ❀ 🌸 ❀ 🌸'
        };
      case 'skin-sunset':
        return {
          background: 'linear-gradient(135deg, #FED7AA 0%, #FECDD3 100%)',
          color: '#7C2D12',
          borderColor: '#F97316',
          bubbleBg: 'rgba(255, 255, 255, 0.5)',
          inputBg: 'rgba(254, 215, 170, 0.6)',
          inputText: '#7C2D12',
          badges: '🌇 노을빛 하늘',
          decor: '🌇 🌅 🌇 🌅 🌇'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
          color: '#0369A1',
          borderColor: '#38BDF8',
          bubbleBg: 'rgba(255, 255, 255, 0.6)',
          inputBg: 'rgba(255, 255, 255, 0.7)',
          inputText: '#0F172A',
          badges: '☁️ 기본 하늘 스킨',
          decor: '☁️ 🎈 ☁️ 🎈 ☁️'
        };
    }
  };

  const theme = getSkinStyle();

  // 편지 임시 발송 처리 (감정 선택 단계로 진입)
  const handlePreSend = () => {
    if (!selectedRelationshipId) {
      showToast('⚠️ 안부를 전할 분을 선택해 주세요.');
      return;
    }
    if (letterText.trim().length < 5) {
      showToast('⚠️ 진심을 담아 최소 5자 이상 적어주세요.');
      return;
    }
    setShowEmotionSelect(true);
  };

  // 감정 선택 완료 후 최종 저장 및 Mock 공유
  const handleFinalSend = (emotion: EmotionType) => {
    if (!relationship) return;

    // 히스토리에 완료 내역을 직접 추가하기 위해 completeQuest를 변형/연결합니다.
    // 임의의 퀘스트 ID를 대신 생성하거나, 해당 관계에 pending된 퀘스트가 있는지 찾아 매핑해 줍니다.
    const matchingQuest = state.quests.find(
      q => q.relationshipId === relationship.id && q.status === 'pending'
    );

    const targetQuestId = matchingQuest 
      ? matchingQuest.id 
      : `q-temp-${Date.now()}`;

    // AntigravityStore의 completeQuest를 호출하여 히스토리 추가, 포인트 지급, 스트릭 갱신 처리
    completeQuest(targetQuestId, 'custom', emotion, letterText);
    
    // 추가 포인트 지급 (직접 쓴 편지 정성 보너스 +50xp)
    addPoints(50);

    setShowEmotionSelect(false);
    setShowShareModal(true);
  };

  // 가상 공유 팝업 닫고 마무리
  const handleCloseShare = () => {
    setShowShareModal(false);
    onLetterSent(); // 상위 탭/화면 전환
    onClose();
  };

  return (
    <div className="letter-editor-view" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-cozy)',
      fontFamily: 'var(--font-family)',
      overflowY: 'auto'
    }}>
      
      {/* 1. 상단 바 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        borderBottom: '1px solid #EAE5E2',
        backgroundColor: 'var(--bg-card)'
      }}>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}>
          <ArrowLeft size={20} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
          안부 편지 보내기
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '9px',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary-dark)',
          padding: '4px 8px',
          borderRadius: '12px',
          fontWeight: 700
        }}>
          {theme.badges}
        </span>
      </div>

      {/* 2. 작성 바디 */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        
        {/* 수신인 선택 */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            받는 사람 선택
          </label>
          <select
            value={selectedRelationshipId}
            onChange={(e) => setSelectedRelationshipId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #E5E0DB',
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: 'white',
              outline: 'none',
              fontFamily: 'var(--font-family)'
            }}
          >
            {state.relationships.map((rel) => (
              <option key={rel.id} value={rel.id}>
                {rel.name} ({rel.type === 'family' ? '가족' : rel.type === 'friend' ? '친구' : rel.type === 'lover' ? '연인' : '지인'})
              </option>
            ))}
          </select>
        </div>

        {/* 편지지 카드 영역 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg)',
          background: theme.background,
          border: `2px solid ${theme.borderColor}`,
          padding: '20px',
          boxShadow: 'var(--shadow-cozy)',
          minHeight: '260px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 하늘 구름/별빛 데코 장식 */}
          <div style={{
            textAlign: 'center',
            fontSize: '10px',
            opacity: 0.5,
            letterSpacing: '6px',
            color: theme.color,
            marginBottom: '10px',
            pointerEvents: 'none'
          }}>
            {theme.decor}
          </div>

          <div style={{
            fontSize: '13px',
            fontWeight: 800,
            color: theme.color,
            marginBottom: '8px'
          }}>
            To. {relationship ? relationship.name : '소중한 분'} 에게
          </div>

          {/* 편지 내용 입력 영역 */}
          <textarea
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
            placeholder="이곳에 전하고 싶은 따뜻한 안부 이야기를 적어주세요. 사소한 일상도 소중한 연결이 됩니다... ✍️"
            style={{
              width: '100%',
              flex: 1,
              minHeight: '140px',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '12px',
              lineHeight: '1.6',
              fontFamily: 'var(--font-family)',
              backgroundColor: theme.inputBg,
              color: theme.inputText,
              outline: 'none',
              resize: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '10px',
            fontSize: '10px',
            color: theme.color,
            opacity: 0.8
          }}>
            <span>✨ 감성을 듬뿍 담은 손편지</span>
            <span>{letterText.length}자 입력됨</span>
          </div>
        </div>

        {/* 발송 버튼 */}
        <button
          onClick={handlePreSend}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'var(--text-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '14px 0',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-cozy)'
          }}
        >
          <Send size={15} />
          편지 저장 및 마음 전송하기
        </button>

      </div>

      {/* 3. 감정 선택 모달 */}
      {showEmotionSelect && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ borderRadius: '28px', maxWidth: '340px', margin: 'auto', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🥰</div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>편지를 보낼 때 내 마음의 온도</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              안부를 적어 전송하는 지금 본인의 실제 마음 상태는 어떤가요? 감정을 기록하여 보상을 받아보세요.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <button className="emotion-select-btn" onClick={() => handleFinalSend('love')} style={{ padding: '10px', fontSize: '11px', border: '1px solid #FFC0C0', borderRadius: '12px', background: '#FFF5F5', cursor: 'pointer' }}>
                ❤️ 사랑가득
              </button>
              <button className="emotion-select-btn" onClick={() => handleFinalSend('happy')} style={{ padding: '10px', fontSize: '11px', border: '1px solid #FFE4C0', borderRadius: '12px', background: '#FFFBF5', cursor: 'pointer' }}>
                ☀️ 뿌듯/행복
              </button>
              <button className="emotion-select-btn" onClick={() => handleFinalSend('neutral')} style={{ padding: '10px', fontSize: '11px', border: '1px solid #C0E4FF', borderRadius: '12px', background: '#F5FBFF', cursor: 'pointer' }}>
                🌱 차분/보통
              </button>
              <button className="emotion-select-btn" onClick={() => handleFinalSend('awkward')} style={{ padding: '10px', fontSize: '11px', border: '1px solid #E5E0DB', borderRadius: '12px', background: '#FAF8F5', cursor: 'pointer' }}>
                🍂 쑥스러움
              </button>
            </div>
            <button className="modal-btn cancel" onClick={() => setShowEmotionSelect(false)} style={{ width: '100%' }}>
              취소
            </button>
          </div>
        </div>
      )}

      {/* 4. 가상 모바일 공유 & 축하 팝업 */}
      {showShareModal && (
        <div className="modal-overlay" style={{ zIndex: 1001 }}>
          <div className="modal-content" style={{
            borderRadius: '28px',
            maxWidth: '340px',
            margin: 'auto',
            padding: '24px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #FFF9EB 0%, #FFFFFF 100%)'
          }}>
            <div style={{ fontSize: '40px', animation: 'bounce 1.5s infinite', marginBottom: '10px' }}>🎉</div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              안부 편지가 가상 저장되었습니다!
            </h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              작성하신 정성스러운 안부와 예쁜 스킨이 소중한 히스토리 기록에 영구 보관되었습니다.<br />
              <strong>보상: +150xp 획득! 🌟</strong>
            </p>

            {/* 가상 모바일 공유 목업 영역 */}
            <div style={{
              backgroundColor: '#FDE500', // 카카오톡 노랑
              borderRadius: '16px',
              padding: '14px',
              textAlign: 'left',
              marginBottom: '18px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              border: '1px solid #EAE0A0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px' }}>💬</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#3C2E2A' }}>카카오톡으로 안부 전달하기</span>
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '11px',
                color: '#3C2E2A',
                lineHeight: '1.4'
              }}>
                <strong>[오늘의 안부]</strong><br />
                {letterText.length > 60 ? `${letterText.substring(0, 60)}...` : letterText}
                <div style={{ marginTop: '6px', fontSize: '8px', color: 'var(--text-muted)' }}>
                  🎨 적용 스킨: {theme.badges}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="modal-btn confirm" 
                onClick={() => {
                  showToast('📋 편지 내용이 카카오톡 공유 클립보드에 복사되었습니다!');
                  setTimeout(handleCloseShare, 1200);
                }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flex: 1 }}
              >
                <Share2 size={12} />
                카톡 전송
              </button>
              <button 
                className="modal-btn cancel" 
                onClick={handleCloseShare}
                style={{ flex: 1 }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cozy Toast */}
      {toastMessage && (
        <div className="cozy-toast" style={{ zIndex: 2000 }}>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
