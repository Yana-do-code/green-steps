import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Insights from '../pages/Insights';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart:     () => <svg data-testid="line-chart" />,
  BarChart:      () => <svg data-testid="bar-chart" />,
  Line:          () => null,
  Bar:           () => null,
  XAxis:         () => null,
  YAxis:         () => null,
  CartesianGrid: () => null,
  Tooltip:       () => null,
  Legend:        () => null,
  ReferenceLine: () => null,
}));

const mockUser = { name: 'Yana Pandey', email: 'yana@test.com', uid: 'uid123' };
const TODAY    = new Date().toISOString().split('T')[0];

beforeEach(() => vi.clearAllMocks());

const renderInsights = () => render(<MemoryRouter><Insights /></MemoryRouter>);

describe('Insights page', () => {
  it('shows empty state when no actions have been logged', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: { completedActions: [], bookmarkedActions: [] },
    });
    renderInsights();
    expect(screen.getByText(/no data yet/i)).toBeInTheDocument();
  });

  it('shows page heading in empty state', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: { completedActions: [], bookmarkedActions: [] },
    });
    renderInsights();
    expect(screen.getByText(/your sustainability insights/i)).toBeInTheDocument();
  });

  it('renders Eco Score ring when actions are present', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: {
        completedActions: [
          { id: 1, impact: 1.5, category: 'Transport', completedAt: TODAY },
        ],
        bookmarkedActions: [],
      },
    });
    renderInsights();
    expect(screen.getByText(/eco score/i)).toBeInTheDocument();
  });

  it('shows filter pills with correct aria-pressed on "all" by default', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: {
        completedActions: [
          { id: 1, impact: 1.1, category: 'Transport', completedAt: TODAY },
        ],
        bookmarkedActions: [],
      },
    });
    renderInsights();
    const allPill = screen.getByRole('button', { name: /all/i });
    expect(allPill).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches active filter when a pill is clicked', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: {
        completedActions: [
          { id: 1, impact: 1.1, category: 'Transport', completedAt: TODAY },
        ],
        bookmarkedActions: [],
      },
    });
    renderInsights();
    const oppPill = screen.getByRole('button', { name: /opportunity/i });
    fireEvent.click(oppPill);
    expect(oppPill).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /all/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows comparison section with global average label', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: {
        completedActions: [
          { id: 1, impact: 1.5, category: 'Transport', completedAt: TODAY },
          { id: 2, impact: 0.8, category: 'Diet', completedAt: TODAY },
        ],
        bookmarkedActions: [],
      },
    });
    renderInsights();
    expect(screen.getAllByText(/global/i).length).toBeGreaterThan(0);
  });
});
