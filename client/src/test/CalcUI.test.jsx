import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Calculator from '../pages/Calculator';

const renderCalc = () => render(<MemoryRouter><Calculator /></MemoryRouter>);

describe('Calculator page UI', () => {
  it('renders the page heading', () => {
    renderCalc();
    expect(screen.getByRole('heading', { name: /estimate your carbon footprint/i })).toBeInTheDocument();
  });

  it('shows the Transport step by default', () => {
    renderCalc();
    expect(screen.getByText(/how do you get around/i)).toBeInTheDocument();
  });

  it('shows a Next button on step 1', () => {
    renderCalc();
    expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument();
  });

  it('shows a validation error when Next is clicked without answering', () => {
    renderCalc();
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    expect(screen.getByText(/please answer all questions/i)).toBeInTheDocument();
  });

  it('advances to Home Energy step after completing Transport', () => {
    renderCalc();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /^0$/ }));
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    expect(screen.getByRole('heading', { name: /home energy/i })).toBeInTheDocument();
  });

  it('shows a Back button after moving past the first step', () => {
    renderCalc();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /^0$/ }));
    fireEvent.click(screen.getByRole('button', { name: /^next$/i }));
    expect(screen.getByRole('button', { name: /^back$/i })).toBeInTheDocument();
  });

  it('shows progress step labels', () => {
    renderCalc();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('Home Energy')).toBeInTheDocument();
    expect(screen.getByText('Diet')).toBeInTheDocument();
    expect(screen.getByText('Lifestyle')).toBeInTheDocument();
  });
});
