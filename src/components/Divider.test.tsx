import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider', () => {
  it('es un separator horizontal por defecto', () => {
    render(<Divider />);
    const el = screen.getByRole('separator');
    expect(el).toHaveAttribute('aria-orientation', 'horizontal');
    expect(el.className).toContain('border-t');
  });
  it('soporta orientación vertical', () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator').className).toContain('border-l');
  });
});
