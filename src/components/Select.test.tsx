import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
