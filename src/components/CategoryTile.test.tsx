import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryTile } from './CategoryTile';

describe('CategoryTile', () => {
  it('renders label', () => {
    render(<CategoryTile label="Iluminación LED" />);
    expect(screen.getByText('Iluminación LED')).toBeDefined();
  });

  it('renders count when provided', () => {
    render(<CategoryTile label="Cables" count={1240} />);
    expect(screen.getByText(/1\.240 art\./)).toBeDefined();
  });

  it('renders icon when provided', () => {
    render(<CategoryTile label="Test" icon={<span data-testid="icon">💡</span>} />);
    expect(screen.getByTestId('icon')).toBeDefined();
  });
});
