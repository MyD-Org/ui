import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renderiza el texto y aplica la clase del tone success', () => {
    render(<Badge tone="success">activo</Badge>);
    const el = screen.getByText('activo');
    expect(el.className).toContain('bg-success-soft');
  });
});
