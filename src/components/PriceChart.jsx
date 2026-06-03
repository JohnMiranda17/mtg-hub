// SVG mini price chart built from locally-stored daily snapshots.
// Points accumulate each time the user views the card's price page.

function fmt(v) {
  if (v == null) return '—';
  return `$${Number(v).toFixed(2)}`;
}

function shortDate(iso) {
  const [, m, d] = iso.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

const W = 400;
const H = 100;
const PAD = { top: 8, right: 8, bottom: 20, left: 42 };

export default function PriceChart({ history, range = '90d' }) {
  const days =
    range === '30d' ? 30  :
    range === '90d' ? 90  :
    range === '6m'  ? 180 : 365;

  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  const allPoints = history.filter(s => s.date >= cutoff);

  function makePoints(foil) {
    return allPoints
      .map(s => ({ date: s.date, price: foil ? (s.priceFoil ?? s.price) : (s.price ?? s.priceFoil) }))
      .filter(p => p.price != null);
  }

  const points    = makePoints(false);
  const foilPts   = makePoints(true);
  const hasFoil   = allPoints.some(s => s.priceFoil != null);
  const primary   = points.length >= 2 ? points : null;
  const secondary = hasFoil && foilPts.length >= 2 ? foilPts : null;

  if (!primary) {
    return (
      <div className="price-chart-wrap">
        <p className="price-chart-empty">
          Not enough snapshots for this range — keep browsing cards to build history.
          {allPoints.length === 1 && ` (1 snapshot recorded)`}
        </p>
      </div>
    );
  }

  const allPrices  = [...points, ...(secondary ?? [])].map(p => p.price);
  const minP       = Math.min(...allPrices);
  const maxP       = Math.max(...allPrices);
  const priceRange = maxP - minP || 1;
  const innerW     = W - PAD.left - PAD.right;
  const innerH     = H - PAD.top - PAD.bottom;

  function toX(i, len) { return PAD.left + (i / (len - 1)) * innerW; }
  function toY(p) { return PAD.top + innerH - ((p - minP) / priceRange) * innerH; }

  function makePath(pts, color) {
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(i, pts.length).toFixed(1)},${toY(p.price).toFixed(1)}`).join(' ');
    const first = pts[0].price;
    const last  = pts[pts.length - 1].price;
    const fill  = `${d} L${toX(pts.length-1,pts.length).toFixed(1)},${(PAD.top+innerH).toFixed(1)} L${PAD.left},${(PAD.top+innerH).toFixed(1)} Z`;
    return { d, fill, first, last, color };
  }

  const normalColor = '#4ac97a';
  const foilColor   = '#c9a84c';
  const norm = makePath(points, normalColor);
  const foil = secondary ? makePath(secondary, foilColor) : null;

  const delta    = norm.last - norm.first;
  const deltaPct = ((delta / norm.first) * 100).toFixed(1);
  const trending = delta > 0.01 ? 'up' : delta < -0.01 ? 'down' : 'flat';

  return (
    <div className="price-chart-wrap">
      <div className="price-chart-header">
        <span className="price-chart-title">Price History ({points.length} snapshots){foil ? ' · Foil shown in gold' : ''}</span>
        <span className={`price-trend-badge price-trend-${trending}`}>
          {trending === 'up' ? '▲' : trending === 'down' ? '▼' : '–'}
          {' '}{trending !== 'flat' ? `${Math.abs(deltaPct)}% since first view` : 'Stable'}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="price-chart-svg" preserveAspectRatio="none">
        {[0, 0.5, 1].map(t => {
          const y = PAD.top + innerH * (1 - t);
          const v = minP + priceRange * t;
          return (
            <g key={t}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,.07)" strokeWidth="1" />
              <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,.45)">{fmt(v)}</text>
            </g>
          );
        })}
        <path d={norm.d} fill="none" stroke={norm.color} strokeWidth="2" strokeLinejoin="round" />
        <path d={norm.fill} fill={norm.color} fillOpacity="0.08" />
        <circle cx={toX(0, points.length)} cy={toY(norm.first)} r="3" fill={norm.color} />
        <circle cx={toX(points.length-1, points.length)} cy={toY(norm.last)} r="3" fill={norm.color} />
        {foil && (
          <>
            <path d={foil.d} fill="none" stroke={foil.color} strokeWidth="1.5" strokeDasharray="4 2" strokeLinejoin="round" />
            <circle cx={toX(secondary.length-1, secondary.length)} cy={toY(foil.last)} r="3" fill={foil.color} />
          </>
        )}
        <text x={PAD.left} y={H - 4} fontSize="9" fill="rgba(255,255,255,.45)">{shortDate(points[0].date)}</text>
        <text x={W - PAD.right} y={H - 4} fontSize="9" fill="rgba(255,255,255,.45)" textAnchor="end">{shortDate(points[points.length-1].date)}</text>
      </svg>
    </div>
  );
}
