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

function Demo({ size, placement }: { size?: 'sm' | 'md' | 'lg'; placement?: 'center' | 'sheet' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        size={size}
        placement={placement}
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
export const Sheet: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>Filtros</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          placement="sheet"
          title="Filtros"
          description="Los filtros se aplican al instante."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Limpiar filtros</Button>
              <Button onClick={() => setOpen(false)}>Ver 2.626 productos</Button>
            </>
          }
        >
          <div className="flex flex-col gap-3">
            {Array.from({ length: 30 }, (_, i) => (
              <p key={i}>Opción de filtro {i + 1}</p>
            ))}
          </div>
        </Dialog>
      </>
    );
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
