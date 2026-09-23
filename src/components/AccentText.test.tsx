import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { AccentText, parseAccent, stripAccent } from './AccentText';

describe('parseAccent', () => {
  it('ubica el acento en cualquier posición', () => {
    expect(parseAccent('Todo lo que *su proyecto* necesita')).toEqual([
      { text: 'Todo lo que ', accent: false },
      { text: 'su proyecto', accent: true },
      { text: ' necesita', accent: false },
    ]);
  });

  it('admite varios acentos y acento al principio', () => {
    expect(parseAccent('*Luz* para *cada* rincón').filter((s) => s.accent).map((s) => s.text)).toEqual(['Luz', 'cada']);
  });

  it('un asterisco sin cerrar queda literal', () => {
    expect(parseAccent('Precio *especial')).toEqual([{ text: 'Precio *especial', accent: false }]);
  });

  it('stripAccent saca las marcas', () => {
    expect(stripAccent('Los más *vendidos*')).toBe('Los más vendidos');
  });
});

describe('AccentText', () => {
  it('pinta cada tramo marcado en un <em>', () => {
    const { container } = render(<AccentText text="Todo lo que *su proyecto* necesita" accentClassName="text-accent" />);
    expect(container.textContent).toBe('Todo lo que su proyecto necesita');
    expect(container.querySelector('em')?.textContent).toBe('su proyecto');
    expect(container.querySelector('em')?.className).toBe('text-accent');
  });

  it('sin accentClassName no interpreta los asteriscos', () => {
    const { container } = render(<AccentText text="Precio *especial*" />);
    expect(container.textContent).toBe('Precio *especial*');
    expect(container.querySelector('em')).toBeNull();
  });

  it('con mobileText alterna las dos versiones por breakpoint', () => {
    const { container } = render(<AccentText text="Desktop *largo*" mobileText="*Corto*" accentClassName="a" />);
    const [mobile, desktop] = Array.from(container.querySelectorAll(':scope > span'));
    expect(mobile.className).toBe('md:hidden');
    expect(mobile.textContent).toBe('Corto');
    expect(desktop.className).toBe('hidden md:inline');
    expect(desktop.textContent).toBe('Desktop largo');
  });

  it('sin mobileText no duplica el texto', () => {
    const { container } = render(<AccentText text="Solo uno" mobileText="" />);
    expect(container.querySelectorAll('span')).toHaveLength(0);
  });
});
