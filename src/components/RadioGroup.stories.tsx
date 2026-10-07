import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, type RadioOption } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

const SIMPLES: RadioOption[] = [
  { value: 'a', label: 'Retiro en sucursal' },
  { value: 'b', label: 'Envío a domicilio' },
  { value: 'c', label: 'Entrega en obra', disabled: true },
];

export const Simple: Story = {
  args: { legend: 'Forma de entrega', options: SIMPLES, defaultValue: 'a' },
};

/** Lista de direcciones al estilo marketplace: título, línea secundaria, badge y acción final. */
export const Direcciones: Story = {
  render: () => {
    const [v, setV] = useState('casa');
    const opciones: RadioOption[] = [
      {
        value: 'casa',
        label: 'Av. Siempre Viva 742',
        description: 'Springfield, Buenos Aires · CP 1000',
        badge: { label: 'Predeterminada', tone: 'success' },
        action: { label: 'Editar', ariaLabel: 'Editar Av. Siempre Viva 742', onClick: () => alert('Editar casa') },
      },
      {
        value: 'oficina',
        label: 'Calle Falsa 123',
        description: 'Córdoba, Córdoba · CP 5000',
        action: { label: 'Editar', ariaLabel: 'Editar Calle Falsa 123', onClick: () => alert('Editar oficina') },
      },
      { value: 'local', label: 'Retirar en el local', description: 'Disponible hoy' },
    ];
    return (
      <div className="max-w-md">
        <RadioGroup legend="Seleccione dónde recibir su compra" options={opciones} value={v} onValueChange={setV} />
      </div>
    );
  },
};

export const LeyendaOculta: Story = {
  args: { legend: 'Forma de entrega', hideLegend: true, options: SIMPLES, defaultValue: 'b' },
};

export const Deshabilitado: Story = {
  args: { legend: 'Forma de entrega', options: SIMPLES, defaultValue: 'a', disabled: true },
};

export const ConContenido: Story = {
  render: function Render() {
    const [v, setV] = useState('credito');
    const opciones: RadioOption[] = [
      {
        value: 'credito',
        label: 'Tarjeta de crédito',
        description: 'Visa, Mastercard, American Express',
        badge: { label: '6 cuotas sin interés', tone: 'success' },
        content: <p className="text-sm text-muted">Acá va el formulario de la tarjeta.</p>,
      },
      {
        value: 'cuenta',
        label: 'Cuenta de Mercado Pago',
        description: 'Dinero disponible o tarjetas guardadas',
        content: <p className="text-sm text-muted">Lo llevamos a Mercado Pago para completar el pago.</p>,
      },
      { value: 'debito', label: 'Tarjeta de débito', description: 'Sólo en un pago', disabled: true },
    ];
    return (
      <div className="max-w-md">
        <RadioGroup legend="¿Cómo quiere pagar?" options={opciones} value={v} onValueChange={setV} />
      </div>
    );
  },
};
