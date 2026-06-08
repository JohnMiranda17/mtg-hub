import { render, screen, fireEvent } from '@testing-library/react';
import TimingGuide from '../components/helper/TimingGuide';

describe('TimingGuide', () => {
  // --- existing sections ---
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

  test('expanding a speed card shows details', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText('Instant Speed'));
    expect(screen.getByText('Allowed when:')).toBeInTheDocument();
  });

  test('clicking the same speed card collapses it', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText('Sorcery Speed'));
    expect(screen.getByText('Allowed when:')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Sorcery Speed'));
    expect(screen.queryByText('Allowed when:')).not.toBeInTheDocument();
  });

  test('renders how priority works section', () => {
    render(<TimingGuide />);
    expect(screen.getByText('How Priority Works')).toBeInTheDocument();
  });

  test('renders key interaction windows section', () => {
    render(<TimingGuide />);
    expect(screen.getByText('Key Interaction Windows')).toBeInTheDocument();
  });

  test('expanding an interaction window shows body', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText("End of opponent's turn"));
    expect(screen.getByText('Example:')).toBeInTheDocument();
  });

  test('renders "key window" badge for highlighted windows', () => {
    render(<TimingGuide />);
    const badges = screen.getAllByText('Key Window');
    expect(badges.length).toBeGreaterThan(0);
  });

  // --- ability types section ---
  test('renders ability types section', () => {
    render(<TimingGuide />);
    expect(screen.getByText('Ability Types & Timing')).toBeInTheDocument();
  });

  test('renders all four ability type cards', () => {
    render(<TimingGuide />);
    expect(screen.getByText('Activated Abilities')).toBeInTheDocument();
    expect(screen.getByText('Triggered Abilities')).toBeInTheDocument();
    expect(screen.getByText('Static Abilities')).toBeInTheDocument();
    expect(screen.getByText('Mana Abilities')).toBeInTheDocument();
  });

  test('expanding an ability type shows its rules', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText('Activated Abilities'));
    expect(screen.getByText('How they work:')).toBeInTheDocument();
  });

  test('expanding triggered abilities shows its rules', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText('Triggered Abilities'));
    expect(screen.getByText('How they work:')).toBeInTheDocument();
  });

  test('clicking the same ability card collapses it', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText('Static Abilities'));
    expect(screen.getByText('How they work:')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Static Abilities'));
    expect(screen.queryByText('How they work:')).not.toBeInTheDocument();
  });

  // --- death & LTB section ---
  test('renders death and leave-the-battlefield section', () => {
    render(<TimingGuide />);
    expect(screen.getByText('Death & Leave-the-Battlefield Effects')).toBeInTheDocument();
  });

  test('renders all death effect cards', () => {
    render(<TimingGuide />);
    expect(screen.getByText('When a Creature Dies')).toBeInTheDocument();
    expect(screen.getByText('Destroy vs. Exile')).toBeInTheDocument();
    expect(screen.getByText('Sacrifice Effects')).toBeInTheDocument();
    expect(screen.getByText('Leave-the-Battlefield Triggers')).toBeInTheDocument();
    expect(screen.getByText('Last Known Information')).toBeInTheDocument();
  });

  test('expanding a death effect card shows body and example', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText('When a Creature Dies'));
    const examples = screen.getAllByText('Example:');
    expect(examples.length).toBeGreaterThan(0);
  });

  test('clicking the same death card collapses it', () => {
    render(<TimingGuide />);
    fireEvent.click(screen.getByText('Destroy vs. Exile'));
    const examplesOpen = screen.getAllByText('Example:');
    expect(examplesOpen.length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText('Destroy vs. Exile'));
    // after collapse, fewer Example: labels visible
    const examplesClosed = screen.queryAllByText('Example:');
    expect(examplesClosed.length).toBe(0);
  });

  test('renders "Key Rule" badges on highlighted death cards', () => {
    render(<TimingGuide />);
    const badges = screen.getAllByText('Key Rule');
    expect(badges.length).toBeGreaterThan(0);
  });
});
