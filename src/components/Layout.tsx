import React from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import { Home, Users, BarChart3, ShoppingBag, Flame, Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'relationships' | 'history' | 'shop';
  setActiveTab: (tab: 'home' | 'relationships' | 'history' | 'shop') => void;
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
          <div className="app-title-group">
            <h1>오늘의 안부</h1>
            <p>소중한 사람들과 따뜻한 연결</p>
          </div>
          
          <div className="header-status">
            {/* 스트릭 뱃지 */}
            <div className="status-badge streak" title="연속 안부 실천 스트릭!">
              <Flame size={14} fill="#FF5A5A" stroke="none" />
              <span>{state.streak}일</span>
            </div>
            
            {/* 포인트 뱃지 */}
            <div className="status-badge points" title="나의 마음 포인트">
              <Heart size={14} fill="#E29B00" stroke="none" />
              <span>{state.points}xp</span>
            </div>
          </div>
        </header>

        {/* 메인 독립 스크롤 영역 */}
        <main className="app-content">
          {children}
        </main>

        {/* 하단 플로팅 탭바 */}
        <nav className="app-navbar">
          <button 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} />
            <span>오늘의 퀘스트</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'relationships' ? 'active' : ''}`}
            onClick={() => setActiveTab('relationships')}
          >
            <Users size={20} />
            <span>관계 도감</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <BarChart3 size={20} />
            <span>활동 & 분석</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            <ShoppingBag size={20} />
            <span>마음 상점</span>
          </button>
        </nav>
      </div>

      {/* 홈 인디케이터 바 */}
      <div className="simulator-home-bar" />
    </div>
  );
};
