import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  render: (args) => (
    <Card {...args}>
      <p className="font-medium">Título</p>
      <p className="text-muted text-sm">Contenido de la tarjeta.</p>
    </Card>
  ),
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};
