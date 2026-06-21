import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ActionLibrary from '../pages/ActionLibrary';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

const mockUpdateProgress = vi.fn();
const emptyProgress = { completedActions: [], bookmarkedActions: [] };

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  useAuth.mockReturnValue({ progress: emptyProgress, updateProgress: mockUpdateProgress });
});

afterEach(() => {
  vi.useRealTimers();
});

const renderLib = () => render(<MemoryRouter><ActionLibrary /></MemoryRouter>);

const TODAY = new Date().toISOString().split('T')[0];

describe('ActionLibrary page', () => {
  it('renders action cards from the data file', () => {
    renderLib();
    expect(screen.getAllByRole('button', { name: /log for today/i }).length).toBeGreaterThan(0);
  });

  it('shows 0/N logged today in the progress summary', () => {
    renderLib();
    expect(screen.getByText(/logged today/i)).toBeInTheDocument();
    // The summary span renders "{count}/{total}" — match the combined text content
    expect(screen.getByText((_, el) => el?.textContent?.replace(/\s/g, '') === '0/17')).toBeInTheDocument();
  });

  it('search narrows the list of visible action cards', () => {
    renderLib();
    const before = screen.getAllByRole('button', { name: /log for today/i }).length;
    fireEvent.change(screen.getByLabelText(/search actions/i), { target: { value: 'solar' } });
    act(() => vi.advanceTimersByTime(300));
    const after = screen.getAllByRole('button', { name: /log for today/i }).length;
    expect(after).toBeLessThan(before);
  });

  it('shows empty state when search has no matches', () => {
    renderLib();
    fireEvent.change(screen.getByLabelText(/search actions/i), { target: { value: 'xyzNOT_FOUND' } });
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByText(/no actions found/i)).toBeInTheDocument();
  });

  it('calls updateProgress when Log for Today is clicked', () => {
    renderLib();
    fireEvent.click(screen.getAllByRole('button', { name: /log for today/i })[0]);
    expect(mockUpdateProgress).toHaveBeenCalledOnce();
  });

  it('shows Logged Today after an action is already completed today', () => {
    useAuth.mockReturnValue({
      progress: {
        completedActions: [{ id: 1, completedAt: TODAY, category: 'Transport', impact: 1.1 }],
        bookmarkedActions: [],
      },
      updateProgress: mockUpdateProgress,
    });
    renderLib();
    expect(screen.getByText(/logged today ✓/i)).toBeInTheDocument();
  });

  it('bookmark button has descriptive aria-label', () => {
    renderLib();
    const bookmarks = screen.getAllByRole('button', { name: /bookmark this action/i });
    expect(bookmarks.length).toBeGreaterThan(0);
  });

  it('category filter pills expose aria-pressed state', () => {
    renderLib();
    const allPill = screen.getByRole('button', { name: /^all$/i });
    expect(allPill).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: /transport/i }));
    expect(screen.getByRole('button', { name: /^all$/i })).toHaveAttribute('aria-pressed', 'false');
  });
});
