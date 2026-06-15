import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Dialog>;

function Demo({ size }: { size?: 'sm' | 'md' | 'lg' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        size={size}
        title="Confirmar acción"
        description="Esta operación no se puede deshacer."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>Confirmar</Button>
          </>
        }
      >
        <p>El cuerpo del dialog acepta cualquier contenido.</p>
      </Dialog>
    </>
  );
}

export const Default: Story = { render: () => <Demo /> };
export const Small: Story = { render: () => <Demo size="sm" /> };
export const Large: Story = { render: () => <Demo size="lg" /> };
