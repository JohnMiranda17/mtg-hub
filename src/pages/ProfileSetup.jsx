import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function ProfileSetup() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername]         = useState('');
  const [displayName, setDisplayName]   = useState('');
  const [isPublic, setIsPublic]         = useState(false);
  const [checking, setChecking]         = useState(false);
  const [usernameOk, setUsernameOk]     = useState(null); // null | true | false
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState('');

  const usernameValid = /^[a-z0-9_]{3,20}$/.test(username);

  async function checkUsername(val) {
    const clean = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(clean);
    setUsernameOk(null);
    if (!clean || clean.length < 3) return;
    setChecking(true);
    const { data } = await supabase.from('profiles').select('id').eq('username', clean).neq('id', user.id);
    setUsernameOk(data?.length === 0);
    setChecking(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!usernameOk || !usernameValid) return;
    setSaving(true); setError('');
    try {
      await updateProfile({
        username,
        display_name: displayName || username,
        is_public:    isPublic,
      });
      navigate('/');
    } catch (err) {
      setError(err.message ?? 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-wrap auth-page">
      <div className="auth-card">
        <div className="auth-logo">🃏</div>
        <h1 className="auth-title">Set up your profile</h1>
        <p className="auth-sub">Choose a username to get started. You can change these later.</p>

        {error && <p className="form-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSave}>
          <label className="auth-label">
            Username <span className="auth-hint">(3–20 chars, letters/numbers/underscore)</span>
            <div className="username-input-wrap">
              <input type="text" className={`auth-input username-input${usernameOk === false ? ' input-error' : usernameOk ? ' input-ok' : ''}`}
                value={username} onChange={e => checkUsername(e.target.value)}
                maxLength={20} placeholder="your_username" />
              <span className="username-status">
                {checking ? '…' : usernameOk === true ? '✓' : usernameOk === false ? '✗ taken' : ''}
              </span>
            </div>
          </label>

          <label className="auth-label">Display name
            <input type="text" className="auth-input" value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your Name (optional)" maxLength={40} />
          </label>

          <label className="foil-label profile-public-toggle">
            <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            <span>
              Public profile — anyone can follow me and see my collection
              {isPublic && <span className="public-badge"> (Public)</span>}
            </span>
          </label>

          <button type="submit" className="btn-primary auth-submit"
            disabled={saving || !usernameOk || !usernameValid}>
            {saving ? 'Saving…' : 'Save Profile & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
