import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function Avatar({ profile, size = 40 }) {
  if (profile?.avatar_url) {
    return <img src={profile.avatar_url} alt={profile.username} className="friend-avatar" style={{ width: size, height: size }} />;
  }
  return (
    <div className="friend-avatar-placeholder" style={{ width: size, height: size }}>
      {(profile?.display_name ?? profile?.username ?? '?')[0].toUpperCase()}
    </div>
  );
}

function FriendRow({ connection, onAccept, onRemove }) {
  const them = connection.other_profile;
  const isPending = connection.status === 'pending';
  const isIncoming = isPending && connection.addressee_id === connection.viewer_id;

  return (
    <div className="friend-row">
      <Avatar profile={them} />
      <div className="friend-info">
        <Link to={`/profile/${them.username}`} className="friend-name">
          {them.display_name ?? them.username}
        </Link>
        <span className="friend-username">@{them.username}</span>
        {isPending && <span className="friend-badge">{isIncoming ? 'Wants to be friends' : 'Request sent'}</span>}
      </div>
      <div className="friend-actions">
        {isIncoming && (
          <button className="btn-primary" style={{ fontSize: '.82rem', padding: '.35rem .85rem' }}
            onClick={() => onAccept(connection.id)}>
            Accept
          </button>
        )}
        <button className="btn-danger-sm" onClick={() => onRemove(connection.id)}>
          {isPending ? 'Cancel' : 'Remove'}
        </button>
      </div>
    </div>
  );
}

export default function Friends() {
  const { user, profile } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching]     = useState(false);
  const [actionMsg, setActionMsg]     = useState('');

  useEffect(() => {
    if (!user) return;
    loadConnections();
  }, [user]);

  async function loadConnections() {
    setLoading(true);
    const { data } = await supabase
      .from('connections')
      .select(`
        id, status, requester_id, addressee_id,
        requester:profiles!connections_requester_id_fkey(id, username, display_name, avatar_url),
        addressee:profiles!connections_addressee_id_fkey(id, username, display_name, avatar_url)
      `)
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    const mapped = (data ?? []).map(c => ({
      ...c,
      viewer_id: user.id,
      other_profile: c.requester_id === user.id ? c.addressee : c.requester,
    }));
    setConnections(mapped);
    setLoading(false);
  }

  async function searchUsers(q) {
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, is_public')
      .ilike('username', `%${q}%`)
      .neq('id', user.id)
      .limit(10);
    setSearchResults(data ?? []);
    setSearching(false);
  }

  async function sendRequest(targetId) {
    await supabase.from('connections').insert({ requester_id: user.id, addressee_id: targetId, status: 'pending' });
    setActionMsg('Friend request sent!');
    setSearch(''); setSearchResults([]);
    loadConnections();
  }

  async function acceptRequest(connectionId) {
    await supabase.from('connections').update({ status: 'friend' }).eq('id', connectionId);
    loadConnections();
  }

  async function removeConnection(connectionId) {
    await supabase.from('connections').delete().eq('id', connectionId);
    loadConnections();
  }

  const friends  = connections.filter(c => c.status === 'friend');
  const pending  = connections.filter(c => c.status === 'pending');
  const incoming = pending.filter(c => c.addressee_id === user?.id);
  const outgoing = pending.filter(c => c.requester_id === user?.id);

  const existingIds = new Set(connections.map(c => c.other_profile?.id));

  if (!user) {
    return (
      <div className="page-wrap">
        <div className="empty-state">
          <p>Sign in to manage friends.</p>
          <Link to="/login" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#a06cd5' }}>
        <h1>👥 Friends</h1>
        <p>Manage your friends, see their collections and trade listings.</p>
      </div>

      {/* Search */}
      <div className="friends-search-wrap">
        <div className="search-box" style={{ maxWidth: 400 }}>
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by username…"
            value={search}
            onChange={e => { setSearch(e.target.value); searchUsers(e.target.value); }} />
          {searching && <span className="card-search-spinner">⟳</span>}
        </div>
        {actionMsg && <p style={{ color: '#4ac97a', fontSize: '.85rem', marginTop: '.5rem' }}>{actionMsg}</p>}
        {searchResults.length > 0 && (
          <div className="friends-search-results">
            {searchResults.map(p => (
              <div key={p.id} className="friend-search-row">
                <Avatar profile={p} size={32} />
                <div className="friend-info">
                  <span className="friend-name">{p.display_name ?? p.username}</span>
                  <span className="friend-username">@{p.username}</span>
                  {p.is_public && <span className="public-badge">Public</span>}
                </div>
                {existingIds.has(p.id)
                  ? <span style={{ color: 'var(--text-dim)', fontSize: '.8rem' }}>Already connected</span>
                  : <button className="btn-primary" style={{ fontSize: '.82rem', padding: '.35rem .85rem' }}
                      onClick={() => sendRequest(p.id)}>
                      Add Friend
                    </button>
                }
              </div>
            ))}
          </div>
        )}
      </div>

      {loading ? <p className="printings-loading">Loading…</p> : (
        <>
          {incoming.length > 0 && (
            <section className="friends-section">
              <h2 className="friends-section-title">Incoming Requests ({incoming.length})</h2>
              {incoming.map(c => (
                <FriendRow key={c.id} connection={c} onAccept={acceptRequest} onRemove={removeConnection} />
              ))}
            </section>
          )}

          <section className="friends-section">
            <h2 className="friends-section-title">Friends ({friends.length})</h2>
            {friends.length === 0
              ? <p className="board-none">No friends yet — search for users above.</p>
              : friends.map(c => (
                <FriendRow key={c.id} connection={c} onAccept={acceptRequest} onRemove={removeConnection} />
              ))
            }
          </section>

          {outgoing.length > 0 && (
            <section className="friends-section">
              <h2 className="friends-section-title">Sent Requests ({outgoing.length})</h2>
              {outgoing.map(c => (
                <FriendRow key={c.id} connection={c} onAccept={acceptRequest} onRemove={removeConnection} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
