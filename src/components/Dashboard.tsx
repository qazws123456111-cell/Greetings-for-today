import React, { useState } from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import type { Quest } from '../types';
import { RefreshCw, Copy, ExternalLink, Calendar } from 'lucide-react';
import { OniCharacter } from './OniCharacter';

interface DashboardProps {
  onStartQuestAction: (quest: Quest, actionType: 'template' | 'custom') => void;
  onRequestAd: (
    type: 'refresh_quest' | 'refresh_all' | 'charge_points',
    onComplete: () => void,
    questId?: string
  ) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartQuestAction, onRequestAd }) => {
  const { state, watchAdForRefresh } = useAntigravity();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [refreshingQuestId, setRefreshingQuestId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyAndCall = (quest: Quest) => {
    navigator.clipboard.writeText(quest.templateMessage)
      .then(() => {
        showToast(`📋 ${quest.relationshipName}님께 보낼 따뜻한 안부가 복사되었어요!`);
        onStartQuestAction(quest, 'template');
      })
      .catch((err) => {
        console.error('Failed to copy text', err);
        onStartQuestAction(quest, 'template');
      });
  };

  const handleDirectCall = (quest: Quest) => {
    showToast(`✉️ ${quest.relationshipName}님께 직접 연락하러 이동합니다!`);
    onStartQuestAction(quest, 'custom');
  };

  // 개별 새로고침 클릭
  const handleRefreshQuestClick = (questId: string) => {
    if ((state.dailyQuestRefreshCount || 0) >= 3) {
      showToast("🚫 오늘의 새로고침 광고 제한(3회)을 모두 소모하셨습니다. 내일 다시 참여해 주세요!");
      return;
    }
    onRequestAd('refresh_quest', async () => {
      setRefreshingQuestId(questId);
      const res = await watchAdForRefresh(questId);
      setRefreshingQuestId(null);
      if (res.success) {
        showToast(`✨ 광고 시청 보상 +2pt 적립 & 새로운 안부 추천 완료! (오늘 낱개 남은 횟수: ${3 - res.count}회)`);
      } else {
        showToast("🚫 낱개 새로고침 제한(하루 3회)을 초과했습니다.");
      }
    }, questId);
  };

  // 전체 새로고침 클릭
  const handleRefreshAllClick = () => {
    if ((state.dailyFullRefreshCount || 0) >= 2) {
      showToast("🚫 오늘의 전체 새로고침 광고 제한(2회)을 모두 소모하셨습니다. 내일 다시 참여해 주세요!");
      return;
    }
    onRequestAd('refresh_all', async () => {
      setIsRefreshingAll(true);
      const res = await watchAdForRefresh();
      setIsRefreshingAll(false);
      if (res.success) {
        showToast(`☀️ 광고 시청 보상 +5pt 적립 & 오늘의 모든 안부 갱신 완료! (오늘 전체 남은 횟수: ${2 - res.count}회)`);
      } else {
        showToast("🚫 전체 새로고침 제한(하루 2회)을 초과했습니다.");
      }
    });
  };

  const pendingQuests = state.quests.filter(q => q.status === 'pending');

  return (
    <div className="dashboard-view">
      {/* 귀여운 안부 요정 온이 캐릭터 프리뷰 */}
      <section className="dashboard-oni-panel">
        <div className="oni-panel-left">
          <OniCharacter equippedItems={state.equippedItems || []} />
          <div className="oni-speech-bubble">
            <div className="oni-speech-title">
              <span>🧚‍♀️ 안부 요정 온이</span>
            </div>
            {state.currentDay > 0 
              ? `연속 안부 ${state.currentDay}일째 실천 중이네요! 오늘 누구에게 온기를 나누어 볼까요?`
              : "안부는 관계의 온도계입니다. 오랜만에 소중한 사람에게 한마디 건네볼까요?"}
          </div>
        </div>
      </section>

      {/* 퀘스트 헤더 */}
      <div className="section-title">
        <span>오늘의 추천 퀘스트 ({pendingQuests.length})</span>
        {state.relationships.length > 0 && (
          <button 
            className="refresh-all-btn"
            onClick={handleRefreshAllClick}
            disabled={isRefreshingAll}
          >
            <RefreshCw size={12} className={isRefreshingAll ? 'spin-anim' : ''} />
            <span>오늘의 안부 새로 받기</span>
          </button>
        )}
      </div>

      {/* 퀘스트 목록 */}
      <div className="quests-list">
        {pendingQuests.length > 0 ? (
          pendingQuests.map((quest) => (
            <div key={quest.id} className={`quest-card ${quest.relationshipType}`}>
              <div className="quest-card-header">
                <span className="quest-relation-tag">
                  {quest.relationshipType === 'family' && '👨‍👩‍👧 가족'}
                  {quest.relationshipType === 'friend' && '🤝 친구'}
                  {quest.relationshipType === 'lover' && '💖 연인'}
                  {quest.relationshipType === 'acquaintance' && '💼 지인'}
                  {` • ${quest.relationshipName}`}
                </span>
                
                <button 
                  className="quest-refresh-btn"
                  onClick={() => handleRefreshQuestClick(quest.id)}
                  disabled={refreshingQuestId === quest.id}
                  title="다른 퀘스트 추천받기 (광고)"
                >
                  <RefreshCw size={13} className={refreshingQuestId === quest.id ? 'spin-anim' : ''} />
                </button>
              </div>

              <h3 className="quest-title">{quest.title}</h3>
              <p className="quest-desc">{quest.description}</p>

              {/* 말풍선 안부 메시지 */}
              <div className="quest-template-bubble">
                <div style={{ fontStyle: 'italic', marginBottom: '4px', fontSize: '10px', color: 'var(--primary-dark)', fontWeight: 600 }}>
                  💡 추천 안부 메시지:
                </div>
                "{quest.templateMessage}"
              </div>

              {/* 액션 버튼 그룹 */}
              <div className="quest-actions">
                <button 
                  className="quest-btn copy-link"
                  onClick={() => handleCopyAndCall(quest)}
                >
                  <Copy size={13} />
                  <span>복사 후 연락하기</span>
                </button>

                <button 
                  className="quest-btn direct-call"
                  onClick={() => handleDirectCall(quest)}
                >
                  <ExternalLink size={13} />
                  <span>직접 연락하기</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-quests-cozy">
            <Calendar size={32} color="var(--text-muted)" />
            <h4>오늘의 모든 퀘스트 완료! ✨</h4>
            <p>
              {state.relationships.length === 0 
                ? '아직 등록된 관계가 없네요. 아래 [관계 도감] 탭에서 소중한 인연을 먼저 등록해 볼까요?' 
                : '오늘 하루 안부 실천을 훌륭하게 완수하셨어요. 소중한 이들과의 관계가 깊어지고 있습니다.'}
            </p>
            {state.relationships.length === 0 ? (
              <div style={{ marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  관계를 추가하면 맞춤 AI 퀘스트가 생성됩니다.
                </span>
              </div>
            ) : (
              <button className="empty-action-btn" onClick={handleRefreshAllClick}>
                새 퀘스트 추가 생성
              </button>
            )}
          </div>
        )}
      </div>


      {/* Cozy Toast */}
      {toastMessage && (
        <div className="cozy-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      <style>{`
        .spin-anim {
          animation: rotateSlow 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
};
