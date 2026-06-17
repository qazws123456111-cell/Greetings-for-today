import React, { useState } from 'react';
import { useAntigravity } from '../store/AntigravityStore';
import { Lock, User, Sparkles, AlertCircle, Heart, Search, KeyRound, ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'findId' | 'resetPassword';

export const Auth: React.FC = () => {
  const { login, signup } = useAntigravity();
  
  const [mode, setMode] = useState<AuthMode>('login');
  
  // 로그인/회원가입 필드
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  // 아이디 찾기 / 비번 재설정 필드
  const [findName, setFindName] = useState('');
  const [foundId, setFoundId] = useState<string | null>(null);
  const [resetId, setResetId] = useState('');
  const [resetName, setResetName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'input' | 'done'>('input');
  
  // 에러 및 알림 메시지
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setId(''); setPassword(''); setConfirmPassword(''); setName('');
    setFindName(''); setFoundId(null);
    setResetId(''); setResetName(''); setNewPassword(''); setConfirmNewPassword('');
    setResetStep('input');
    setErrorMessage(''); setSuccessMessage('');
  };

  const switchMode = (m: AuthMode) => {
    setMode(m);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); setSuccessMessage('');

    if (!id.trim() || !password.trim()) {
      setErrorMessage('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) { setErrorMessage('이름을 입력해 주세요.'); return; }
      if (password !== confirmPassword) { setErrorMessage('비밀번호가 일치하지 않습니다.'); return; }
      if (password.length < 4) { setErrorMessage('비밀번호는 최소 4글자 이상이어야 합니다.'); return; }
      const res = signup(id, password, name);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    } else {
      const res = login(id, password);
      if (!res.success) setErrorMessage(res.message);
    }
  };

  // 아이디 찾기 로직 (가상 DB에서 이름으로 검색)
  const handleFindId = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); setFoundId(null);
    if (!findName.trim()) { setErrorMessage('이름을 입력해 주세요.'); return; }

    const usersRaw = localStorage.getItem('today_hello_users_v3');
    const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
    const matched = users.find(u => u.name === findName.trim());

    if (!matched) {
      setErrorMessage('해당 이름으로 가입된 계정을 찾을 수 없습니다.');
    } else {
      // 아이디 일부 마스킹: abcde → a***e
      const raw = matched.id as string;
      const maskedId = raw.length <= 2
        ? raw[0] + '*'.repeat(raw.length - 1)
        : raw[0] + '*'.repeat(raw.length - 2) + raw[raw.length - 1];
      setFoundId(maskedId);
    }
  };

  // 비밀번호 재설정 로직 (가상 DB 업데이트)
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!resetId.trim() || !resetName.trim()) { setErrorMessage('아이디와 이름을 모두 입력해 주세요.'); return; }
    if (newPassword.length < 4) { setErrorMessage('새 비밀번호는 최소 4글자 이상이어야 합니다.'); return; }
    if (newPassword !== confirmNewPassword) { setErrorMessage('새 비밀번호가 일치하지 않습니다.'); return; }

    const usersRaw = localStorage.getItem('today_hello_users_v3');
    const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];
    const idx = users.findIndex(u => u.id === resetId.trim() && u.name === resetName.trim());

    if (idx === -1) {
      setErrorMessage('아이디 또는 이름이 일치하지 않습니다.');
    } else {
      users[idx].password = newPassword;
      localStorage.setItem('today_hello_users_v3', JSON.stringify(users));
      setResetStep('done');
    }
  };

  // ─── 공통 스타일 ───────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 12px 11px 36px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid #E5E0DB',
    outline: 'none',
    fontSize: '12px',
    fontFamily: 'var(--font-family)',
    transition: 'border-color 0.3s'
  };
  const inputPlainStyle: React.CSSProperties = { ...inputStyle, paddingLeft: '12px' };
  const linkStyle: React.CSSProperties = {
    color: 'var(--primary-dark)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline'
  };

  const renderTitle = () => {
    switch (mode) {
      case 'findId': return { icon: <Search size={24} />, title: '아이디 찾기', sub: '가입 시 입력한 이름으로 아이디를 확인합니다.' };
      case 'resetPassword': return { icon: <KeyRound size={24} />, title: '비밀번호 재설정', sub: '아이디와 이름으로 본인 확인 후 재설정합니다.' };
      case 'signup': return { icon: <Sparkles size={24} />, title: '오늘의 안부', sub: '새로운 마음 연결의 시작을 환영합니다.' };
      default: return { icon: <Heart size={24} fill="var(--primary)" stroke="none" style={{ animation: 'pulse 2s infinite' }} />, title: '오늘의 안부', sub: '소중한 인연들과 따뜻한 연락을 시작해 보세요.' };
    }
  };

  const { icon, title, sub } = renderTitle();

  return (
    <div className="auth-container" style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      minHeight: '100%', padding: '24px',
      background: 'linear-gradient(135deg, #FAF8F5 0%, #FFF0F0 100%)',
      fontFamily: 'var(--font-family)', position: 'relative', overflow: 'hidden'
    }}>
      {/* 뒷배경 장식 */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '48px', opacity: 0.15, animation: 'bounce 3s infinite ease-in-out' }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '15%', right: '8%', fontSize: '40px', opacity: 0.15, animation: 'bounce 4s infinite ease-in-out 1s' }}>💌</div>
      
      <div className="auth-card" style={{
        width: '100%', maxWidth: '360px', backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)', padding: '32px 24px',
        boxShadow: 'var(--shadow-cozy)', border: '1px solid rgba(255, 172, 153, 0.2)', zIndex: 1,
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* 뒤로가기 (서브 모드) */}
        {(mode === 'findId' || mode === 'resetPassword') && (
          <button onClick={() => switchMode('login')} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', border: 'none', background: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={14} />
            로그인으로 돌아가기
          </button>
        )}

        {/* 상단 타이틀 */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '54px', height: '54px', borderRadius: 'var(--radius-round)', backgroundColor: 'var(--primary-light)', marginBottom: '12px' }}>
            {icon}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>{title}</h2>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{sub}</p>
        </div>

        {/* 에러 메시지 */}
        {errorMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFF0F0', border: '1px solid #FFC0C0', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: '16px', color: '#D32F2F', fontSize: '11px' }}>
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-md)', padding: '10px 14px', marginBottom: '16px', color: 'var(--accent-dark)', fontSize: '11px' }}>
            <Sparkles size={14} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ─── 아이디 찾기 화면 ─── */}
        {mode === 'findId' && (
          <div>
            {foundId ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{findName}</strong>님의 아이디는
                </p>
                <div style={{ background: '#FFF9EB', border: '1px solid #FFE6C0', borderRadius: '12px', padding: '14px', fontSize: '18px', fontWeight: 800, letterSpacing: '2px', color: 'var(--primary-dark)', marginBottom: '20px' }}>
                  {foundId}
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '20px' }}>보안을 위해 일부 문자가 마스킹되었습니다.</p>
                <button onClick={() => switchMode('login')} style={{ width: '100%', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                  로그인하러 가기
                </button>
              </div>
            ) : (
              <form onSubmit={handleFindId} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>가입 시 등록한 이름</label>
                  <input type="text" placeholder="이름을 입력하세요" value={findName} onChange={e => setFindName(e.target.value)} style={inputPlainStyle} />
                </div>
                <button type="submit" style={{ marginTop: '6px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px 0', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                  아이디 찾기
                </button>
              </form>
            )}
          </div>
        )}

        {/* ─── 비밀번호 재설정 화면 ─── */}
        {mode === 'resetPassword' && (
          <div>
            {resetStep === 'done' ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '8px' }}>비밀번호 재설정 완료!</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                  새 비밀번호로 설정되었습니다.<br />로그인 화면에서 새 비밀번호를 사용해 주세요.
                </p>
                <button onClick={() => switchMode('login')} style={{ width: '100%', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                  로그인하러 가기
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>아이디</label>
                  <input type="text" placeholder="가입한 아이디를 입력하세요" value={resetId} onChange={e => setResetId(e.target.value)} style={inputPlainStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>이름 (본인 확인)</label>
                  <input type="text" placeholder="가입 시 등록한 이름을 입력하세요" value={resetName} onChange={e => setResetName(e.target.value)} style={inputPlainStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>새 비밀번호</label>
                  <input type="password" placeholder="새 비밀번호 (4자 이상)" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputPlainStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>새 비밀번호 확인</label>
                  <input type="password" placeholder="새 비밀번호를 한번 더 입력하세요" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} style={inputPlainStyle} />
                </div>
                <button type="submit" style={{ marginTop: '6px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px 0', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                  비밀번호 재설정하기
                </button>
              </form>
            )}
          </div>
        )}

        {/* ─── 로그인 / 회원가입 화면 ─── */}
        {(mode === 'login' || mode === 'signup') && (
          <>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* 아이디 */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>아이디</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="아이디를 입력하세요" value={id} onChange={e => setId(e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* 이름 (회원가입) */}
              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>이름</label>
                  <div style={{ position: 'relative' }}>
                    <Sparkles size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="본인의 이름을 입력하세요" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                  </div>
                </div>
              )}

              {/* 비밀번호 */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>비밀번호</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
                </div>
              </div>

              {/* 비밀번호 확인 (회원가입) */}
              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>비밀번호 확인</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="password" placeholder="비밀번호를 한번 더 입력하세요" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} />
                  </div>
                </div>
              )}

              {/* 아이디 찾기 / 비번 재설정 링크 (로그인 모드만) */}
              {mode === 'login' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '-4px' }}>
                  <span onClick={() => switchMode('findId')} style={{ ...linkStyle, fontSize: '10px' }}>
                    아이디 찾기
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>|</span>
                  <span onClick={() => switchMode('resetPassword')} style={{ ...linkStyle, fontSize: '10px' }}>
                    비밀번호 재설정
                  </span>
                </div>
              )}

              <button
                type="submit"
                style={{ marginTop: '10px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px 0', fontSize: '13px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(255, 172, 153, 0.3)', transition: 'background-color 0.3s, transform 0.2s', fontFamily: 'var(--font-family)' }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--primary-dark)')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--primary)')}
              >
                {mode === 'login' ? '로그인하기' : '회원가입 완료'}
              </button>
            </form>

            {/* 모드 전환 링크 */}
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              {mode === 'login' ? (
                <>아직 계정이 없으신가요?{' '}<span onClick={() => switchMode('signup')} style={linkStyle}>회원가입하기</span></>
              ) : (
                <>이미 계정이 있으신가요?{' '}<span onClick={() => switchMode('login')} style={linkStyle}>로그인하기</span></>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
