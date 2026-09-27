import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Board, type BoardColumn } from './Board';
import { Badge } from './Badge';
import { DropdownMenu } from './DropdownMenu';
import { ToggleIconButton } from './ToggleIconButton';

interface Pedido {
  id: string;
  cliente: string;
  total: string;
  estado: string;
}

const columnas: BoardColumn[] = [
  { id: 'pendiente', title: 'Pendiente' },
  { id: 'confirmado', title: 'Confirmado' },
  { id: 'en_preparacion', title: 'En preparación' },
  { id: 'en_camino', title: 'En camino' },
  { id: 'entregado', title: 'Entregado' },
];

const pedidosIniciales: Pedido[] = [
  { id: 'PED-101', cliente: 'Ana Gómez', total: '$12.400', estado: 'pendiente' },
  { id: 'PED-102', cliente: 'Beto Ruiz', total: '$8.200', estado: 'pendiente' },
  { id: 'PED-103', cliente: 'Caro Díaz', total: '$21.000', estado: 'confirmado' },
  { id: 'PED-104', cliente: 'Denis Paz', total: '$5.600', estado: 'en_preparacion' },
  { id: 'PED-105', cliente: 'Eli Vera', total: '$15.300', estado: 'en_camino' },
  { id: 'PED-106', cliente: 'Fran Soto', total: '$9.900', estado: 'entregado' },
];

function PedidoCard({
  pedido,
  columnas,
  onMoverA,
}: {
  pedido: Pedido;
  columnas: BoardColumn[];
  onMoverA: (columnId: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-sm border border-border bg-bg p-2.5 shadow-1">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text">{pedido.id}</p>
        <p className="truncate text-xs text-muted">{pedido.cliente}</p>
        <Badge tone="neutral" className="mt-1">
          {pedido.total}
        </Badge>
      </div>
      <DropdownMenu
        items={columnas
          .filter((c) => c.id !== pedido.estado)
          .map((c) => ({ label: `Mover a ${c.title}`, onSelect: () => onMoverA(c.id) }))}
      >
        <ToggleIconButton
          aria-label={`Mover pedido ${pedido.id}`}
          icon={<span aria-hidden="true">⋮</span>}
          pressed={false}
          onPressedChange={() => {}}
        />
      </DropdownMenu>
    </div>
  );
}

function PedidosDemo() {
  const [pedidos, setPedidos] = useState(pedidosIniciales);

  const mover = (pedido: Pedido, toColumnId: string) => {
    setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, estado: toColumnId } : p)));
  };

  return (
    <Board<Pedido>
      columns={columnas}
      items={pedidos}
      getColumnId={(p) => p.estado}
      getItemId={(p) => p.id}
      onMove={mover}
      empty="Sin pedidos"
      renderCard={(p) => <PedidoCard pedido={p} columnas={columnas} onMoverA={(to) => mover(p, to)} />}
    />
  );
}

const meta: Meta<typeof Board> = {
  title: 'Components/Board',
  component: Board,
};
export default meta;
type Story = StoryObj<typeof Board>;

export const Pedidos: Story = {
  render: () => <PedidosDemo />,
};

export const SoloUnaColumnaPermitida: Story = {
  render: () => {
    function Demo() {
      const [pedidos, setPedidos] = useState(pedidosIniciales);
      return (
        <Board<Pedido>
          columns={columnas}
          items={pedidos}
          getColumnId={(p) => p.estado}
          getItemId={(p) => p.id}
          canDrop={(pedido, toColumnId) => pedido.estado === 'pendiente' && toColumnId === 'confirmado'}
          onMove={(pedido, toColumnId) =>
            setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, estado: toColumnId } : p)))
          }
          renderCard={(p) => (
            <div className="rounded-sm border border-border bg-bg p-2.5 shadow-1">
              <p className="text-sm font-medium text-text">{p.id}</p>
              <p className="text-xs text-muted">{p.cliente}</p>
            </div>
          )}
        />
      );
    }
    return <Demo />;
  },
};

export const Vacio: Story = {
  render: () => (
    <Board<Pedido>
      columns={columnas}
      items={[]}
      getColumnId={(p) => p.estado}
      getItemId={(p) => p.id}
      empty="Sin pedidos"
      renderCard={(p) => <span>{p.cliente}</span>}
    />
  ),
};
