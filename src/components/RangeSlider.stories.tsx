import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RangeSlider } from './RangeSlider';

const meta: Meta<typeof RangeSlider> = {
  title: 'Components/RangeSlider',
  component: RangeSlider,
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof RangeSlider>;

const pesos = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

function Demo({ disabled }: { disabled?: boolean }) {
  const [value, setValue] = useState<[number, number]>([500, 50000]);
  const [committed, setCommitted] = useState<[number, number]>(value);
  return (
    <div className="flex flex-col gap-3">
      <RangeSlider
        min={120}
        max={80000}
        step={10}
        value={value}
        onValueChange={setValue}
        onValueCommit={setCommitted}
        formatValue={pesos}
        thumbLabels={['Precio mínimo', 'Precio máximo']}
        disabled={disabled}
      />
      <p className="text-xs text-muted">
        Confirmado: {pesos(committed[0])} – {pesos(committed[1])}
      </p>
    </div>
  );
}

export const Precio: Story = { render: () => <Demo /> };
export const Disabled: Story = { render: () => <Demo disabled /> };
export const SinValores: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([20, 80]);
    return <RangeSlider min={0} max={100} value={value} onValueChange={setValue} showValues={false} aria-label="Porcentaje" />;
  },
};
