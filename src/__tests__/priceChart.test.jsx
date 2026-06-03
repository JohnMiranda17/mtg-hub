// Tests for the Recharts-based PriceChart component.
// PriceChart accepts a history array of { date, price, priceFoil } snapshots
// and a range string ('30d' | '90d' | '6m' | '1yr'). It filters the history
// to the selected window and renders a Recharts LineChart.

import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PriceChart from '../components/PriceChart';

// Recharts' ResponsiveContainer uses `new ResizeObserver(...)`.
// jsdom doesn't ship one, so provide a stub class.
global.ResizeObserver = class ResizeObserver {
  observe()    {}
  unobserve()  {}
  disconnect() {}
};

// Helper — builds history entries spaced `days` apart from today.
function makeHistory(count, priceVal = 2.5, foilVal = null) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.now() - (count - 1 - i) * 86400000);
    return {
      date:      d.toISOString().slice(0, 10),
      price:     priceVal,
      priceFoil: foilVal,
    };
  });
}

describe('PriceChart', () => {
  // With fewer than 2 points no chart can be drawn. Expected: fallback message.
  test('shows empty message when fewer than 2 points in range', () => {
    render(<PriceChart history={[]} range="90d" />);
    expect(screen.getByText(/not enough snapshots/i)).toBeInTheDocument();
  });

  // With a single snapshot in range the same fallback should appear.
  // Expected: "1 snapshot recorded" appended to fallback text.
  test('shows snapshot count hint when exactly 1 point exists', () => {
    const history = makeHistory(1);
    render(<PriceChart history={history} range="90d" />);
    expect(screen.getByText(/1 snapshot recorded/i)).toBeInTheDocument();
  });

  // With 2+ points in range the chart wrapper should render (Recharts svg).
  // Expected: .price-chart-wrap is in the DOM; no fallback text shown.
  test('renders chart container when 2+ points are in range', () => {
    const history = makeHistory(5);
    const { container } = render(<PriceChart history={history} range="90d" />);
    expect(container.querySelector('.price-chart-wrap')).not.toBeNull();
    expect(screen.queryByText(/not enough snapshots/i)).toBeNull();
  });

  // The component should display a snapshot count in the chart header.
  // Expected: "5 snapshots" text is visible.
  test('displays snapshot count in header', () => {
    const history = makeHistory(5);
    render(<PriceChart history={history} range="90d" />);
    expect(screen.getByText(/5 snapshots/i)).toBeInTheDocument();
  });

  // Range filtering: history entries older than the selected window should
  // be excluded. With 60 entries, filtering to 30d should leave ~30 points;
  // the component should still render (not show the fallback).
  // Expected: chart renders, not the empty state.
  test('filters history to the selected range window', () => {
    const history = makeHistory(60); // 60 days of data
    const { container } = render(<PriceChart history={history} range="30d" />);
    expect(container.querySelector('.price-chart-wrap')).not.toBeNull();
    expect(screen.queryByText(/not enough snapshots/i)).toBeNull();
  });

  // When ALL history entries fall outside the selected range the fallback
  // should appear because fewer than 2 qualifying points exist.
  // Expected: empty message shown.
  test('shows empty state when all entries are older than the range', () => {
    // Make entries that are 400 days old, then pick the 1yr (365d) range.
    const old = Array.from({ length: 5 }, (_, i) => ({
      date:  new Date(Date.now() - (400 + i) * 86400000).toISOString().slice(0, 10),
      price: 1.0,
      priceFoil: null,
    }));
    render(<PriceChart history={old} range="1yr" />);
    expect(screen.getByText(/not enough snapshots/i)).toBeInTheDocument();
  });

  // Trend badge: price going up should show an up arrow and green-ish badge.
  // Expected: "▲" character is rendered.
  test('shows upward trend badge when price increased', () => {
    const history = [
      { date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), price: 1.00, priceFoil: null },
      { date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10), price: 2.00, priceFoil: null },
    ];
    render(<PriceChart history={history} range="30d" />);
    expect(screen.getByText(/▲/)).toBeInTheDocument();
  });

  // Trend badge: price going down should show a down arrow.
  // Expected: "▼" character is rendered.
  test('shows downward trend badge when price decreased', () => {
    const history = [
      { date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), price: 5.00, priceFoil: null },
      { date: new Date(Date.now() - 1 * 86400000).toISOString().slice(0, 10), price: 2.00, priceFoil: null },
    ];
    render(<PriceChart history={history} range="30d" />);
    expect(screen.getByText(/▼/)).toBeInTheDocument();
  });
});
