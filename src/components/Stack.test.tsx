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

it('grow reparte el espacio entre hijos (flex-1 + min-w-0)', () => {
  const { container } = render(
    <Stack direction="row" grow>
      <div>a</div>
      <div>b</div>
    </Stack>,
  );
  const el = container.firstChild as HTMLElement;
  expect(el.className).toContain('[&>*]:flex-1');
  expect(el.className).toContain('[&>*]:min-w-0');
});
