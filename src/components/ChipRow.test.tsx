import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChipRow } from './ChipRow';

describe('ChipRow', () => {
  it('renderiza un chip por item', () => {
    render(<ChipRow chips={[{ label: 'Apliques' }, { label: 'Faroles solares' }]} />);
    expect(screen.getByText('Apliques')).toBeInTheDocument();
    expect(screen.getByText('Faroles solares')).toBeInTheDocument();
  });

  it('los chips con href son links', () => {
    render(<ChipRow chips={[{ label: 'Smart / Wi-Fi', href: '/catalogo' }]} />);
    const link = screen.getByRole('link', { name: 'Smart / Wi-Fi' });
    expect(link).toHaveAttribute('href', '/catalogo');
    expect(link.className).toContain('rounded-full');
  });

  it('los chips sin href son spans', () => {
    render(<ChipRow chips={[{ label: 'Efecto fuego' }]} />);
    expect(screen.queryByRole('link')).toBeNull();
  });
});
