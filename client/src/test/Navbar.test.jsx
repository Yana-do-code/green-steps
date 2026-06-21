import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

const mockLogout = vi.fn().mockResolvedValue(undefined);
const mockUser   = { name: 'Yana Pandey', email: 'yana@test.com', uid: 'uid123' };

beforeEach(() => vi.clearAllMocks());

const renderNavbar = (path = '/') =>
  render(<MemoryRouter initialEntries={[path]}><Navbar /></MemoryRouter>);

describe('Navbar component', () => {
  it('renders the GreenSteps logo', () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });
    renderNavbar();
    expect(screen.getByText('GreenSteps')).toBeInTheDocument();
  });

  it('shows Get Started link when not logged in', () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });
    renderNavbar();
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  });

  it('shows My Dashboard and user first name when logged in', () => {
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    renderNavbar();
    expect(screen.getByRole('link', { name: /my dashboard/i })).toBeInTheDocument();
    expect(screen.getByTitle('Sign out')).toBeInTheDocument();
    expect(screen.getByText(/yana/i)).toBeInTheDocument();
  });

  it('calls logout when sign out button is clicked', async () => {
    useAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
    renderNavbar();
    fireEvent.click(screen.getByTitle('Sign out'));
    await waitFor(() => expect(mockLogout).toHaveBeenCalledOnce());
  });

  it('hamburger has aria-expanded false and aria-controls set initially', () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });
    renderNavbar();
    const btn = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('opens mobile menu and sets aria-expanded true when hamburger is clicked', () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });
    renderNavbar();
    const btn = screen.getByRole('button', { name: /toggle navigation menu/i });
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('mobile-menu')).toBeInTheDocument();
  });

  it('shows Home nav link on every route', () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });
    renderNavbar('/');
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });
});
