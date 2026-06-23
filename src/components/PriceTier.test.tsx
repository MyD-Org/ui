import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriceTier } from './PriceTier';

const tiers = [
  { label: '1 – 9 u.', price: 14990 },
  { label: '10 – 49 u.', price: 14240, discount: '-5%' },
  { label: '50+ u.', price: 13490, discount: '-10%' },
];

describe('PriceTier', () => {
  it('renders all tier labels', () => {
    render(<PriceTier tiers={tiers} />);
    expect(screen.getByText('1 – 9 u.')).toBeDefined();
    expect(screen.getByText('10 – 49 u.')).toBeDefined();
    expect(screen.getByText('50+ u.')).toBeDefined();
  });

  it('shows discount badges when provided', () => {
    render(<PriceTier tiers={tiers} />);
    expect(screen.getByText('-5%')).toBeDefined();
    expect(screen.getByText('-10%')).toBeDefined();
  });

  it('formats prices as currency', () => {
    render(<PriceTier tiers={[{ label: '1+', price: 14990 }]} />);
    const el = screen.getByText((content) => content.includes('14.990'));
    expect(el).toBeDefined();
  });
});
