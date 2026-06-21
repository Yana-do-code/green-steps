import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Login from '../pages/Login';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }));

const mockLogin         = vi.fn();
const mockSignup        = vi.fn();
const mockLoginWithGoogle = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  useAuth.mockReturnValue({ login: mockLogin, signup: mockSignup, loginWithGoogle: mockLoginWithGoogle });
});

const renderLogin = () => render(<MemoryRouter><Login /></MemoryRouter>);

describe('Login page', () => {
  it('renders email and password fields on sign-in tab', () => {
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows name field after switching to sign-up tab', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('tab', { name: /sign up/i }));
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it('labels are correctly associated with inputs', () => {
    renderLogin();
    const email = screen.getByLabelText(/email address/i);
    expect(email.tagName).toBe('INPUT');
    expect(email).toHaveAttribute('type', 'email');
    const password = screen.getByLabelText(/password/i);
    expect(password).toHaveAttribute('type', 'password');
  });

  it('shows a friendly error when login fails', async () => {
    mockLogin.mockRejectedValueOnce({ code: 'auth/invalid-credential' });
    const { container } = renderLogin();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.submit(container.querySelector('form'));
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(/incorrect email or password/i)
    );
  });

  it('calls loginWithGoogle when Google button is clicked', async () => {
    mockLoginWithGoogle.mockResolvedValueOnce();
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));
    await waitFor(() => expect(mockLoginWithGoogle).toHaveBeenCalledOnce());
  });

  it('error region has aria-live so screen readers announce it', () => {
    renderLogin();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('tabs have correct aria-selected state', () => {
    renderLogin();
    expect(screen.getByRole('tab', { name: /sign in/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /sign up/i })).toHaveAttribute('aria-selected', 'false');
    fireEvent.click(screen.getByRole('tab', { name: /sign up/i }));
    expect(screen.getByRole('tab', { name: /sign up/i })).toHaveAttribute('aria-selected', 'true');
  });
});
