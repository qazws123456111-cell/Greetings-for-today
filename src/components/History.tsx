import React from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import type { EmotionType } from '../types';
import { BarChart3, Heart, Calendar } from 'lucide-react';

export const History: React.FC = () => {
  const { state } = useAntigravity();

  // 감정 비율 통계 집계
  const totalCount = state.history.length;
  
  const emotionCounts = state.history.reduce(
    (acc, curr) => {
      acc[curr.emotion] = (acc[curr.emotion] || 0) + 1;
      return acc;
    },
    { love: 0, happy: 0, neutral: 0, awkward: 0 } as Record<EmotionType, number>
  );

  // SVG 도넛 그래프 세그먼트 그리기 계산
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  const emotionsList: { type: EmotionType; color: string; label: string; emoji: string }[] = [
    { type: 'love', color: 'var(--love)', label: '🥰 따뜻함', emoji: '🥰' },
    { type: 'happy', color: 'var(--accent)', label: '😊 즐거움', emoji: '😊' },
    { type: 'neutral', color: 'var(--secondary-dark)', label: '💬 평범함', emoji: '💬' },
    { type: 'awkward', color: 'var(--primary-dark)', label: '😅 어색함', emoji: '😅' },
  ];

  let currentOffset = 0;
  
  const chartSegments = emotionsList.map((emo) => {
    const count = emotionCounts[emo.type];
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
    const strokeLength = (percentage / 100) * circumference;
    const strokeOffset = circumference - strokeLength + currentOffset;
    
    // 다음 세그먼트 계산을 위해 오프셋 누적
    currentOffset -= strokeLength;
    
    return {
      ...emo,
      count,
      percentage,
      strokeLength,
      strokeOffset
    };
  });

  // 가장 많이 나온 감정 도출
  const getDominantEmotion = () => {
    if (totalCount === 0) return { emoji: '🌱', label: '새싹 온기', msg: '아직 안부 기록이 없습니다. 첫 번째 안부 퀘스트를 달성하여 마음의 온도를 기록해 보세요!' };
    
    let maxType: EmotionType = 'happy';
    let maxVal = -1;
    
    (Object.keys(emotionCounts) as EmotionType[]).forEach((type) => {
      if (emotionCounts[type] > maxVal) {
        maxVal = emotionCounts[type];
        maxType = type;
      }
    });

    switch(maxType as EmotionType) {
      case 'love': 
        return { emoji: '🥰', label: '따뜻한 사랑', msg: '최근 연락 후 마음에 깊은 사랑과 온기를 느끼셨네요! 마음을 나누는 행동이 본인과 상대방 모두에게 깊은 행복을 전하고 있습니다. 훌륭해요! 🌸' };
      case 'happy': 
        return { emoji: '😊', label: '행복한 활기', msg: '기분 좋은 가벼운 교감으로 활력을 얻고 계십니다. 일상 속 소소한 다정함이 쌓여 서로의 관계를 건강하고 안전하게 지탱해 줍니다! 👍' };
      case 'neutral': 
        return { emoji: '💬', label: '은은한 평온', msg: '부담 없이 일상적인 안부를 편안하게 나누고 계시네요. 너무 거창하지 않은 은은한 온도가 오히려 관계를 지치지 않고 오랫동안 이어지게 만듭니다.' };
      case 'awkward': 
        return { emoji: '😅', label: '용기 있는 시작', msg: '오랜만의 연락이라 다소 쑥스럽거나 삐걱거렸을 수 있어요. 하지만 어색함을 깨고 건넨 연락이야말로 관계 회복의 소중한 불씨입니다. 대단한 용기입니다!' };
    }
  };

  const dominant = getDominantEmotion();

  return (
    <div className="history-view">
      {/* 통계 섹션 */}
      <section className="stats-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BarChart3 size={16} color="var(--primary-dark)" />
          <h4>나의 마음 온기 분석</h4>
        </div>

        <div className="stats-chart-wrap">
          {totalCount > 0 ? (
            <>
              {/* 도넛 SVG 그래프 */}
              <svg width="150" height="150" className="donut-svg">
                <circle
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="transparent"
                  stroke="#E5DDD7"
                  strokeWidth="14"
                />
                {chartSegments.map((seg) => (
                  seg.percentage > 0 && (
                    <circle
                      key={seg.type}
                      cx="75"
                      cy="75"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="15"
                      strokeDasharray={circumference}
                      strokeDashoffset={seg.strokeOffset}
                      strokeLinecap="round"
                    />
                  )
                ))}
              </svg>
              
              {/* 도넛 안의 텍스트 */}
              <div className="donut-inner-text">
                <span className="val">{totalCount}회</span>
                <span className="lbl">누적 안부</span>
              </div>
            </>
          ) : (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Heart size={40} color="#E5DDD7" />
              <p style={{ fontSize: '11px', marginTop: '6px' }}>첫 안부를 전하면 그래프가 생깁니다</p>
            </div>
          )}
        </div>

        {/* 그래프 범례 및 수치 */}
        <div className="stats-categories">
          {chartSegments.map((seg) => (
            <div key={seg.type} className="stat-category-item" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className={`color-dot ${seg.type}`} />
                <span>{seg.label}</span>
              </div>
              <strong style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                {seg.count}회 ({Math.round(seg.percentage)}%)
              </strong>
            </div>
          ))}
        </div>
      </section>

      {/* AI 조언 조언 멘트 */}
      <section className="streak-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '18px' }}>{dominant.emoji}</span>
          <h4 style={{ fontSize: '13px', fontWeight: 700 }}>AI 온기 어드바이저 조언: {dominant.label}</h4>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {dominant.msg}
        </p>
      </section>

      {/* 타임라인 피드 */}
      <section className="timeline-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Calendar size={16} color="var(--primary-dark)" />
          <h4>나의 안부 발자취 (타임라인)</h4>
        </div>

        <div className="timeline-list">
          {state.history.length > 0 ? (
            state.history.map((log) => (
              <div key={log.id} className="timeline-card">
                <div className="timeline-meta">
                  <span className="timeline-relation">
                    {log.relationshipName}
                    <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '10px', marginLeft: '6px' }}>
                      {`(${log.relationshipType === 'family' ? '가족' : log.relationshipType === 'friend' ? '친구' : log.relationshipType === 'lover' ? '연인' : '지인'})`}
                    </span>
                  </span>
                  
                  <span className="timeline-time">
                    {new Date(log.timestamp).toLocaleDateString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <p className="timeline-message">
                  {log.message}
                </p>

                <div className="timeline-footer">
                  <span className="timeline-badge-emotion">
                    {log.emotion === 'love' && '🥰 너무 따뜻했어요'}
                    {log.emotion === 'happy' && '😊 기분 좋게 완료'}
                    {log.emotion === 'neutral' && '💬 평범했어요'}
                    {log.emotion === 'awkward' && '😅 조금 어색했어요'}
                  </span>
                  
                  <span className="timeline-points-earned">
                    +{log.pointsEarned}xp
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-quests-cozy" style={{ padding: '30px 20px', left: '-20px', position: 'relative', width: 'calc(100% + 20px)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>아직 타임라인 기록이 비어있습니다.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
