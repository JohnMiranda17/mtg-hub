import { render, screen, fireEvent } from '@testing-library/react';
import TimingGuide from '../components/helper/TimingGuide';

describe('TimingGuide', () => {
  test('renders timing quick reference section', () => {
    render(<TimingGuide />);
    expect(screen.getByText('Timing Quick Reference')).toBeInTheDocument();
  });

  test('renders the three speed categories', () => {
    render(<TimingGuide />);
    expect(screen.getByText('Instant Speed')).toBeInTheDocument();
    expect(screen.getByText('Sorcery Speed')).toBeInTheDocument();
    expect(screen.getByText('Land Plays')).toBeInTheDocument();
  });

  test('renders how priority works section', () => {
    render(<TimingGuide />);
    expect(screen.getByText('How Priority Works')).toBeInTheDocument();
  });

  test('renders key interaction windows section', () => {
    render(<TimingGuide />);
    expect(screen.getByText('Key Interaction Windows')).toBeInTheDocument();
  });

  test('expanding a speed card shows details', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText('Instant Speed'));
    expect(screen.getByText('Allowed when:')).toBeInTheDocument();
  });

  test('expanding an interaction window shows body', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText("End of opponent's turn"));
    expect(screen.getByText('Example:')).toBeInTheDocument();
  });

  test('clicking the same speed card collapses it', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText('Sorcery Speed'));
    expect(screen.getByText('Allowed when:')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Sorcery Speed'));
    expect(screen.queryByText('Allowed when:')).not.toBeInTheDocument();
  });

  test('renders "key window" badge for highlighted windows', () => {
    render(<TimingGuide />);
    const badges = screen.getAllByText('Key Window');
    expect(badges.length).toBeGreaterThan(0);
  });
});
