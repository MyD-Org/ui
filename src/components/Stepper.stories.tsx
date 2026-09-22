import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
};
export default meta;
type Story = StoryObj<typeof Stepper>;

export const Retiro: Story = {
  args: {
    steps: [
      { label: 'Pedido recibido', state: 'done' },
      { label: 'Pago confirmado', state: 'current' },
      { label: 'Preparando', state: 'pending' },
      { label: 'Retirado', state: 'pending' },
    ],
  },
};

export const Envio: Story = {
  args: {
    steps: [
      { label: 'Pedido recibido', state: 'done' },
      { label: 'Pago confirmado', state: 'done' },
      { label: 'Preparando', state: 'done' },
      { label: 'En camino', state: 'current' },
      { label: 'Entregado', state: 'pending' },
    ],
  },
};

export const Completo: Story = {
  args: {
    steps: ['Pedido recibido', 'Pago confirmado', 'Preparando', 'Retirado'].map((label) => ({ label, state: 'done' as const })),
  },
};

export const Compacto: Story = { args: { ...Envio.args, size: 'sm' } };

export const Vertical: Story = {
  args: { ...Envio.args, orientation: 'vertical' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => (
    <div className="max-w-xs">
      <Stepper {...args} />
    </div>
  ),
};

export const Angosto: Story = {
  args: { ...Envio.args, size: 'sm' },
  render: (args) => (
    <div className="w-80">
      <Stepper {...args} />
    </div>
  ),
};
