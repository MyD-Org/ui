import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';

describe('Progress', () => {
  it('expone role progressbar con aria values', () => {
    render(<Progress value={30} aria-label="carga" />);
    const el = screen.getByRole('progressbar', { name: 'carga' });
    expect(el).toHaveAttribute('aria-valuenow', '30');
    expect(el).toHaveAttribute('aria-valuemax', '100');
  });
  it('calcula el ancho según value/max', () => {
    render(<Progress value={1} max={4} aria-label="x" />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.width).toBe('25%');
  });
  it('clampea por encima del max', () => {
    render(<Progress value={10} max={4} aria-label="x" />);
    const fill = screen.getByRole('progressbar').firstChild as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });
});
