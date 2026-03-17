import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'not_registered') {
      setError('This email is not registered in the system. Contact your administrator.');
      setShowLoginModal(true);
    }
    axios.get('http://localhost:5000/auth/me', { withCredentials: true })
      .then(res => {
        const role = res.data.role;
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'officer') navigate('/officer/dashboard');
        else if (role === 'citizen') navigate('/citizen/dashboard');
      })
      .catch(() => setChecking(false));
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  if (checking) return null;

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: '#f1f5f9', minHeight: '100vh', width: '100vw'
    }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 60px', background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
          🏛️ WelfarePortal
        </div>
        <button onClick={() => setShowLoginModal(true)} style={{
          background: '#4f46e5', color: '#ffffff', border: 'none',
          padding: '12px 28px', borderRadius: '12px', fontWeight: '700',
          fontSize: '15px', cursor: 'pointer'
        }}>
          Sign In
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        textAlign: 'center', padding: '80px 40px 60px',
        maxWidth: '800px', margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-block', background: '#e0e7ff', color: '#4f46e5',
          padding: '8px 20px', borderRadius: '99px', fontSize: '14px',
          fontWeight: '700', marginBottom: '24px', letterSpacing: '0.5px'
        }}>
          GOVERNMENT OF INDIA
        </div>
        <h1 style={{
          fontSize: '52px', fontWeight: '900', color: '#0f172a',
          lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px'
        }}>
          Welfare Schemes,<br />
          <span style={{ color: '#4f46e5' }}>Simplified.</span>
        </h1>
        <p style={{
          fontSize: '18px', color: '#64748b', lineHeight: '1.7',
          marginBottom: '40px', maxWidth: '560px', margin: '0 auto 40px'
        }}>
          Apply for government welfare schemes, track your application status,
          and manage documents — all in one place.
        </p>
        <button onClick={() => setShowLoginModal(true)} style={{
          background: '#4f46e5', color: '#ffffff', border: 'none',
          padding: '18px 48px', borderRadius: '16px', fontWeight: '800',
          fontSize: '17px', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(79,70,229,0.3)'
        }}>
          Get Started →
        </button>
      </section>

      {/* FEATURES */}
      <section style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px', maxWidth: '1000px', margin: '60px auto',
        padding: '0 40px'
      }}>
        {[
          { icon: '📋', title: 'Browse Schemes', desc: 'Discover all active government welfare schemes you may be eligible for.' },
          { icon: '📊', title: 'Track Applications', desc: 'Real-time status updates on every application you submit.' },
          { icon: '🔒', title: 'Secure & Private', desc: 'Google OAuth login ensures your data is always protected.' }
        ].map(f => (
          <div key={f.title} style={{
            background: '#ffffff', borderRadius: '20px', padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
              {f.title}
            </h3>
            <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowLoginModal(false); setError(''); }}>
          <div style={{
            background: '#ffffff', borderRadius: '28px', padding: '50px 40px',
            width: '100%', maxWidth: '400px', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }} onClick={e => e.stopPropagation()}>

            <div style={{
              width: '56px', height: '56px', background: '#4f46e5',
              borderRadius: '16px', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px'
            }}>🏛️</div>

            <h2 style={{
              fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '6px'
            }}>Welcome Back</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px' }}>
              Sign in to access your portal
            </p>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '12px', padding: '12px 16px',
                color: '#dc2626', fontSize: '13px', marginBottom: '20px', fontWeight: '500'
              }}>
                {error}
              </div>
            )}

            <button onClick={handleGoogleLogin} style={{
              width: '100%', padding: '15px 24px',
              background: '#ffffff', border: '2px solid #e2e8f0',
              borderRadius: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '12px', fontSize: '15px', fontWeight: '700', color: '#0f172a',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign in with Google
            </button>

            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '20px' }}>
              Restricted to registered users only
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;