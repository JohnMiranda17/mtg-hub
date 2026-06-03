import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

function shortDate(iso) {
  const [, m, d] = iso.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
}

function fmt(v) {
  return v != null ? `$${Number(v).toFixed(2)}` : '—';
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="price-chart-tooltip">
      <div className="pct-date">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="pct-row" style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

export default function PriceChart({ history, range = '90d' }) {
  const days =
    range === '30d' ? 30  :
    range === '90d' ? 90  :
    range === '6m'  ? 180 : 365;

  const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  const points = history
    .filter(s => s.date >= cutoff)
    .map(s => ({
      label:     shortDate(s.date),
      price:     s.price     ?? null,
      priceFoil: s.priceFoil ?? null,
    }))
    .filter(p => p.price != null || p.priceFoil != null);

  const hasFoil = points.some(p => p.priceFoil != null);

  if (points.length < 2) {
    return (
      <div className="price-chart-wrap">
        <p className="price-chart-empty">
          Not enough snapshots for this range — keep browsing cards to build history.
          {points.length === 1 && ` (1 snapshot recorded)`}
        </p>
      </div>
    );
  }

  const allPrices = points.flatMap(p => [p.price, hasFoil ? p.priceFoil : null].filter(Boolean));
  const minY = Math.floor(Math.min(...allPrices) * 0.9 * 100) / 100;
  const maxY = Math.ceil(Math.max(...allPrices) * 1.1 * 100) / 100;

  const first = points[0].price ?? points[0].priceFoil;
  const last  = points[points.length - 1].price ?? points[points.length - 1].priceFoil;
  const delta = last - first;
  const deltaPct = first ? ((delta / first) * 100).toFixed(1) : '0.0';
  const trending = delta > 0.01 ? 'up' : delta < -0.01 ? 'down' : 'flat';

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
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={points} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.07)" />
          <XAxis
            dataKey="label"
            tick={{ fill: 'rgba(255,255,255,.45)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[minY, maxY]}
            tickFormatter={v => `$${v.toFixed(2)}`}
            tick={{ fill: 'rgba(255,255,255,.45)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          {hasFoil && <Legend wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,.55)' }} />}
          <Line
            type="monotone"
            dataKey="price"
            name="Normal"
            stroke="#4ac97a"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          {hasFoil && (
            <Line
              type="monotone"
              dataKey="priceFoil"
              name="Foil"
              stroke="#c9a84c"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
