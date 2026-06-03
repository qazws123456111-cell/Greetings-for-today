import React, { useState } from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import type { Relationship as RelType, RelationshipType, ContactPeriod } from '../types';
import { Plus, Edit3, Trash2, X, Heart, Star } from 'lucide-react';

export const Relationship: React.FC = () => {
  const { state, addRelationship, updateRelationship, deleteRelationship } = useAntigravity();
  
  // 모달 열림 여부 및 수정 중인 관계 데이터
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRel, setEditingRel] = useState<RelType | null>(null);

  // 폼 입력 상태
  const [name, setName] = useState('');
  const [type, setType] = useState<RelationshipType>('family');
  const [period, setPeriod] = useState<ContactPeriod>('weekly');
  const [closeness, setCloseness] = useState(5);

  const openAddModal = () => {
    setEditingRel(null);
    setName('');
    setType('family');
    setPeriod('weekly');
    setCloseness(5);
    setIsModalOpen(true);
  };

  const openEditModal = (rel: RelType) => {
    setEditingRel(rel);
    setName(rel.name);
    setType(rel.type);
    setPeriod(rel.period);
    setCloseness(rel.closeness);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingRel) {
      updateRelationship(editingRel.id, name, type, period, closeness);
    } else {
      addRelationship(name, type, period, closeness);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("정말 이 소중한 인연의 기록을 도감에서 지우시겠습니까?")) {
      deleteRelationship(id);
      setIsModalOpen(false);
    }
  };

  // 마지막 연락 기준 경과 일수 게이지 계산
  const calculatePeriodGauge = (rel: RelType) => {
    if (!rel.lastContacted) return { percent: 0, status: 'warning' };
    
    const diffTime = Math.abs(Date.now() - new Date(rel.lastContacted).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let limitDays = 7;
    if (rel.period === 'daily') limitDays = 1;
    else if (rel.period === 'weekly') limitDays = 7;
    else if (rel.period === 'biweekly') limitDays = 14;
    else if (rel.period === 'monthly') limitDays = 30;

    // 만약 연락 주기를 넘어가기 일보직전이거나 넘어갔다면 warning, 안전하다면 healthy
    const percent = Math.max(0, Math.min(100, 100 - (diffDays / limitDays) * 100));
    const status = percent < 30 ? 'warning' : 'healthy';

    return { percent, status };
  };

  const getKoreanPeriod = (p: ContactPeriod) => {
    switch(p) {
      case 'daily': return '매일 연락';
      case 'weekly': return '주 1회 연락';
      case 'biweekly': return '격주 1회 연락';
      case 'monthly': return '월 1회 연락';
    }
  };

  const getKoreanType = (t: RelationshipType) => {
    switch(t) {
      case 'family': return '가족';
      case 'friend': return '친구';
      case 'lover': return '연인';
      case 'acquaintance': return '지인';
    }
  };

  return (
    <div className="relationship-view">
      {/* 관계 등록 쉘 */}
      <div className="add-relation-bar">
        <span>내 소중한 관계 도감 ({state.relationships.length})</span>
        <button className="add-relation-btn" onClick={openAddModal} title="관계 추가하기">
          <Plus size={18} />
        </button>
      </div>

      {/* 관계 리스트 */}
      <div className="relation-cards-list">
        {state.relationships.length > 0 ? (
          state.relationships.map((rel) => {
            const gauge = calculatePeriodGauge(rel);
            return (
              <div key={rel.id} className="relation-card">
                <div className="relation-info-left">
                  {/* 아바타 */}
                  <div className={`avatar-cozy ${rel.type}`}>
                    {rel.name.trim().charAt(0)}
                  </div>
                  
                  {/* 정보 */}
                  <div className="relation-meta">
                    <h4>{rel.name}</h4>
                    <p>{`${getKoreanType(rel.type)} • ${getKoreanPeriod(rel.period)}`}</p>
                    
                    {/* 하트 점수 */}
                    <div className="closeness-hearts" title={`친밀도 레벨 ${rel.closeness}`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="heart-emoji">
                          {i < rel.closeness ? '❤️' : '🤍'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relation-card-right">
                  {/* 에디트 버튼 */}
                  <div className="edit-btn-wrap">
                    <button className="edit-action-btn" onClick={() => openEditModal(rel)}>
                      <Edit3 size={14} />
                    </button>
                  </div>
                  
                  {/* 주기 프로그레스 바 */}
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                      {rel.lastContacted 
                        ? `마지막 안부: ${new Date(rel.lastContacted).toLocaleDateString('ko-KR', {month: 'numeric', day: 'numeric'})}`
                        : '연락 기록 없음'}
                    </span>
                    <div className="period-gauge-container" title="다음 연락까지 남은 온기">
                      <div 
                        className={`period-gauge-bar ${gauge.status}`}
                        style={{ width: `${rel.lastContacted ? gauge.percent : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-quests-cozy" style={{ padding: '40px 20px' }}>
            <Heart size={32} color="var(--primary-dark)" style={{ animation: 'bounce 2s infinite' }} />
            <h4>소중한 인연을 등록해 보세요 🌸</h4>
            <p>
              가족, 친구, 연인, 직장동료 등 미뤄왔던 소중한 인연들을<br />
              도감에 올리고 주기를 관리해 든든하게 지켜주세요.
            </p>
            <button className="empty-action-btn" onClick={openAddModal}>
              관계 등록하기
            </button>
          </div>
        )}
      </div>

      {/* 바텀 슬라이드업 추가/수정 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRel ? '소중한 인연 수정' : '새로운 소중한 인연 등록'}</h3>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* 이름 */}
              <div className="form-group">
                <label>인연의 이름</label>
                <input 
                  type="text" 
                  className="input-cozy" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 엄마, 민지(친구), 부장님 등"
                  maxLength={12}
                  required
                />
              </div>

              {/* 관계 유형 */}
              <div className="form-group">
                <label>관계 종류</label>
                <select 
                  className="select-cozy" 
                  value={type} 
                  onChange={(e) => setType(e.target.value as RelationshipType)}
                >
                  <option value="family">👨‍👩‍👧 가족</option>
                  <option value="friend">🤝 친구</option>
                  <option value="lover">💖 연인</option>
                  <option value="acquaintance">💼 지인</option>
                </select>
              </div>

              {/* 선호 주기 */}
              <div className="form-group">
                <label>바람직한 연락 주기</label>
                <select 
                  className="select-cozy" 
                  value={period} 
                  onChange={(e) => setPeriod(e.target.value as ContactPeriod)}
                >
                  <option value="daily">매일 안부 전하기</option>
                  <option value="weekly">주 1회 (적어도 일주일에 한 번)</option>
                  <option value="biweekly">격주 1회 (보름에 한 번은 꼭)</option>
                  <option value="monthly">월 1회 (한 달에 한 번 잊지 말고)</option>
                </select>
              </div>

              {/* 친밀도 (하트 레벨) */}
              <div className="form-group">
                <label>현재 우리의 온도 (친밀도)</label>
                <div className="closeness-selector">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button 
                      key={i} 
                      type="button" 
                      className={`star-btn ${i >= closeness ? 'empty' : ''}`}
                      onClick={() => setCloseness(i + 1)}
                    >
                      <Star size={24} fill={i < closeness ? "#FF9B9B" : "none"} stroke={i < closeness ? "none" : "#E29B00"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 하단 확인 버튼들 */}
              <div className="modal-footer">
                {editingRel && (
                  <button 
                    type="button" 
                    className="modal-btn delete" 
                    onClick={() => handleDelete(editingRel.id)}
                  >
                    <Trash2 size={13} style={{ marginRight: '4px' }} />
                    삭제하기
                  </button>
                )}
                
                <button type="submit" className="modal-btn confirm">
                  {editingRel ? '저장하기' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
