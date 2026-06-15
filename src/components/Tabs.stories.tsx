import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const items = [
  { value: 'facturas', label: 'Facturas' },
  { value: 'pagos', label: 'Pagos' },
  { value: 'presupuestos', label: 'Presupuestos' },
];

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { items, ariaLabel: 'Vistas' },
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Underline: Story = { args: { variant: 'underline' } };
export const Pill: Story = { args: { variant: 'pill' } };
