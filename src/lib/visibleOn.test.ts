import { describe, expect, it } from 'vitest';
import { visibleOnClass } from './visibleOn';

describe('visibleOnClass', () => {
  it('oculta en el otro tamaño; sin valor no agrega nada', () => {
    expect(visibleOnClass('mobile')).toBe('md:hidden');
    expect(visibleOnClass('desktop')).toBe('max-md:hidden');
    expect(visibleOnClass(undefined)).toBeUndefined();
  });
});
