import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from './Button';

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
export const ConTituloYAccion: Story = {
  render: () => (
    <Card title="Filtros" action={<Button variant="link" size="inline">Limpiar</Button>}>
      <p className="text-muted text-sm">Categorías, marcas, precio y disponibilidad.</p>
    </Card>
  ),
};
