import React, { useState } from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import { Lock, User, Sparkles, AlertCircle, Heart } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, signup } = useAntigravity();
  
  // 모드: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // 폼 필드
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  // 에러 및 알림 메시지
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 입력 초기화
  const resetForm = () => {
    setId('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleToggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!id.trim() || !password.trim()) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('이름을 입력해 주세요.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
        return;
      }
      if (password.length < 4) {
        setErrorMessage('비밀번호는 최소 4글자 이상이어야 합니다.');
        return;
      }

      // 회원가입 실행
      const res = signup(id, password, name);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          // 회원가입 완료 후 자동으로 로그인이 되므로 굳이 로그인 모드로 갈 필요 없이 
          // 스토어가 업데이트되어 메인 페이지로 넘어갑니다.
        }, 1500);
      } else {
        setErrorMessage(res.message);
      }
    } else {
      // 로그인 실행
      const res = login(id, password);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div className="auth-container" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100%',
      padding: '24px',
      background: 'linear-gradient(135deg, #FAF8F5 0%, #FFF0F0 100%)',
      fontFamily: 'var(--font-family)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 둥둥 떠다니는 귀여운 뒷배경 장식물들 */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '48px',
        opacity: 0.15,
        animation: 'bounce 3s infinite ease-in-out'
      }}>🌸</div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        fontSize: '40px',
        opacity: 0.15,
        animation: 'bounce 4s infinite ease-in-out 1s'
      }}>💌</div>
      
      {/* 메인 박스 */}
      <div className="auth-card" style={{
        width: '100%',
        maxWidth: '360px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 24px',
        boxShadow: 'var(--shadow-cozy)',
        border: '1px solid rgba(255, 172, 153, 0.2)',
        zIndex: 1
      }}>
        {/* 상단 타이틀 */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-round)',
            backgroundColor: 'var(--primary-light)',
            marginBottom: '12px'
          }}>
            <Heart size={24} fill="var(--primary)" stroke="none" style={{ animation: 'pulse 2s infinite' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            오늘의 안부
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
            {mode === 'login' ? '소중한 인연들과 따뜻한 연락을 시작해 보세요.' : '새로운 마음 연결의 시작을 환영합니다.'}
          </p>
        </div>

        {/* 에러 메시지 알림 */}
        {errorMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFF0F0',
            border: '1px solid #FFC0C0',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '16px',
            color: '#D32F2F',
            fontSize: '11px'
          }}>
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 성공 메시지 알림 */}
        {successMessage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--accent-light)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '16px',
            color: 'var(--accent-dark)',
            fontSize: '11px'
          }}>
            <Sparkles size={14} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 아이디 필드 */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              아이디
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #E5E0DB',
                  outline: 'none',
                  fontSize: '12px',
                  fontFamily: 'var(--font-family)',
                  transition: 'border-color 0.3s'
                }}
              />
            </div>
          </div>

          {/* 이름 필드 (회원가입 모드일 때만 노출) */}
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                이름
              </label>
              <div style={{ position: 'relative' }}>
                <Sparkles size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="본인의 이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #E5E0DB',
                    outline: 'none',
                    fontSize: '12px',
                    fontFamily: 'var(--font-family)',
                    transition: 'border-color 0.3s'
                  }}
                />
              </div>
            </div>
          )}

          {/* 비밀번호 필드 */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              비밀번호
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #E5E0DB',
                  outline: 'none',
                  fontSize: '12px',
                  fontFamily: 'var(--font-family)',
                  transition: 'border-color 0.3s'
                }}
              />
            </div>
          </div>

          {/* 비밀번호 확인 필드 (회원가입 모드일 때만 노출) */}
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                비밀번호 확인
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="비밀번호를 한번 더 입력하세요"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px 11px 36px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #E5E0DB',
                    outline: 'none',
                    fontSize: '12px',
                    fontFamily: 'var(--font-family)',
                    transition: 'border-color 0.3s'
                  }}
                />
              </div>
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            style={{
              marginTop: '10px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '12px 0',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 172, 153, 0.3)',
              transition: 'background-color 0.3s, transform 0.2s',
              fontFamily: 'var(--font-family)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-dark)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
          >
            {mode === 'login' ? '로그인하기' : '회원가입 완료'}
          </button>
        </form>

        {/* 모드 전환 링크 */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? (
            <>
              아직 계정이 없으신가요?{' '}
              <span
                onClick={handleToggleMode}
                style={{
                  color: 'var(--primary-dark)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginLeft: '4px'
                }}
              >
                회원가입하기
              </span>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{' '}
              <span
                onClick={handleToggleMode}
                style={{
                  color: 'var(--primary-dark)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginLeft: '4px'
                }}
              >
                로그인하기
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
