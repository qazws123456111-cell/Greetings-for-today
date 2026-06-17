import React, { useState } from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import { OniCharacter } from './OniCharacter';
import { LogOut, Sparkles, Check, Send, Ticket, Gift, Tag } from 'lucide-react';

interface MyPageProps {
  onWriteLetterWithSkin: (skinId: string | null) => void;
}

export const MyPage: React.FC<MyPageProps> = ({ onWriteLetterWithSkin }) => {
  const { state, logout, toggleEquipItem, equipSkin, advanceDayForDemo, registerCoupon } = useAntigravity();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCouponRegister = () => {
    if (!couponInput.trim()) {
      setCouponMessage({ text: '쿠폰 코드를 입력해 주세요.', success: false });
      return;
    }
    const result = registerCoupon(couponInput.trim());
    setCouponMessage({ text: result.message, success: result.success });
    if (result.success) {
      setCouponInput('');
      showToast(result.message);
    }
    setTimeout(() => setCouponMessage(null), 3000);
  };

  if (!state.currentUser) return null;

  const user = state.currentUser;
  const formattedJoinDate = new Date(user.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // 보관함 필터링
  const unlockedGifticons = state.rewards.filter(r => r.unlocked && r.category === 'gifticon');
  const unlockedCharacters = state.rewards.filter(r => r.unlocked && r.category === 'character');
  const unlockedSkins = state.rewards.filter(r => r.unlocked && r.category === 'skin');
  const registeredCoupons = state.registeredCoupons || [];

  const handleAdvanceDay = () => {
    advanceDayForDemo();
    showToast(`⏰ 가상 시간이 1일 흘러갔습니다! 현재 가입 ${state.currentDay + 1}일차로 갱신되었습니다.`);
  };

  return (
    <div className="mypage-view" style={{ fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. 프로필 요약 카드 */}
      <section className="streak-card" style={{
        background: 'linear-gradient(135deg, #FFEAE5 0%, #FFF0F0 100%)',
        flexDirection: 'column', alignItems: 'stretch', gap: '12px', padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '10px', backgroundColor: 'var(--primary-dark)', color: 'white', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>
              가입 {state.currentDay}일차 ☀️
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '6px 0 2px 0', color: 'var(--text-primary)' }}>
              {user.name} 님
            </h2>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>ID: {user.id}</p>
          </div>
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(62, 56, 53, 0.06)', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <LogOut size={12} />
            로그아웃
          </button>
        </div>
        <div style={{ borderTop: '1px dashed rgba(62, 56, 53, 0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div>💌 가입일: {formattedJoinDate}</div>
          <div>💖 보유: <strong style={{ color: 'var(--primary-dark)' }}>{state.points}xp</strong></div>
        </div>
      </section>

      {/* 2. 데모용 가상 시간 흐름 */}
      <section className="streak-card" style={{ background: '#FFF9EB', border: '1px solid #FFE6C0', padding: '16px', flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--gold)" />
          <h3 style={{ fontSize: '13px', fontWeight: 800, margin: 0 }}>가상 시간 엔진 & 초기화 시뮬레이터</h3>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
          시간을 인위적으로 흘려보내 <strong>'퀘스트 상태 리셋 + 기본 포인트 지급(+50xp)'</strong> 로직을 테스트해볼 수 있습니다.
        </p>
        <button onClick={handleAdvanceDay} style={{ backgroundColor: '#FFD25A', border: 'none', borderRadius: '12px', padding: '10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 10px rgba(255, 210, 90, 0.25)', color: 'var(--text-primary)', textAlign: 'center', marginTop: '4px' }}>
          ⏰ 가상 시간 1일 흐르게 하기 (1일차 갱신 시뮬레이션)
        </button>
      </section>

      {/* 🎟️ 3. 선물 쿠폰 등록/조회 섹션 (신규!) */}
      <section style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '16px', boxShadow: 'var(--shadow-soft)', border: '1px solid rgba(255, 172, 153, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Ticket size={16} color="var(--primary-dark)" />
          <h3 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>🎟️ 선물 쿠폰 등록 / 보관함</h3>
        </div>
        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
          기프티콘 교환 후 발급된 특별 선물 쿠폰 코드를 여기에 등록해 보관하세요.<br />
          <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>예시 코드: HELLO2024, OBNB1234, LOVE5678, CHOCO9999</span>
        </p>

        {/* 쿠폰 입력창 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input
            type="text"
            value={couponInput}
            onChange={e => setCouponInput(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleCouponRegister()}
            placeholder="쿠폰 코드를 입력하세요 (예: HELLO2024)"
            style={{ flex: 1, padding: '10px 12px', borderRadius: '12px', border: '1px solid #E5E0DB', fontSize: '11px', fontFamily: 'var(--font-family)', outline: 'none', backgroundColor: '#FAF8F5', letterSpacing: '1px' }}
          />
          <button
            onClick={handleCouponRegister}
            style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '10px 14px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            등록
          </button>
        </div>

        {/* 등록 결과 메시지 */}
        {couponMessage && (
          <div style={{
            padding: '8px 12px', borderRadius: '10px', fontSize: '11px', marginBottom: '10px',
            backgroundColor: couponMessage.success ? '#F0FFF4' : '#FFF0F0',
            color: couponMessage.success ? '#16A34A' : '#DC2626',
            border: `1px solid ${couponMessage.success ? '#BBF7D0' : '#FECACA'}`
          }}>
            {couponMessage.success ? '✅' : '⚠️'} {couponMessage.text}
          </div>
        )}

        {/* 등록된 쿠폰 목록 */}
        {registeredCoupons.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>등록된 쿠폰 ({registeredCoupons.length}개)</span>
            {registeredCoupons.map(coupon => (
              <div key={coupon.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: '#FFF9EB', borderRadius: '12px', border: '1px solid #FFE6C0' }}>
                <Tag size={14} color="#E29B00" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{coupon.label}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    코드: <strong style={{ letterSpacing: '1px' }}>{coupon.code}</strong> · {new Date(coupon.registeredAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <span style={{ fontSize: '9px', backgroundColor: coupon.isUsed ? '#E5E0DB' : '#D1FAE5', color: coupon.isUsed ? 'var(--text-muted)' : '#065F46', padding: '3px 7px', borderRadius: '8px', fontWeight: 700 }}>
                  {coupon.isUsed ? '사용됨' : '미사용'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px', fontSize: '10px', color: 'var(--text-muted)', backgroundColor: '#F5F2EF', borderRadius: '10px' }}>
            아직 등록된 쿠폰이 없습니다. 위에서 코드를 입력해 보세요! 🎁
          </div>
        )}
      </section>

      {/* 4. 보관함 & 드레스룸 */}
      <div className="inventory-panel" style={{ marginTop: '4px' }}>
        
        {/* 온이 프리뷰 */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)' }}>
          <OniCharacter equippedItems={state.equippedItems || []} />
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 4px 0' }}>안부 요정 온이 꾸미기 Room 👗</h4>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              상점에서 포인트로 획득한 디지털 아이템들을 여기에서 즉시 착용해볼 수 있습니다.
            </p>
          </div>
        </div>

        {/* 4-0. 기프티콘 보관함 (신규: 상점 구매 아이템 연동) */}
        <div className="inventory-section" style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Gift size={13} color="var(--primary-dark)" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>교환한 기프티콘 보관함</span>
          </div>
          {unlockedGifticons.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {unlockedGifticons.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', backgroundColor: '#FFF9EB', borderRadius: '14px', border: '1px solid #FFE6C0' }}>
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      교환 완료 · {item.unlockedAt ? new Date(item.unlockedAt).toLocaleDateString('ko-KR') : ''}
                    </div>
                  </div>
                  <span style={{ fontSize: '9px', backgroundColor: '#D1FAE5', color: '#065F46', padding: '3px 7px', borderRadius: '8px', fontWeight: 700 }}>
                    보유중
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '14px', fontSize: '11px', color: 'var(--text-muted)', backgroundColor: '#F5F2EF', borderRadius: '12px' }}>
              교환한 기프티콘이 없습니다. '마음 상점'에서 교환해 보세요! ☕
            </div>
          )}
        </div>

        {/* 4-1. 캐릭터 코디 아이템 */}
        <div className="inventory-section" style={{ marginTop: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>소장 중인 캐릭터 꾸미기 아이템</span>
          {unlockedCharacters.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
              {unlockedCharacters.map(item => {
                const isEquipped = (state.equippedItems || []).includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleEquipItem(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: isEquipped ? '2px solid var(--primary)' : '1px solid #EAE5E2', cursor: 'pointer' }}
                  >
                    <span style={{ fontSize: '18px' }}>{item.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.name}</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{isEquipped ? '장착 해제' : '장착하기'}</span>
                    </div>
                    {isEquipped && <Check size={12} color="var(--primary-dark)" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', fontSize: '11px', color: 'var(--text-muted)', backgroundColor: '#F5F2EF', borderRadius: '12px', marginTop: '8px' }}>
              보유한 코디 아이템이 없습니다. '마음 상점'에서 교환해 보세요!
            </div>
          )}
        </div>

        {/* 4-2. 편지지 스킨 섹션 */}
        <div className="inventory-section" style={{ marginTop: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>소장 중인 안부 편지지 스킨</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>

            {/* 기본 스킨 */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: state.equippedSkin === null ? '2px solid var(--primary)' : '1px solid #EAE5E2', cursor: 'pointer' }}
            >
              <span style={{ fontSize: '20px' }}>☁️</span>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }} onClick={() => equipSkin(null)}>
                <span style={{ fontSize: '11px', fontWeight: 700 }}>기본 파란 하늘 스킨</span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>적용 중인 메신저 배경</span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); equipSkin(null); onWriteLetterWithSkin(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--text-primary)', color: 'white', border: 'none', borderRadius: '10px', padding: '6px 10px', fontSize: '9px', fontWeight: 700, cursor: 'pointer' }}
              >
                <Send size={10} />편지 쓰기
              </button>
            </div>

            {/* 구매한 스킨들 */}
            {unlockedSkins.map(item => {
              const isActive = state.equippedSkin === item.id;
              return (
                <div
                  key={item.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: isActive ? '2px solid var(--primary)' : '1px solid #EAE5E2', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }} onClick={() => equipSkin(item.id)}>
                    <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.name}</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{isActive ? '스킨 적용 중' : '스킨 적용하기'}</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); equipSkin(item.id); onWriteLetterWithSkin(item.id); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', padding: '6px 10px', fontSize: '9px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    <Send size={10} />편지 쓰기
                  </button>
                </div>
              );
            })}

            {unlockedSkins.length === 0 && (
              <div style={{ textAlign: 'center', padding: '16px', fontSize: '11px', color: 'var(--text-muted)', backgroundColor: '#F5F2EF', borderRadius: '12px' }}>
                아직 구매한 편지지 스킨이 없습니다.<br />'마음 상점'에서 특별한 감성 스킨을 획득해 보세요!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cozy Toast */}
      {toastMessage && (
        <div className="cozy-toast" style={{ zIndex: 1000 }}>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
