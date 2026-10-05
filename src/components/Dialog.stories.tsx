import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Select } from './Select';
import { DateRangeField } from './DateRangeField';
import { Input } from './Input';

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

const TIPOS = [
  { value: 'a', label: 'Factura A (0001)' },
  { value: 'b', label: 'Facturas de venta tipo B (00001)' },
  { value: 'c', label: 'Factura C (0003)' },
  { value: 'x', label: 'Presupuesto X' },
];

function FormDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir formulario</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        dismissible={false}
        title="Emitir factura"
        description="Lo que se completa se pierde si el diálogo se cierra."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>Emitir</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Select aria-label="Tipo de comprobante" options={TIPOS} defaultValue="b" />
          <DateRangeField label="Período" />
          <Input aria-label="Observaciones" placeholder="Observaciones" />
        </div>
      </Dialog>
    </>
  );
}

/** Formulario: `dismissible={false}`, sólo se cierra con Cancelar, Emitir o la X. */
export const ConFormulario: Story = { render: () => <FormDemo /> };
