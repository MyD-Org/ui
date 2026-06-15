import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'No hay facturas para mostrar',
    description: 'Probá ajustar los filtros o esperá nuevas facturas.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'Nada por aquí',
    description: 'Empezá creando tu primer registro.',
    action: <Button>Crear</Button>,
  },
};
