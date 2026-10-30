import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Select } from './Select';

const options = [
  { label: 'Sonnet', value: 'claude-sonnet-4-6' },
  { label: 'Haiku', value: 'claude-haiku-4-5' },
];

describe('Select', () => {
  it('muestra el placeholder cuando no hay valor', () => {
    render(<Select options={options} placeholder="Elegí un modelo" aria-label="modelo" />);
    expect(screen.getByLabelText('modelo')).toHaveTextContent('Elegí un modelo');
  });
  it('muestra el label del valor por defecto', () => {
    render(<Select options={options} defaultValue="claude-haiku-4-5" aria-label="modelo" />);
    expect(screen.getByLabelText('modelo')).toHaveTextContent('Haiku');
  });
  it('muestra la etiqueta (badge) de la opción elegida en el campo', () => {
    render(
      <Select
        options={[
          { label: '1 pago de $ 100', value: '1' },
          { label: '6 cuotas de $ 20', value: '6', badge: { label: 'Sin interés', tone: 'success' } },
        ]}
        defaultValue="6"
        aria-label="cuotas"
      />,
    );
    const campo = screen.getByLabelText('cuotas');
    expect(campo).toHaveTextContent('6 cuotas de $ 20');
    expect(campo).toHaveTextContent('Sin interés');
  });
  it('el trigger es un combobox accesible', () => {
    render(<Select options={options} aria-label="modelo" />);
    expect(screen.getByRole('combobox', { name: 'modelo' })).toBeInTheDocument();
  });
});

describe('Select en pantalla táctil', () => {
  const original = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = ((query: string) => ({
      matches: query === '(pointer: coarse)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  });
  afterEach(() => {
    window.matchMedia = original;
  });

  it('usa el select nativo con las opciones', () => {
    render(<Select options={options} aria-label="modelo" />);
    const campo = screen.getByRole('combobox', { name: 'modelo' });
    expect(campo.tagName).toBe('SELECT');
    expect(screen.getByRole('option', { name: 'Haiku' })).toBeInTheDocument();
  });

  it('controlado: avisa el valor elegido', () => {
    const onValueChange = vi.fn();
    render(<Select options={options} value="claude-sonnet-4-6" onValueChange={onValueChange} aria-label="modelo" />);
    fireEvent.change(screen.getByRole('combobox', { name: 'modelo' }), { target: { value: 'claude-haiku-4-5' } });
    expect(onValueChange).toHaveBeenCalledWith('claude-haiku-4-5');
  });

  it('no controlado: muestra la opción elegida en el campo', () => {
    const { container } = render(<Select options={options} defaultValue="claude-sonnet-4-6" aria-label="modelo" />);
    fireEvent.change(screen.getByRole('combobox', { name: 'modelo' }), { target: { value: 'claude-haiku-4-5' } });
    expect(container.querySelector('[data-native] > span')).toHaveTextContent('Haiku');
  });

  it('muestra el placeholder sin valor y el badge de la elegida', () => {
    const { container, rerender } = render(<Select options={options} placeholder="Elegí un modelo" aria-label="modelo" />);
    expect(container.querySelector('[data-native] > span')).toHaveTextContent('Elegí un modelo');
    rerender(
      <Select
        options={[{ label: '6 cuotas', value: '6', badge: { label: 'Sin interés', tone: 'success' } }]}
        value="6"
        aria-label="modelo"
      />,
    );
    expect(container.querySelector('[data-native] > span')).toHaveTextContent('Sin interés');
    expect(screen.getByRole('option', { name: '6 cuotas · Sin interés' })).toBeInTheDocument();
  });
});
