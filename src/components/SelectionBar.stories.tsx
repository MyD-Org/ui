import type { Meta, StoryObj } from '@storybook/react-vite';
import { SelectionBar } from './SelectionBar';
import { Button } from './Button';

const meta: Meta<typeof SelectionBar> = {
  title: 'Components/SelectionBar',
  component: SelectionBar,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof SelectionBar>;

export const Active: Story = {
  args: {
    count: 3,
    summary: 'Total: $878.750',
    children: <Button variant="secondary" size="sm">Descargar</Button>,
  },
};
export const Empty: Story = {
  args: { count: 0, emptyHint: 'Seleccioná filas para accionar' },
};
export const Single: Story = { args: { count: 1, onClear: () => {} } };
