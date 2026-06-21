import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Footer from '../components/Footer';

const renderFooter = () => render(<MemoryRouter><Footer /></MemoryRouter>);

describe('Footer component', () => {
  it('renders the GreenSteps brand name', () => {
    renderFooter();
    expect(screen.getByText('GreenSteps')).toBeInTheDocument();
  });

  it('displays the current year in the copyright notice', () => {
    renderFooter();
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it('renders Dashboard, Insights and Action Library nav links', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /insights/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /action library/i })).toBeInTheDocument();
  });

  it('renders GitHub social link with aria-label', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
  });

  it('renders Carbon Calculator link', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: /carbon calculator/i })).toBeInTheDocument();
  });
});
