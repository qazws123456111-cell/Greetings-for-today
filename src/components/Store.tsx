import React, { useState } from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import type { RewardItem } from '../types';
import { ShoppingBag, Lock, Award, Sparkles, Check } from 'lucide-react';
import { OniCharacter } from './OniCharacter';

export const Store: React.FC = () => {
  const { state, purchaseReward, addPoints, toggleEquipItem, equipSkin } = useAntigravity();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shakeId, setShakeId] = useState<string | null>(null);
  
  // 현재 활성화된 상점 탭: 'gifticon' (기프티콘) | 'digital' (디지털 콘텐츠) | 'inventory' (내 보관함)
  const [activeTab, setActiveTab] = useState<'gifticon' | 'digital' | 'inventory'>('gifticon');
  
  // 히든 이벤트 해금 여부
  const [showHiddenModal, setShowHiddenModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handlePurchase = (item: RewardItem) => {
    if (item.unlocked) {
      if (item.category === 'gifticon') {
        showToast(`🎁 이미 교환된 기프티콘입니다! 마이페이지를 확인해 주세요.`);
      } else {
        showToast(`✨ 이미 소장 중인 아이템입니다! [내 보관함] 탭에서 장착해 보세요.`);
      }
      return;
    }

    if (state.points < item.price) {
      setShakeId(item.id);
      setTimeout(() => setShakeId(null), 500);
      showToast(`😢 포인트가 부족합니다! 안부 퀘스트를 더 달성해 보세요.`);
      return;
    }

    const success = purchaseReward(item.id);
    if (success) {
      if (item.category === 'gifticon') {
        showToast(`🎉 ${item.name} 교환에 성공했습니다!`);
      } else {
        showToast(`🎉 ${item.name}을(를) 구매했습니다! [내 보관함]에서 착용해 보세요! ✨`);
      }
    }
  };

  const handleOpenHiddenEvent = () => {
    if (state.points < 1000 && !state.rewards.some(r => r.unlocked)) {
      showToast("🔒 누적 1,000포인트를 달성하거나 상품을 교환해 활기를 높이세요!");
      return;
    }
    setShowHiddenModal(true);
  };

  const handleDebugAddPoints = () => {
    addPoints(200);
    showToast("✨ 데모용 보너스 포인트 +200xp를 획득하셨습니다!");
  };

  const totalSpent = state.rewards.reduce((acc, curr) => curr.unlocked ? acc + curr.price : acc, 0);
  const totalEarnedPoints = state.points + totalSpent;
  const isHiddenUnlocked = totalEarnedPoints >= 1000;

  // 카테고리별 아이템 필터링
  const gifticons = state.rewards.filter(r => r.category === 'gifticon');
  const digitalItems = state.rewards.filter(r => r.category === 'character' || r.category === 'skin');
  
  // 내 보관함에 속한(unlocked) 아이템들
  const unlockedCharacters = state.rewards.filter(r => r.unlocked && r.category === 'character');
  const unlockedSkins = state.rewards.filter(r => r.unlocked && r.category === 'skin');

  return (
    <div className="shop-view">
      {/* 상단 지갑 요약 */}
      <section 
        className="streak-card" 
        style={{ 
          background: 'linear-gradient(135deg, #FFF9EB 0%, #FFEAE5 100%)',
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(226, 155, 0, 0.15)'
            }}
          >
            <ShoppingBag size={20} color="#E29B00" />
          </div>
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700 }}>내 마음 상점</h3>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
              보유 포인트: <strong style={{ color: '#E29B00' }}>{state.points} xp</strong>
            </p>
          </div>
        </div>
        <button 
          onClick={handleDebugAddPoints}
          style={{
            backgroundColor: '#FFD25A',
            color: '#554D49',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '9px',
            fontWeight: 700,
            boxShadow: '0 2px 6px rgba(255, 210, 90, 0.3)'
          }}
        >
          +200xp 획득 (데모)
        </button>
      </section>

      {/* 상점 3단 탭바 */}
      <div className="shop-tab-bar">
        <button 
          className={`shop-tab-item ${activeTab === 'gifticon' ? 'active' : ''}`}
          onClick={() => setActiveTab('gifticon')}
        >
          ☕️ 기프티콘
        </button>
        <button 
          className={`shop-tab-item ${activeTab === 'digital' ? 'active' : ''}`}
          onClick={() => setActiveTab('digital')}
        >
          ✨ 디지털 콘텐츠
        </button>
        <button 
          className={`shop-tab-item ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          🎒 내 보관함
        </button>
      </div>

      {/* 탭 1: 기프티콘 리스트 */}
      {activeTab === 'gifticon' && (
        <div className="shop-grid">
          {gifticons.map((item) => (
            <div 
              key={item.id} 
              className={`shop-item-card ${item.unlocked ? 'unlocked' : ''} ${shakeId === item.id ? 'shake-anim' : ''}`}
              onClick={() => handlePurchase(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className="shop-item-top">
                <span className="shop-item-icon">{item.icon}</span>
                <h4 className="shop-item-title">{item.name}</h4>
                <p className="shop-item-desc">{item.description}</p>
              </div>
              
              <div className="shop-item-bottom">
                <span className="shop-item-price">{item.price} xp</span>
                {!item.unlocked ? (
                  <button className="buy-btn">교환</button>
                ) : (
                  <span className="unlocked-stamp">교환완료</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 탭 2: 디지털 콘텐츠 리스트 */}
      {activeTab === 'digital' && (
        <div className="shop-grid">
          {digitalItems.map((item) => (
            <div 
              key={item.id} 
              className={`shop-item-card ${item.unlocked ? 'unlocked' : ''} ${shakeId === item.id ? 'shake-anim' : ''}`}
              onClick={() => handlePurchase(item)}
              style={{ cursor: 'pointer' }}
            >
              <div className="shop-item-top">
                <span className="shop-item-icon">{item.icon}</span>
                <h4 className="shop-item-title">{item.name}</h4>
                <p className="shop-item-desc">{item.description}</p>
                <span style={{ 
                  fontSize: '8px', 
                  backgroundColor: item.category === 'character' ? '#FFF0F0' : '#EBF3EA', 
                  color: item.category === 'character' ? 'var(--primary-dark)' : 'var(--accent-dark)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  alignSelf: 'flex-start',
                  fontWeight: 600
                }}>
                  {item.category === 'character' ? '캐릭터 코디' : '편지지 스킨'}
                </span>
              </div>
              
              <div className="shop-item-bottom">
                <span className="shop-item-price">{item.price} xp</span>
                {!item.unlocked ? (
                  <button className="buy-btn">구매</button>
                ) : (
                  <span className="unlocked-stamp" style={{ backgroundColor: 'var(--accent-dark)' }}>소장중</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 탭 3: 내 보관함 및 캐릭터 꾸미기 방 */}
      {activeTab === 'inventory' && (
        <div className="inventory-panel">
          {/* 캐릭터 프리뷰 영역 */}
          <div className="inventory-preview-card">
            <OniCharacter equippedItems={state.equippedItems || []} />
            <div className="inventory-preview-info">
              <h4>안부 요정 온이의 드레스룸 👗</h4>
              <p>
                구매한 디지털 코디 아이템과 메신저 스킨을 장착할 수 있습니다. 온이에게 어울리게 꾸며보세요!
              </p>
            </div>
          </div>

          {/* 1. 캐릭터 코디 아이템 섹션 */}
          <div className="inventory-section">
            <span className="inventory-section-title">소장 중인 캐릭터 아이템</span>
            {unlockedCharacters.length > 0 ? (
              <div className="inventory-grid">
                {unlockedCharacters.map((item) => {
                  const isEquipped = (state.equippedItems || []).includes(item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={`inventory-item-card ${isEquipped ? 'equipped' : ''}`}
                      onClick={() => toggleEquipItem(item.id)}
                    >
                      <div className="inventory-item-icon">{item.icon}</div>
                      <div className="inventory-item-details">
                        <span className="inventory-item-name">{item.name}</span>
                        <span className={`inventory-item-status ${isEquipped ? 'equipped' : ''}`}>
                          {isEquipped ? '장착 해제하기' : '장착하기'}
                        </span>
                      </div>
                      {isEquipped && <Check size={12} color="var(--primary-dark)" style={{ marginLeft: 'auto' }} />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-inventory">
                아직 보유한 코디 아이템이 없습니다.<br />
                '디지털 콘텐츠' 탭에서 아이템을 장착해 보세요!
              </div>
            )}
          </div>

          {/* 2. 메신저 편지지 스킨 섹션 */}
          <div className="inventory-section">
            <span className="inventory-section-title">소장 중인 가상 편지지 스킨</span>
            <div className="inventory-grid">
              {/* 기본 편지지 스킨은 항상 해금되어 있음 */}
              <div 
                className={`inventory-item-card ${state.equippedSkin === null ? 'equipped' : ''}`}
                onClick={() => equipSkin(null)}
              >
                <div className="inventory-item-icon">☁️</div>
                <div className="inventory-item-details">
                  <span className="inventory-item-name">기본 파란 하늘 스킨</span>
                  <span className={`inventory-item-status ${state.equippedSkin === null ? 'equipped' : ''}`}>
                    {state.equippedSkin === null ? '적용 중' : '적용하기'}
                  </span>
                </div>
                {state.equippedSkin === null && <Check size={12} color="var(--primary-dark)" style={{ marginLeft: 'auto' }} />}
              </div>

              {unlockedSkins.map((item) => {
                const isActive = state.equippedSkin === item.id;
                return (
                  <div 
                    key={item.id} 
                    className={`inventory-item-card ${isActive ? 'equipped' : ''}`}
                    onClick={() => equipSkin(item.id)}
                  >
                    <div className="inventory-item-icon">{item.icon}</div>
                    <div className="inventory-item-details">
                      <span className="inventory-item-name">{item.name}</span>
                      <span className={`inventory-item-status ${isActive ? 'equipped' : ''}`}>
                        {isActive ? '적용 중' : '적용하기'}
                      </span>
                    </div>
                    {isActive && <Check size={12} color="var(--primary-dark)" style={{ marginLeft: 'auto' }} />}
                  </div>
                );
              })}
            </div>
            {unlockedSkins.length === 0 && (
              <div className="empty-inventory" style={{ marginTop: '8px' }}>
                아직 보유한 특별 편지지 스킨이 없습니다.<br />
                스킨을 구매하여 메신저 시뮬레이터 배경을 바꿔 보세요!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 히든 이벤트 카드 */}
      <div 
        className={`hidden-reward-card ${isHiddenUnlocked ? 'unlocked' : ''}`}
        onClick={handleOpenHiddenEvent}
        style={{ cursor: 'pointer', marginTop: '12px' }}
      >
        <div className="hidden-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Award size={16} color={isHiddenUnlocked ? "#FFD25A" : "#AFA6A1"} />
            <h4 style={{ color: isHiddenUnlocked ? "#FFD25A" : "#AFA6A1", fontSize: '13px' }}>
              효도 마스터 특별 선물 해금
            </h4>
          </div>
          <p>누적 1,000xp 달성 시 전설의 효도 쿠폰 해금!</p>
          <span style={{ fontSize: '9px', color: isHiddenUnlocked ? '#FFF0F0' : '#8C8380', display: 'block', marginTop: '4px' }}>
            {`현재 누적 스코어: ${totalEarnedPoints} / 1,000xp`}
          </span>
        </div>
        
        <div>
          {isHiddenUnlocked ? (
            <button className="hidden-action" style={{ animation: 'pulse 1.5s infinite' }}>
              <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              열기
            </button>
          ) : (
            <button className="hidden-action locked" disabled>
              <Lock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              잠김
            </button>
          )}
        </div>
      </div>

      {/* 히든 이벤트 모달 */}
      {showHiddenModal && (
        <div className="modal-overlay" onClick={() => setShowHiddenModal(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              borderRadius: '28px', 
              background: 'linear-gradient(135deg, #151110 0%, #2B2523 100%)',
              color: 'white',
              textAlign: 'center',
              padding: '30px 20px',
              maxWidth: '350px',
              margin: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '48px', animation: 'bounce 1.5s infinite', display: 'inline-block' }}>👑</span>
            </div>
            
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--gold)', marginBottom: '8px' }}>
              축하합니다! 효도 마스터 등극!
            </h3>
            
            <p style={{ fontSize: '11px', color: '#CCC6C4', lineHeight: 1.6, marginBottom: '16px' }}>
              포인트를 1,000xp나 쌓으시며 소중한 인간관계를 지키기 위해 노력해 오신 당신에게 경의를 표합니다.<br /><br />
              <strong>[특전: 마음 가득 안심 효도 여행 패키지]</strong><br />
              부모님과 오순도순 다녀올 수 있는 글램핑 숙박권 및 손편지 실물 우편 발송권이 해금되었습니다!
            </p>
            
            <button 
              className="modal-btn confirm"
              onClick={() => {
                setShowHiddenModal(false);
                showToast("📞 특별 선물 쿠폰 코드 발송 완료!");
              }}
              style={{ backgroundColor: 'var(--gold)', color: '#2B2523' }}
            >
              특전 쿠폰 받기
            </button>
          </div>
        </div>
      )}

      {/* Cozy Toast */}
      {toastMessage && (
        <div className="cozy-toast">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 흔들림 효과 스타일 */}
      <style>{`
        .shake-anim {
          animation: shake 0.5s ease-in-out;
          border-color: #FF5A5A !important;
          background-color: #FFF0F0 !important;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};
