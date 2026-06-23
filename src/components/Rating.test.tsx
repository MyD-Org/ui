import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Rating } from './Rating';

describe('Rating', () => {
  it('renders the correct aria-label', () => {
    render(<Rating value={4.5} count={32} />);
    const el = screen.getByRole('img');
    expect(el.getAttribute('aria-label')).toContain('5 de 5 estrellas');
    expect(el.getAttribute('aria-label')).toContain('32 opiniones');
  });

  it('renders 5 star svgs by default', () => {
    const { container } = render(<Rating value={3} />);
    expect(container.querySelectorAll('svg').length).toBe(5);
  });

  it('shows count text when provided', () => {
    render(<Rating value={4.8} count={12} />);
    expect(screen.getByText('4.8 · 12 opiniones')).toBeDefined();
  });
});
