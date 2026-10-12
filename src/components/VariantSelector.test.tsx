import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VariantSelector, type VariantOption } from './VariantSelector';

const OPCIONES: VariantOption[] = [
  { id: 'a', label: 'Verde', swatch: '#2e7d32' },
  { id: 'b', label: 'Rojo', soldOut: true },
  { id: 'c', label: 'Azul', disabled: true },
  { id: 'd', label: 'Blanco' },
];

function Controlado({ inicial = 'a', onChange = () => {}, ...rest }: Partial<React.ComponentProps<typeof VariantSelector>> & { inicial?: string }) {
  const [v, setV] = useState<string | null>(inicial);
  return (
    <VariantSelector
      label="Color"
      options={OPCIONES}
      value={v}
      onChange={(id) => {
        setV(id);
        onChange(id);
      }}
      {...rest}
    />
  );
}

describe('VariantSelector (radiogroup)', () => {
  it('es un radiogroup con nombre y radios con aria-checked', () => {
    render(<Controlado />);
    const grupo = screen.getByRole('radiogroup', { name: 'Color' });
    expect(grupo).toBeDefined();
    expect(screen.getByRole('radio', { name: 'Verde' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: /Rojo/ }).getAttribute('aria-checked')).toBe('false');
  });

  it('elegir con clic llama onChange', async () => {
    const onChange = vi.fn();
    render(<Controlado onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Blanco' }));
    expect(onChange).toHaveBeenCalledWith('d');
  });

  it('una opción agotada se anuncia, se puede elegir y se ve tachada', async () => {
    const onChange = vi.fn();
    render(<Controlado onChange={onChange} />);
    const rojo = screen.getByRole('radio', { name: /^Rojo\s*,\s*Sin stock$/ });
    expect(rojo.className).toContain('line-through');
    expect(rojo.hasAttribute('disabled')).toBe(false);
    await userEvent.click(rojo);
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('una opción deshabilitada no se elige y se anuncia', async () => {
    const onChange = vi.fn();
    render(<Controlado onChange={onChange} />);
    const azul = screen.getByRole('radio', { name: /^Azul\s*,\s*No disponible$/ }) as HTMLButtonElement;
    expect(azul.disabled).toBe(true);
    await userEvent.click(azul);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('roving tabindex: solo la elegida entra por Tab', () => {
    render(<Controlado inicial="d" />);
    expect(screen.getByRole('radio', { name: 'Blanco' }).tabIndex).toBe(0);
    expect(screen.getByRole('radio', { name: 'Verde' }).tabIndex).toBe(-1);
  });

  it('sin elegida, el primero habilitado entra por Tab', () => {
    render(<VariantSelector label="Color" options={OPCIONES} value={null} onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: 'Verde' }).tabIndex).toBe(0);
  });

  it('flechas mueven el foco, eligen y saltan las deshabilitadas', async () => {
    const onChange = vi.fn();
    render(<Controlado onChange={onChange} />);
    screen.getByRole('radio', { name: 'Verde' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('b');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: /Rojo/ }));
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('d'); // salta Azul
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('a'); // da la vuelta
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('d');
    await userEvent.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith('a');
    await userEvent.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith('d');
  });

  it('muestra la muestra de color con el color recibido', () => {
    const { container } = render(<Controlado />);
    const m = container.querySelector('[data-slot="swatch"]') as HTMLElement;
    expect(m.style.backgroundColor).not.toBe('');
    expect(m.getAttribute('aria-hidden')).toBe('true');
  });

  it('tamaño compacto y normal', () => {
    const { rerender } = render(<VariantSelector label="Color" options={OPCIONES} value="a" onChange={() => {}} size="sm" />);
    expect(screen.getByRole('radio', { name: 'Verde' }).className).toContain('text-xs');
    rerender(<VariantSelector label="Color" options={OPCIONES} value="a" onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: 'Verde' }).className).toContain('text-sm');
  });

  it('hideLabel conserva el nombre para lectores de pantalla', () => {
    render(<Controlado hideLabel />);
    expect(screen.getByText('Color').className).toContain('sr-only');
    expect(screen.getByRole('radiogroup', { name: 'Color' })).toBeDefined();
  });

  it('textos por props', () => {
    render(<Controlado soldOutLabel="Agotado" unavailableLabel="No disponible hoy" />);
    expect(screen.getByRole('radio', { name: /^Rojo\s*,\s*Agotado$/ })).toBeDefined();
    expect(screen.getByRole('radio', { name: /^Azul\s*,\s*No disponible hoy$/ })).toBeDefined();
  });
});

describe('VariantSelector (con enlaces)', () => {
  const CON_LINKS: VariantOption[] = [
    { id: '1', label: 'Verde', href: '/producto/1' },
    { id: '2', label: 'Rojo', href: '/producto/2', soldOut: true },
    { id: '3', label: 'Azul', href: '/producto/3', disabled: true },
  ];

  it('renderiza enlaces con aria-current en la elegida', () => {
    render(<VariantSelector label="Color" options={CON_LINKS} value="1" onChange={() => {}} />);
    expect(screen.getByRole('group', { name: 'Color' })).toBeDefined();
    const verde = screen.getByRole('link', { name: 'Verde' });
    expect(verde.getAttribute('href')).toBe('/producto/1');
    expect(verde.getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: /^Rojo\s*,\s*Sin stock$/ }).getAttribute('aria-current')).toBeNull();
  });

  it('una deshabilitada no es enlace', () => {
    render(<VariantSelector label="Color" options={CON_LINKS} value="1" onChange={() => {}} />);
    expect(screen.queryByRole('link', { name: /Azul/ })).toBeNull();
    expect(screen.getByText('Azul').closest('[aria-disabled="true"]')).not.toBeNull();
  });

  it('usa renderLink del host y avisa onChange al hacer clic', async () => {
    const onChange = vi.fn();
    const renderLink = vi.fn((p: any) => (
      <a data-host="next" href={p.href} className={p.className} aria-current={p['aria-current']} onClick={(e) => { e.preventDefault(); p.onClick?.(e); }}>
        {p.children}
      </a>
    ));
    render(<VariantSelector label="Color" options={CON_LINKS} value="1" onChange={onChange} renderLink={renderLink} />);
    expect(renderLink).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('link', { name: /Rojo/ }));
    expect(onChange).toHaveBeenCalledWith('2');
  });
});
