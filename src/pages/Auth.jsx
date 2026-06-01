import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socialEnabled } from '../lib/supabase';

export default function AuthPage() {
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode]         = useState('signin');   // 'signin' | 'signup'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  if (!socialEnabled) {
    return (
      <div className="page-wrap auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Social features not configured</h1>
          <p className="auth-sub">
            Add your Supabase credentials to enable accounts, friends, and trading.
            See <code>supabase-schema.sql</code> and <code>GUIDE.md</code> for setup instructions.
          </p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Back to Hub
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(email, password);
        setSuccess('Check your email for a confirmation link, then sign in.');
        setMode('signin');
      }
    } catch (err) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider) {
    setOauthLoading(provider); setError('');
    try { await signInWithOAuth(provider); }
    catch (err) { setError(err.message ?? 'OAuth failed.'); setOauthLoading(''); }
  }

  return (
    <div className="page-wrap auth-page">
      <div className="auth-card">
        <div className="auth-logo">🃏</div>
        <h1 className="auth-title">MTG Hub</h1>
        <p className="auth-sub">
          {mode === 'signin' ? 'Sign in to access social features' : 'Create your account'}
        </p>

        <div className="auth-tabs">
          <button className={`auth-tab${mode === 'signin' ? ' auth-tab-active' : ''}`}
            onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}>
            Sign In
          </button>
          <button className={`auth-tab${mode === 'signup' ? ' auth-tab-active' : ''}`}
            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}>
            Create Account
          </button>
        </div>

        {/* OAuth buttons */}
        <div className="oauth-buttons">
          {['google', 'discord'].map(provider => (
            <button key={provider} className="oauth-btn"
              onClick={() => handleOAuth(provider)}
              disabled={!!oauthLoading}>
              {oauthLoading === provider ? '…' : (
                <>
                  <span className="oauth-icon">{provider === 'google' ? '🔵' : '🟣'}</span>
                  Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </>
              )}
            </button>
          ))}
        </div>

        <div className="auth-divider"><span>or use email</span></div>

        {error   && <p className="form-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">Email
            <input type="email" className="auth-input" value={email}
              onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label className="auth-label">Password
            <input type="password" className="auth-input" value={password}
              onChange={e => setPassword(e.target.value)} required minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
          </label>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? '…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-note">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-link" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}>
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
