import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Please enter a valid email address';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError('');
    try {
      await signup(form.name.trim(), form.email, form.password);
      setSuccessPopup(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('already registered')) {
        setApiError('This email is already registered. Please login instead.');
      } else {
        setApiError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div className="grain-overlay" />
      <div className="dot-grid" />

      {successPopup && (
        <div style={s.popupOverlay}>
          <div style={s.popup}>
            <div style={s.popupIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 style={s.popupTitle}>Account Created</h3>
            <p style={s.popupSub}>Redirecting to dashboard...</p>
            <div style={s.popupBar}><div style={s.popupBarFill} /></div>
          </div>
        </div>
      )}

      <main style={s.main} className="auth-main">
        <div style={s.container} className="auth-container">
          <div style={s.brandHeader} className="auth-brand-header">
            <h1 style={s.brandName} className="auth-brand-name">NEXUSOS</h1>
            <p style={s.brandSub}>Create your account to get started</p>
          </div>

          <div style={s.card}>
            <div style={s.statusBar}><div style={s.statusBarFill} /></div>

            <div style={s.cardInner} className="auth-card-inner">
              <h2 style={s.cardTitle} className="auth-card-title">Create Account</h2>
              <p style={s.cardSub} className="auth-card-sub">Fill in your details below</p>

              {apiError && (
                <div style={s.apiError}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="16.5" r="1" fill="#ef4444"/>
                  </svg>
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate style={s.form}>
                <div style={s.field}>
                  <label style={s.label}>
                    <span>FULL NAME</span>
                    <span style={s.labelTag}>REQUIRED</span>
                  </label>
                  <div style={s.inputWrap}>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="auth-input"
                      style={{ ...s.input, ...(errors.name ? s.inputErr : {}) }}
                      autoComplete="name"
                    />
                    <span style={s.inputIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/></svg>
                    </span>
                  </div>
                  {errors.name && <span style={s.errMsg}>{errors.name}</span>}
                </div>

                <div style={s.field}>
                  <label style={s.label}>
                    <span>EMAIL</span>
                    <span style={s.labelTag}>REQUIRED</span>
                  </label>
                  <div style={s.inputWrap}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="auth-input"
                      style={{ ...s.input, ...(errors.email ? s.inputErr : {}) }}
                      autoComplete="email"
                    />
                    <span style={s.inputIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="0" stroke="currentColor" strokeWidth="1.8"/><path d="M22 7l-10 7L2 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>
                  {errors.email && <span style={s.errMsg}>{errors.email}</span>}
                </div>

                <div style={s.field}>
                  <label style={s.label}>
                    <span>PASSWORD</span>
                    <span style={s.labelTag}>MIN 6 CHARS</span>
                  </label>
                  <div style={s.inputWrap}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      className="auth-input"
                      style={{ ...s.input, ...(errors.password ? s.inputErr : {}), paddingRight: 40 }}
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)} style={s.eyeBtn} tabIndex={-1}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        {showPassword
                          ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>
                          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></>
                        }
                      </svg>
                    </button>
                  </div>
                  {errors.password && <span style={s.errMsg}>{errors.password}</span>}
                </div>

                <div style={s.field}>
                  <label style={s.label}>
                    <span>CONFIRM PASSWORD</span>
                    <span style={s.labelTag}>REQUIRED</span>
                  </label>
                  <div style={s.inputWrap}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className="auth-input"
                      style={{ ...s.input, ...(errors.confirmPassword ? s.inputErr : {}) }}
                      autoComplete="new-password"
                    />
                    <span style={s.inputIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 116 0v3H9z" stroke="currentColor" strokeWidth="1.5"/></svg>
                    </span>
                  </div>
                  {errors.confirmPassword && <span style={s.errMsg}>{errors.confirmPassword}</span>}
                </div>

                <div style={{ paddingTop: 12 }}>
                  <button type="submit" disabled={loading} className="auth-submit-btn" style={{ ...s.submitBtn, ...(loading ? { opacity: 0.6 } : {}) }}>
                    {loading ? (
                      <><div className="spinner" style={{ width: 16, height: 16 }} /> Creating account...</>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div style={s.loginRow} className="auth-signup-row">
                <span style={s.loginText} className="auth-signup-text">Already have an account?</span>
                <Link to="/login" style={s.loginLink} className="auth-signup-link">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#131313',
    position: 'relative',
    overflow: 'hidden',
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: 24,
    position: 'relative',
    zIndex: 10,
  },
  container: { width: '100%', maxWidth: 440 },
  brandHeader: { textAlign: 'center', marginBottom: 40 },
  brandName: {
    fontFamily: 'var(--font-headline)', fontWeight: 900,
    fontSize: 36, letterSpacing: '-0.04em',
    color: 'var(--text)', marginBottom: 6,
  },
  brandSub: {
    fontFamily: 'var(--font-label)', fontSize: 13,
    color: 'var(--text-3)', letterSpacing: '0.02em',
  },
  card: {
    background: '#1b1b1b',
    padding: 0,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  statusBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 3, background: '#353535',
  },
  statusBarFill: {
    height: '100%', width: '33%',
    background: 'var(--accent)',
  },
  cardInner: { padding: '40px 40px 32px' },
  cardTitle: {
    fontFamily: 'var(--font-headline)', fontWeight: 700,
    fontSize: 22, color: 'var(--text)',
    letterSpacing: '-0.02em', marginBottom: 4,
  },
  cardSub: {
    fontFamily: 'var(--font-label)', fontSize: 13,
    color: 'var(--text-3)', marginBottom: 28,
  },
  apiError: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    padding: '10px 14px', marginBottom: 20,
    color: '#fca5a5', fontSize: 13,
    fontFamily: 'var(--font-label)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontFamily: 'var(--font-label)', fontSize: 10,
    fontWeight: 700, color: 'var(--text-2)',
    letterSpacing: '0.18em',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelTag: {
    color: 'var(--accent)', opacity: 0.5,
    fontFamily: 'var(--font-label)', fontSize: 10,
    fontWeight: 700, letterSpacing: '0.12em',
  },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%',
    background: '#0e0e0e',
    border: 'none',
    borderBottom: '2px solid #353535',
    padding: '12px 14px',
    color: 'var(--text)',
    fontSize: 14,
    fontFamily: 'var(--font-label)',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputErr: { borderBottomColor: 'rgba(239,68,68,0.6)' },
  inputIcon: {
    position: 'absolute', right: 12, top: '50%',
    transform: 'translateY(-50%)',
    color: '#353535', display: 'flex',
    pointerEvents: 'none',
  },
  eyeBtn: {
    position: 'absolute', right: 12, top: '50%',
    transform: 'translateY(-50%)',
    background: 'none', border: 'none',
    cursor: 'pointer', color: '#353535',
    padding: 2, display: 'flex',
  },
  errMsg: {
    color: '#f87171', fontSize: 11,
    fontFamily: 'var(--font-label)',
  },
  submitBtn: {
    width: '100%',
    background: 'var(--accent)',
    border: 'none',
    color: '#fff',
    fontFamily: 'var(--font-headline)', fontWeight: 900,
    fontSize: 14, letterSpacing: '-0.02em',
    padding: '16px 24px',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    transition: 'background 0.2s, transform 0.1s',
  },
  loginRow: {
    marginTop: 24, paddingTop: 20,
    borderTop: '1px solid rgba(67,70,85,0.15)',
    textAlign: 'center',
    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  loginText: {
    fontFamily: 'var(--font-label)', fontSize: 13,
    color: 'var(--text-3)',
  },
  loginLink: {
    fontFamily: 'var(--font-headline)', fontSize: 13,
    color: 'var(--accent)', fontWeight: 700,
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  },
  popupOverlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9000,
    animation: 'fadeIn 0.2s ease',
  },
  popup: {
    background: '#1b1b1b',
    border: '1px solid var(--border)',
    padding: '40px 48px',
    textAlign: 'center',
    maxWidth: 360, width: '90%',
    animation: 'fadeInUp 0.3s ease',
  },
  popupIcon: {
    width: 56, height: 56,
    background: 'rgba(34,197,94,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
    border: '1px solid rgba(34,197,94,0.2)',
  },
  popupTitle: {
    fontFamily: 'var(--font-headline)', fontWeight: 700,
    fontSize: 20, color: 'var(--text)',
    marginBottom: 6,
  },
  popupSub: {
    fontFamily: 'var(--font-label)', fontSize: 13,
    color: 'var(--text-3)', marginBottom: 20,
  },
  popupBar: {
    height: 3, background: '#353535',
    overflow: 'hidden',
  },
  popupBarFill: {
    height: '100%', background: '#22c55e',
    animation: 'popupProgress 1.5s ease forwards',
  },
};
