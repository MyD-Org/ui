import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { VariantSelector, type VariantOption } from './VariantSelector';

const meta: Meta<typeof VariantSelector> = {
  title: 'Components/VariantSelector',
  component: VariantSelector,
};
export default meta;
type Story = StoryObj<typeof VariantSelector>;

const COLORES: VariantOption[] = [
  { id: '1', label: 'Blanco', swatch: '#f5f5f5' },
  { id: '2', label: 'Negro', swatch: '#1c1c1c' },
  { id: '3', label: 'Verde', swatch: '#2e7d32', soldOut: true },
  { id: '4', label: 'Rojo', swatch: '#c62828', disabled: true },
];

function Demo(props: Partial<React.ComponentProps<typeof VariantSelector>>) {
  const [v, setV] = useState<string | null>('1');
  return <VariantSelector label="Color" options={COLORES} value={v} onChange={setV} {...props} />;
}

export const Ficha: Story = { render: () => <Demo /> };
export const CardCompacta: Story = { render: () => <Demo size="sm" hideLabel /> };
export const SoloTexto: Story = {
  render: () => (
    <Demo
      label="Potencia"
      options={[{ id: 'a', label: '9 W' }, { id: 'b', label: '12 W' }, { id: 'c', label: '18 W', soldOut: true }]}
    />
  ),
};
export const ConEnlaces: Story = {
  render: () => <Demo options={COLORES.map((o) => ({ ...o, href: `/producto/${o.id}` }))} />,
};
