// SVG price chart — recharts was removed because Rolldown (Vite 8) cannot
// correctly initialize its CommonJS module graph at runtime.

function fmt(v) {
  return v != null ? `$${Number(v).toFixed(2)}` : '—';
}

function shortDate(iso) {
  const [, m, d] = iso.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

const W = 460;
const H = 120;
const PAD = { top: 10, right: 10, bottom: 22, left: 46 };

export default function PriceChart({ history, range = '90d' }) {
  const days =
    range === '30d' ? 30  :
    range === '90d' ? 90  :
    range === '6m'  ? 180 : 365;

  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const raw    = history.filter(s => s.date >= cutoff);

  function pts(foil) {
    return raw
      .map(s => ({ date: s.date, price: foil ? (s.priceFoil ?? null) : (s.price ?? null) }))
      .filter(p => p.price != null);
  }

  const norm   = pts(false);
  const foil   = pts(true);
  const hasFoil = foil.length >= 2;
  const all    = [...norm, ...(hasFoil ? foil : [])];

  if (norm.length < 2) {
    return (
      <div className="price-chart-wrap">
        <p className="price-chart-empty">
          Not enough snapshots for this range — keep browsing cards to build history.
          {raw.length === 1 && ' (1 snapshot recorded)'}
        </p>
      </div>
    );
  }

  const prices   = all.map(p => p.price);
  const minP     = Math.min(...prices);
  const maxP     = Math.max(...prices);
  const span     = maxP - minP || 1;
  const innerW   = W - PAD.left - PAD.right;
  const innerH   = H - PAD.top  - PAD.bottom;

  function toX(i, len) { return PAD.left + (i / (len - 1)) * innerW; }
  function toY(p)      { return PAD.top  + innerH - ((p - minP) / span) * innerH; }

  function makePath(pts) {
    return pts.map((p, i) =>
      `${i === 0 ? 'M' : 'L'}${toX(i, pts.length).toFixed(1)},${toY(p.price).toFixed(1)}`
    ).join(' ');
  }

  function makeArea(pts, color) {
    const d = makePath(pts);
    const last = pts.length - 1;
    return (
      <>
        <path d={`${d} L${toX(last,pts.length).toFixed(1)},${(PAD.top+innerH).toFixed(1)} L${PAD.left},${(PAD.top+innerH).toFixed(1)} Z`}
          fill={color} fillOpacity="0.10" />
        <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        <circle cx={toX(0, pts.length)} cy={toY(pts[0].price)} r="3" fill={color} />
        <circle cx={toX(last, pts.length)} cy={toY(pts[last].price)} r="3" fill={color} />
      </>
    );
  }

  const delta    = norm[norm.length - 1].price - norm[0].price;
  const deltaPct = ((delta / norm[0].price) * 100).toFixed(1);
  const trending = delta > 0.01 ? 'up' : delta < -0.01 ? 'down' : 'flat';
  const normColor = '#4ac97a';
  const foilColor = '#c9a84c';

  return (
    <div className="price-chart-wrap">
      <div className="price-chart-header">
        <span className="price-chart-title">
          Price History ({norm.length} snapshots)
          {hasFoil && <span style={{ color: foilColor, marginLeft: '.5rem', fontSize: '.75rem' }}>· gold = foil</span>}
        </span>
        <span className={`price-trend-badge price-trend-${trending}`}>
          {trending === 'up' ? '▲' : trending === 'down' ? '▼' : '–'}
          {' '}{trending !== 'flat' ? `${Math.abs(deltaPct)}% since first view` : 'Stable'}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="price-chart-svg" preserveAspectRatio="none">
        {[0, 0.5, 1].map(t => {
          const y = PAD.top + innerH * (1 - t);
          const v = minP + span * t;
          return (
            <g key={t}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke="rgba(255,255,255,.07)" strokeWidth="1" />
              <text x={PAD.left - 4} y={y + 4} textAnchor="end"
                fontSize="9" fill="rgba(255,255,255,.45)">{fmt(v)}</text>
            </g>
          );
        })}
        {makeArea(norm, normColor)}
        {hasFoil && makeArea(foil, foilColor)}
        <text x={PAD.left}            y={H - 4} fontSize="9" fill="rgba(255,255,255,.45)">{shortDate(norm[0].date)}</text>
        <text x={W - PAD.right}       y={H - 4} fontSize="9" fill="rgba(255,255,255,.45)" textAnchor="end">{shortDate(norm[norm.length-1].date)}</text>
      </svg>
    </div>
  );
}
