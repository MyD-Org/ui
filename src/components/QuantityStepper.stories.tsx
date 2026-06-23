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
