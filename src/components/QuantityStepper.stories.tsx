import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuantityStepper } from './QuantityStepper';

const meta: Meta<typeof QuantityStepper> = {
  title: 'Components/QuantityStepper',
  component: QuantityStepper,
};
export default meta;
type Story = StoryObj<typeof QuantityStepper>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState(1);
    return <QuantityStepper value={v} onValueChange={setV} />;
  },
};

export const WithMinMax: Story = {
  render: () => {
    const [v, setV] = useState(5);
    return <QuantityStepper value={v} onValueChange={setV} min={1} max={10} />;
  },
};

export const Disabled: Story = {
  args: { value: 3, onValueChange: () => {}, disabled: true },
};

/** `tone="soft"` + `removeLabel`: con 1 unidad el − es un tacho. El carrito del Shop. */
export const SoftEnCarrito: Story = {
  render: () => {
    const [v, setV] = useState(1);
    return (
      <div style={{ width: 262 }}>
        {v > 0 ? (
          <QuantityStepper value={v} onValueChange={setV} min={0} tone="soft" size="md" fullWidth removeLabel="Quitar del carrito" />
        ) : (
          <button type="button" onClick={() => setV(1)}>Agregar</button>
        )}
      </div>
    );
  },
};

/** Los tres altos, iguales a los de `Button` (sm 36 · md 40 · lg 48). */
export const Tamanos: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <QuantityStepper value={2} onValueChange={() => {}} tone="soft" size="sm" />
      <QuantityStepper value={2} onValueChange={() => {}} tone="soft" size="md" />
      <QuantityStepper value={2} onValueChange={() => {}} tone="soft" size="lg" />
    </div>
  ),
};
