import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stack } from './Stack';

describe('Stack', () => {
  it('es flex-col por defecto', () => {
    render(<Stack data-testid="s"><span>a</span></Stack>);
    expect(screen.getByTestId('s').className).toContain('flex-col');
  });
  it('soporta direction row y gap lg', () => {
    render(<Stack data-testid="s" direction="row" gap="lg"><span>a</span></Stack>);
    const el = screen.getByTestId('s');
    expect(el.className).toContain('flex-row');
    expect(el.className).toContain('gap-6');
  });
});
