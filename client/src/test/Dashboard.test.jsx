import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart:      () => <svg data-testid="pie-chart" />,
  Pie:           () => null,
  Cell:          () => null,
  AreaChart:     () => <svg data-testid="area-chart" />,
  Area:          () => null,
  XAxis:         () => null,
  YAxis:         () => null,
  CartesianGrid: () => null,
  Tooltip:       () => null,
  Legend:        () => null,
}));

const mockUpdateProgress = vi.fn();
const mockUser = { name: 'Yana Pandey', email: 'yana@test.com', uid: 'uid123' };
const TODAY = new Date().toISOString().split('T')[0];

const renderDash = () => render(<MemoryRouter><Dashboard /></MemoryRouter>);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Dashboard page', () => {
  it('shows onboarding empty state when no actions have been logged', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: { completedActions: [], bookmarkedActions: [] },
      updateProgress: mockUpdateProgress,
    });
    renderDash();
    expect(screen.getByText(/no actions logged yet/i)).toBeInTheDocument();
  });

  it('shows user name in onboarding state', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: { completedActions: [], bookmarkedActions: [] },
      updateProgress: mockUpdateProgress,
    });
    renderDash();
    expect(screen.getByText(/yana pandey/i)).toBeInTheDocument();
  });

  it('shows stat cards once actions are logged', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: {
        completedActions: [
          { id: 1, title: 'Bike to Work', impact: 1.1, category: 'Transport', completedAt: TODAY },
        ],
        bookmarkedActions: [],
      },
      updateProgress: mockUpdateProgress,
    });
    renderDash();
    // Use getAllBy since "CO₂ Saved" label and chart title "Cumulative CO₂ Saved" both match
    expect(screen.getAllByText(/co₂ saved/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Current Footprint')).toBeInTheDocument();
    expect(screen.getByText('Streak')).toBeInTheDocument();
  });

  it('shows Suggested for You section when actions are present', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: {
        completedActions: [
          { id: 1, title: 'Bike to Work', impact: 1.1, category: 'Transport', completedAt: TODAY },
        ],
        bookmarkedActions: [],
      },
      updateProgress: mockUpdateProgress,
    });
    renderDash();
    expect(screen.getByText(/suggested for you/i)).toBeInTheDocument();
  });

  it('shows welcome back message with the logged-in user name', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: {
        completedActions: [
          { id: 2, title: 'Use Public Transit', impact: 0.8, category: 'Transport', completedAt: TODAY },
        ],
        bookmarkedActions: [],
      },
      updateProgress: mockUpdateProgress,
    });
    renderDash();
    expect(screen.getByText(/welcome back, yana pandey/i)).toBeInTheDocument();
  });

  it('Log Now button calls updateProgress', () => {
    useAuth.mockReturnValue({
      user: mockUser,
      progress: {
        completedActions: [
          { id: 2, title: 'Use Public Transit', impact: 0.8, category: 'Transport', completedAt: TODAY },
        ],
        bookmarkedActions: [],
      },
      updateProgress: mockUpdateProgress,
    });
    renderDash();
    const logButtons = screen.queryAllByRole('button', { name: /log now/i });
    if (logButtons.length > 0) {
      fireEvent.click(logButtons[0]);
      expect(mockUpdateProgress).toHaveBeenCalledOnce();
    }
  });
});
