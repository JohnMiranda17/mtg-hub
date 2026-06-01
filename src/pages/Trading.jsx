import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../utils/scryfall';

/* ── Offer modal ───────────────────────────────────────────────────────── */
function OfferModal({ listing, onClose }) {
  const { user } = useAuth();
  const [message, setMessage]         = useState('');
  const [cashOffer, setCashOffer]     = useState('');
  const [cardsText, setCardsText]     = useState('');
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);
  const [error, setError]             = useState('');

  async function sendOffer() {
    setSending(true); setError('');
    // Parse simple card list from textarea: "2 Lightning Bolt\n1 Counterspell"
    const offeredCards = cardsText.split('\n')
      .map(l => l.trim()).filter(Boolean)
      .map(l => {
        const m = l.match(/^(\d+)x?\s+(.+)/);
        return m ? { quantity: parseInt(m[1]), name: m[2].trim() } : null;
      }).filter(Boolean);

    const { error: err } = await supabase.from('trade_offers').insert({
      listing_id:    listing.id,
      offerer_id:    user.id,
      offered_cards: offeredCards,
      cash_offer:    cashOffer ? parseFloat(cashOffer) : null,
      message,
    });
    if (err) { setError(err.message); setSending(false); return; }
    setSent(true); setSending(false);
  }

  if (sent) {
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal">
          <div className="modal-header"><span className="modal-title">Offer Sent!</span></div>
          <div className="modal-body import-done">
            <p className="import-done-icon">✓</p>
            <p className="import-done-title">Your offer has been sent to {listing.profiles?.display_name ?? listing.profiles?.username}</p>
          </div>
          <div className="modal-footer"><button className="btn-primary" onClick={onClose}>Done</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Make an Offer — {listing.card_name}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ gap: '.85rem' }}>
          <p className="import-hint">
            Offering for: <strong>{listing.card_name}</strong> ({listing.condition}{listing.foil ? ', Foil' : ''})
            {listing.asking_price && <> · Listed at {formatPrice(listing.asking_price)}</>}
          </p>
          {listing.wants && <p className="import-hint">They want: <em>{listing.wants}</em></p>}
          {error && <p className="form-error">{error}</p>}
          <label className="auth-label" style={{ fontSize: '.85rem' }}>
            Cards you're offering (one per line, e.g. "2 Lightning Bolt")
            <textarea className="import-textarea" rows={6} value={cardsText}
              onChange={e => setCardsText(e.target.value)}
              placeholder={"2 Lightning Bolt\n1 Counterspell\n4 Force of Will"} />
          </label>
          <label className="auth-label" style={{ fontSize: '.85rem' }}>
            Cash to add (USD, optional)
            <input type="number" className="qty-input" min={0} step={0.01}
              value={cashOffer} onChange={e => setCashOffer(e.target.value)}
              placeholder="0.00" style={{ width: 100 }} />
          </label>
          <label className="auth-label" style={{ fontSize: '.85rem' }}>
            Message (optional)
            <textarea className="import-textarea" rows={3} value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Hey, interested in trading for this card…" />
          </label>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={sendOffer}
            disabled={sending || (!cardsText.trim() && !cashOffer)}>
            {sending ? 'Sending…' : 'Send Offer'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Listing card ──────────────────────────────────────────────────────── */
function ListingCard({ listing, isOwn, onRetract, onOffer }) {
  return (
    <div className="trade-listing-card">
      {listing.image_uri && (
        <img src={listing.image_uri} alt={listing.card_name} className="trade-listing-img" />
      )}
      <div className="trade-listing-info">
        <div className="trade-listing-name">{listing.card_name}</div>
        <div className="trade-listing-set">{listing.set_name}</div>
        <div className="trade-listing-meta">
          <span>{listing.condition}</span>
          {listing.foil && <span className="foil-badge foil-yes">✨ Foil</span>}
          {listing.quantity > 1 && <span>×{listing.quantity}</span>}
        </div>
        {listing.asking_price && (
          <div className="trade-listing-price">Asking {formatPrice(listing.asking_price)}</div>
        )}
        {listing.wants && <p className="trade-listing-wants">Wants: {listing.wants}</p>}
        {listing.notes && <p className="trade-listing-notes">{listing.notes}</p>}
        {!isOwn && listing.profiles && (
          <div className="trade-listing-owner">
            <Link to={`/profile/${listing.profiles.username}`}>
              @{listing.profiles.username}
            </Link>
          </div>
        )}
        <div className="trade-listing-actions">
          {isOwn
            ? <button className="btn-danger-sm" onClick={() => onRetract(listing.id)}>Retract</button>
            : <button className="btn-primary" style={{ fontSize: '.82rem' }} onClick={() => onOffer(listing)}>Make Offer</button>
          }
        </div>
      </div>
    </div>
  );
}

/* ── Incoming offer row ────────────────────────────────────────────────── */
function OfferRow({ offer, onAccept, onDecline }) {
  return (
    <div className="offer-row">
      <div className="offer-from">
        <strong>From @{offer.profiles?.username}</strong>
        {' '}for <strong>{offer.trade_listings?.card_name}</strong>
      </div>
      {offer.offered_cards?.length > 0 && (
        <div className="offer-cards">
          Offering: {offer.offered_cards.map(c => `${c.quantity}× ${c.name}`).join(', ')}
        </div>
      )}
      {offer.cash_offer && <div className="offer-cash">+ {formatPrice(offer.cash_offer)} cash</div>}
      {offer.message && <p className="offer-message">"{offer.message}"</p>}
      <div className="offer-actions">
        <button className="btn-primary" style={{ fontSize: '.82rem' }} onClick={() => onAccept(offer.id)}>Accept</button>
        <button className="btn-danger-sm" onClick={() => onDecline(offer.id)}>Decline</button>
      </div>
    </div>
  );
}

/* ── Trading page ──────────────────────────────────────────────────────── */
export default function Trading() {
  const { user } = useAuth();
  const [tab, setTab]             = useState('browse');  // 'browse' | 'mine' | 'offers'
  const [listings, setListings]   = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [offers, setOffers]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [offerTarget, setOfferTarget] = useState(null);
  const [offerCount, setOfferCount] = useState(0);

  useEffect(() => { if (user) loadAll(); }, [user]);

  async function loadAll() {
    setLoading(true);
    const [browsed, mined, offered] = await Promise.all([
      supabase.from('trade_listings').select('*, profiles(id, username, display_name)')
        .eq('status', 'available').neq('user_id', user?.id ?? '').order('created_at', { ascending: false }),
      supabase.from('trade_listings').select('*').eq('user_id', user?.id ?? '').order('created_at', { ascending: false }),
      supabase.from('trade_offers').select('*, profiles(id, username), trade_listings(card_name)')
        .eq('status', 'pending')
        .in('listing_id',
          // only get offers on MY listings — subquery workaround
          (await supabase.from('trade_listings').select('id').eq('user_id', user?.id ?? '')).data?.map(r => r.id) ?? []
        ),
    ]);
    setListings(browsed.data ?? []);
    setMyListings(mined.data ?? []);
    setOffers(offered.data ?? []);
    setOfferCount((offered.data ?? []).length);
    setLoading(false);
  }

  async function retractListing(id) {
    await supabase.from('trade_listings').update({ status: 'cancelled' }).eq('id', id);
    loadAll();
  }

  async function acceptOffer(offerId) {
    await supabase.from('trade_offers').update({ status: 'accepted' }).eq('id', offerId);
    loadAll();
  }

  async function declineOffer(offerId) {
    await supabase.from('trade_offers').update({ status: 'declined' }).eq('id', offerId);
    loadAll();
  }

  if (!user) {
    return (
      <div className="page-wrap">
        <div className="empty-state">
          <p>Sign in to browse and post trade listings.</p>
          <Link to="/login" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page-header" style={{ '--page-color': '#e0a030' }}>
        <h1>🔄 Trading</h1>
        <p>Browse friends' trade listings and manage your own. Mark cards "for trade" in your collection.</p>
      </div>

      <div className="modal-tabs" style={{ marginBottom: '1.25rem' }}>
        <button className={`modal-tab${tab === 'browse' ? ' modal-tab-active' : ''}`} onClick={() => setTab('browse')}>
          Browse ({listings.length})
        </button>
        <button className={`modal-tab${tab === 'mine' ? ' modal-tab-active' : ''}`} onClick={() => setTab('mine')}>
          My Listings ({myListings.filter(l => l.status === 'available').length})
        </button>
        <button className={`modal-tab${tab === 'offers' ? ' modal-tab-active' : ''}`} onClick={() => setTab('offers')}>
          Offers Received {offerCount > 0 && <span className="offer-badge">{offerCount}</span>}
        </button>
      </div>

      {loading ? <p className="printings-loading">Loading…</p> : (
        <>
          {tab === 'browse' && (
            listings.length === 0
              ? <div className="empty-state"><p>No trade listings from friends yet.</p><p style={{ fontSize: '.85rem', color: 'var(--text-dim)', marginTop: '.5rem' }}>Add friends and ask them to mark cards for trade in their collection.</p></div>
              : <div className="trade-listings-grid">
                  {listings.map(l => (
                    <ListingCard key={l.id} listing={l} isOwn={false} onOffer={setOfferTarget} />
                  ))}
                </div>
          )}

          {tab === 'mine' && (
            <>
              <p className="import-hint" style={{ marginBottom: '1rem' }}>
                To add cards here, go to your <Link to="/collection" style={{ color: 'var(--gold)' }}>Collection</Link> and toggle "For Trade" on any card.
              </p>
              {myListings.filter(l => l.status === 'available').length === 0
                ? <div className="empty-state"><p>No active listings. Mark cards as "for trade" in your collection.</p></div>
                : <div className="trade-listings-grid">
                    {myListings.filter(l => l.status === 'available').map(l => (
                      <ListingCard key={l.id} listing={l} isOwn={true} onRetract={retractListing} />
                    ))}
                  </div>
              }
            </>
          )}

          {tab === 'offers' && (
            offers.length === 0
              ? <div className="empty-state"><p>No pending offers on your listings.</p></div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  {offers.map(o => (
                    <OfferRow key={o.id} offer={o} onAccept={acceptOffer} onDecline={declineOffer} />
                  ))}
                </div>
          )}
        </>
      )}

      {offerTarget && (
        <OfferModal listing={offerTarget} onClose={() => { setOfferTarget(null); loadAll(); }} />
      )}
    </div>
  );
}
