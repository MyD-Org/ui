import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast } from './Toast';
import { Button } from './Button';

const meta: Meta = {
  title: 'Components/Toast',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

function Demo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast({ title: 'Guardado', description: 'Cambios aplicados.' })}>Neutral</Button>
      <Button variant="secondary" onClick={() => toast({ title: 'Exitoso', tone: 'success' })}>Success</Button>
      <Button variant="danger" onClick={() => toast({ title: 'Error', description: 'No se pudo guardar.', tone: 'danger' })}>Danger</Button>
      <Button variant="secondary" onClick={() => toast({ title: 'Atención', tone: 'warning' })}>Warning</Button>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
