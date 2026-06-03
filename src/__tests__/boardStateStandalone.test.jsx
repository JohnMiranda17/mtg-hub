// Verifies that Board State is accessible as a standalone route and that
// Helper no longer includes a Board State tab (it now lives at /board-state).

import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Helper from '../pages/Helper';

// Helper imports RulesChat which uses supabase and may do network calls.
// Stub it out so we only test the Helper tab structure.
vi.mock('../pages/RulesChat', () => ({ default: () => <div>RulesChat</div> }));
vi.mock('../lib/supabase', () => ({ supabase: null, socialEnabled: false }));
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, profile: null, loading: false, profileComplete: true }),
  AuthProvider: ({ children }) => children,
}));

describe('Helper — Board State tab removed', () => {
  // Board State was moved to its own /board-state route. The Helper tab bar
  // should no longer include a "Board State" button.
  test('does not render a Board State tab', () => {
    render(<Helper />);
    // Expected: no button with text matching "Board State" in the tab bar
    const tabs = screen.queryAllByRole('button', { name: /board state/i });
    expect(tabs).toHaveLength(0);
  });

  // The remaining tabs should still be present after the removal.
  test('still renders Keywords, Turn Order, and Rules AI tabs', () => {
    render(<Helper />);
    expect(screen.getByRole('button', { name: /keywords/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /turn order/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rules ai/i })).toBeInTheDocument();
  });
});
