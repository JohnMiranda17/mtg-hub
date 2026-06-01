import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const TYPE_LABELS = {
  card_added:       { icon: '📦', label: 'added to collection' },
  trade_listed:     { icon: '🔄', label: 'listed for trade' },
  trade_completed:  { icon: '🤝', label: 'completed a trade' },
  price_alert:      { icon: '💰', label: 'price alert' },
};

function FeedItem({ activity }) {
  const meta = TYPE_LABELS[activity.type] ?? { icon: '📋', label: activity.type };
  const when = new Date(activity.created_at);
  const ago  = formatAgo(when);

  return (
    <div className="feed-item">
      <div className="feed-avatar-wrap">
        {activity.profiles?.avatar_url
          ? <img src={activity.profiles.avatar_url} className="feed-avatar" alt="" />
          : <div className="feed-avatar-placeholder">{(activity.profiles?.display_name ?? '?')[0]}</div>
        }
        <span className="feed-type-icon">{meta.icon}</span>
      </div>
      <div className="feed-body">
        <p className="feed-text">
          <Link to={`/profile/${activity.profiles?.username}`} className="feed-user">
            {activity.profiles?.display_name ?? activity.profiles?.username}
          </Link>
          {' '}{meta.label}
          {activity.card_name && (
            <> <strong className="feed-card">{activity.card_name}</strong>
              {activity.quantity > 1 && <span className="feed-qty"> ×{activity.quantity}</span>}
            </>
          )}
        </p>
        {activity.metadata?.note && (
          <p className="feed-note">{activity.metadata.note}</p>
        )}
        <span className="feed-time">{ago}</span>
      </div>
      {activity.card_image_uri && (
        <img src={activity.card_image_uri} alt={activity.card_name} className="feed-card-img" />
      )}
    </div>
  );
}

function formatAgo(date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Feed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(0);
  const PER_PAGE = 20;

  useEffect(() => {
    if (!user) return;
    loadFeed(0);
  }, [user]);

  async function loadFeed(p) {
    setLoading(true);
    const { data } = await supabase
      .from('activities')
      .select(`
        *,
        profiles(id, username, display_name, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .range(p * PER_PAGE, (p + 1) * PER_PAGE - 1);

    if (p === 0) setActivities(data ?? []);
    else setActivities(prev => [...prev, ...(data ?? [])]);
    setPage(p);
    setLoading(false);
  }

  if (!user) {
    return (
      <div className="page-wrap">
        <div className="empty-state">
          <p>Sign in to see your friends' activity.</p>
          <Link to="/login" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#4ac97a' }}>
        <h1>📰 Activity Feed</h1>
        <p>See what your friends are adding, trading, and watching.</p>
      </div>

      {loading && activities.length === 0 && <p className="printings-loading">Loading feed…</p>}

      {!loading && activities.length === 0 && (
        <div className="empty-state">
          <p>Nothing here yet.</p>
          <p style={{ marginTop: '.5rem', fontSize: '.85rem', color: 'var(--text-dim)' }}>
            Add some friends and start tracking your collection to see activity here.
          </p>
        </div>
      )}

      <div className="feed-list">
        {activities.map(a => <FeedItem key={a.id} activity={a} />)}
      </div>

      {activities.length > 0 && activities.length % PER_PAGE === 0 && (
        <button className="btn-secondary" style={{ margin: '1.5rem auto', display: 'block' }}
          onClick={() => loadFeed(page + 1)} disabled={loading}>
          {loading ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
}
