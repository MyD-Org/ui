import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('junta class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('resuelve conflictos de Tailwind (gana el último)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
  it('descarta valores falsy', () => {
    expect(cn('a', false, undefined, 'c')).toBe('a c');
  });
});
