import React from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import { AdBannerMock } from './AdBannerMock';
import { Home, Users, BarChart3, ShoppingBag, Flame, Heart, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'relationships' | 'history' | 'shop' | 'mypage';
  setActiveTab: (tab: 'home' | 'relationships' | 'history' | 'shop' | 'mypage') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { state } = useAntigravity();

  return (
    <div className="simulator-container">
      {/* 노치 시뮬레이터 */}
      <div className="simulator-notch" />
      
      {/* 폰 내부 뷰포트 */}
      <div className="app-viewport">
        {/* 상단 통합 헤더 */}
        <header className="app-header">
          {/* 🔑 로고/타이틀 클릭 시 홈으로 이동 */}
          <div
            className="app-title-group"
            onClick={() => setActiveTab('home')}
            style={{ cursor: 'pointer' }}
            title="홈으로 돌아가기"
          >
            <h1 style={{ transition: 'opacity 0.2s' }}>오늘의 안부</h1>
            <p>소중한 사람들과 따뜻한 연결</p>
          </div>
          
          {state.currentUser && (
            <div className="header-status">
              {/* 스트릭 뱃지 */}
              <div className="status-badge streak" title="연속 안부 실천 스트릭!">
                <Flame size={14} fill="#FF5A5A" stroke="none" />
                <span>{state.currentDay}일</span>
              </div>
              
              {/* 포인트 뱃지 */}
              <div className="status-badge points" title="나의 마음 포인트">
                <Heart size={14} fill="#E29B00" stroke="none" />
                <span>{state.points}xp</span>
              </div>
            </div>
          )}
        </header>

        {/* 메인 독립 스크롤 영역 */}
        <main className="app-content">
          {children}
        </main>

        {/* 🔑 광고 배너: 스크롤 영역 완전 분리 - 탭바 위 고정 레이어 */}
        {state.currentUser && (
          <div className="ad-banner-fixed-wrapper">
            <AdBannerMock />
          </div>
        )}

        {/* 하단 플로팅 탭바 */}
        <nav className="app-navbar" style={{ gap: '4px' }}>
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={18} />
            <span style={{ fontSize: '9px' }}>오늘의 퀘스트</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'relationships' ? 'active' : ''}`}
            onClick={() => setActiveTab('relationships')}
          >
            <Users size={18} />
            <span style={{ fontSize: '9px' }}>관계 도감</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <BarChart3 size={18} />
            <span style={{ fontSize: '9px' }}>활동 & 분석</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            <ShoppingBag size={18} />
            <span style={{ fontSize: '9px' }}>마음 상점</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'mypage' ? 'active' : ''}`}
            onClick={() => setActiveTab('mypage')}
          >
            <User size={18} />
            <span style={{ fontSize: '9px' }}>마이페이지</span>
          </button>
        </nav>
      </div>

      {/* 홈 인디케이터 바 */}
      <div className="simulator-home-bar" />
    </div>
  );
};

