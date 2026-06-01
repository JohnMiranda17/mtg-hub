// SVG mini price chart built from locally-stored daily snapshots.
// Points accumulate each time the user views the card's price page.

const W = 400; // viewBox width
const H = 100; // viewBox height
const PAD = { top: 8, right: 8, bottom: 20, left: 42 };

function fmt(v) {
  if (v == null) return '—';
  return `$${Number(v).toFixed(2)}`;
}

function shortDate(iso) {
  const [, m, d] = iso.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

export default function PriceChart({ history, foil = false }) {
  // Use foil price when available and requested, fall back to normal
  const points = history
    .map(s => ({ date: s.date, price: foil ? (s.priceFoil ?? s.price) : (s.price ?? s.priceFoil) }))
    .filter(p => p.price != null);

  if (points.length < 2) {
    return (
      <div className="price-chart-wrap">
        <p className="price-chart-empty">
          Price history builds up as you view this card over time.
          {points.length === 1 && ` First snapshot: ${fmt(points[0].price)} on ${shortDate(points[0].date)}.`}
        </p>
      </div>
    );
  }

  const prices  = points.map(p => p.price);
  const minP    = Math.min(...prices);
  const maxP    = Math.max(...prices);
  const range   = maxP - minP || 1;
  const innerW  = W - PAD.left - PAD.right;
  const innerH  = H - PAD.top - PAD.bottom;

  function toX(i) { return PAD.left + (i / (points.length - 1)) * innerW; }
  function toY(p) { return PAD.top + innerH - ((p - minP) / range) * innerH; }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(p.price).toFixed(1)}`).join(' ');

  const first    = points[0].price;
  const last     = points[points.length - 1].price;
  const delta    = last - first;
  const deltaPct = ((delta / first) * 100).toFixed(1);
  const trending = delta > 0.01 ? 'up' : delta < -0.01 ? 'down' : 'flat';
  const lineColor = trending === 'up' ? '#4ac97a' : trending === 'down' ? '#e06060' : '#888';

  return (
    <div className="price-chart-wrap">
      <div className="price-chart-header">
        <span className="price-chart-title">Price History ({points.length} snapshots)</span>
        <span className={`price-trend-badge price-trend-${trending}`}>
          {trending === 'up' ? '▲' : trending === 'down' ? '▼' : '–'}
          {' '}
          {trending !== 'flat' ? `${Math.abs(deltaPct)}% since first view` : 'Stable'}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="price-chart-svg" preserveAspectRatio="none">
        {/* Y grid lines */}
        {[0, 0.5, 1].map(t => {
          const y = PAD.top + innerH * (1 - t);
          const v = minP + range * t;
          return (
            <g key={t}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke="rgba(255,255,255,.07)" strokeWidth="1" />
              <text x={PAD.left - 4} y={y + 4} textAnchor="end"
                fontSize="9" fill="rgba(255,255,255,.45)">{fmt(v)}</text>
            </g>
          );
        })}
        {/* Price line */}
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" />
        {/* Area fill */}
        <path d={`${pathD} L${toX(points.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${PAD.left},${(PAD.top + innerH).toFixed(1)} Z`}
          fill={lineColor} fillOpacity="0.08" />
        {/* Start + end dots */}
        <circle cx={toX(0)} cy={toY(first)} r="3" fill={lineColor} />
        <circle cx={toX(points.length - 1)} cy={toY(last)} r="3" fill={lineColor} />
        {/* X axis labels */}
        <text x={PAD.left} y={H - 4} fontSize="9" fill="rgba(255,255,255,.45)">{shortDate(points[0].date)}</text>
        <text x={W - PAD.right} y={H - 4} fontSize="9" fill="rgba(255,255,255,.45)" textAnchor="end">{shortDate(points[points.length - 1].date)}</text>
      </svg>
    </div>
  );
}
