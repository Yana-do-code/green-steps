import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Landing from '../pages/Landing';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

const noUser   = { user: null, progress: { completedActions: [] }, loading: false };
const withUser = {
  user: { name: 'Yana', email: 'y@test.com' },
  progress: { completedActions: [] },
  loading: false,
};

beforeEach(() => vi.clearAllMocks());

const setup = (auth = noUser) => {
  useAuth.mockReturnValue(auth);
  return render(<MemoryRouter><Landing /></MemoryRouter>);
};

describe('Landing page', () => {
  it('shows the main headline', () => {
    setup();
    expect(screen.getByText(/lighter footprint/i)).toBeInTheDocument();
  });

  it('shows Start Tracking Free CTA when logged out', () => {
    setup();
    expect(screen.getByRole('link', { name: /start tracking free/i })).toBeInTheDocument();
  });

  it('shows Go to Dashboard CTA when logged in', () => {
    setup(withUser);
    expect(screen.getByRole('link', { name: /go to dashboard/i })).toBeInTheDocument();
  });

  it('shows Sign in to start hint when logged out', () => {
    setup();
    expect(screen.getByText(/sign in to start/i)).toBeInTheDocument();
  });

  it('shows features section', () => {
    setup();
    expect(screen.getByText(/real-time tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/personalized insights/i)).toBeInTheDocument();
    expect(screen.getByText(/actionable steps/i)).toBeInTheDocument();
  });

  it('shows Carbon Calculator secondary CTA', () => {
    setup();
    expect(screen.getAllByRole('link', { name: /carbon calculator/i }).length).toBeGreaterThan(0);
  });
});
