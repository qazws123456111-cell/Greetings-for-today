import React from 'react';
import type { Quest, EmotionType } from '../types';
import { Award } from 'lucide-react';

interface FeedbackModalProps {
  quest: Quest;
  onSelectEmotion: (emotion: EmotionType) => void;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ quest, onSelectEmotion, onClose }) => {
  const emotions: { type: EmotionType; emoji: string; label: string; desc: string }[] = [
    { type: 'love', emoji: '🥰', label: '너무 따뜻했어요', desc: '사랑과 애정을 듬뿍 담아 나눈 대화' },
    { type: 'happy', emoji: '😊', label: '기분 좋게 완료', desc: '서로 가볍고 유쾌하게 안부 교환' },
    { type: 'neutral', emoji: '💬', label: '평범했어요', desc: '담백하고 일상적인 가벼운 연락' },
    { type: 'awkward', emoji: '😅', label: '조금 어색했어요', desc: '오랜만이라 쑥스럽거나 조심스러운 마음' },
  ];

  return (
    <div className="modal-overlay" style={{ alignItems: 'center', padding: '16px' }}>
      <div 
        className="modal-content" 
        style={{ 
          borderRadius: '28px', 
          animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          maxWidth: '360px',
          width: '100%'
        }}
      >
        <div className="feedback-box">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
            <div 
              style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={32} color="var(--primary-dark)" />
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
            따뜻한 안부를 나누셨나요?
          </h2>
          
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {quest.relationshipName}님께 안부를 전한 후,<br />
            지금 당신의 마음속에 남아있는 온도를 알려주세요.
          </p>

          <div className="feedback-badge-bonus">
            <span>🎁 신뢰 기반 보상: <strong>+100xp</strong> 적립 대기 중!</span>
          </div>

          <div className="emotion-buttons-grid">
            {emotions.map((emo) => (
              <button
                key={emo.type}
                className="emotion-btn"
                onClick={() => onSelectEmotion(emo.type)}
                title={emo.desc}
              >
                <span className="emoji">{emo.emoji}</span>
                <span className="lbl">{emo.label}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={onClose} 
            style={{ 
              fontSize: '12px', 
              color: 'var(--text-muted)', 
              marginTop: '6px',
              textDecoration: 'underline'
            }}
          >
            나중에 기록할래요
          </button>
        </div>
      </div>
    </div>
  );
};
