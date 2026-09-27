import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Board, type BoardColumn } from './Board';

interface Pedido {
  id: string;
  cliente: string;
  columna: string;
}

const columns: BoardColumn[] = [
  { id: 'pendiente', title: 'Pendiente' },
  { id: 'confirmado', title: 'Confirmado' },
  { id: 'entregado', title: 'Entregado' },
];

const pedidos: Pedido[] = [
  { id: 'p1', cliente: 'Ana', columna: 'pendiente' },
  { id: 'p2', cliente: 'Beto', columna: 'pendiente' },
  { id: 'p3', cliente: 'Caro', columna: 'confirmado' },
];

function fakeDataTransfer() {
  const store = new Map<string, string>();
  return {
    effectAllowed: '',
    dropEffect: '',
    setData: (type: string, value: string) => store.set(type, value),
    getData: (type: string) => store.get(type) ?? '',
  };
}

function renderBoard(overrides: Partial<React.ComponentProps<typeof Board<Pedido>>> = {}) {
  return render(
    <Board<Pedido>
      columns={columns}
      items={pedidos}
      getColumnId={(p) => p.columna}
      getItemId={(p) => p.id}
      renderCard={(p) => <span>{p.cliente}</span>}
      {...overrides}
    />,
  );
}

describe('Board', () => {
  it('renderiza una section por columna con su título y el contador de tarjetas', () => {
    renderBoard();
    const pendiente = screen.getByRole('region', { name: 'Pendiente' });
    expect(within(pendiente).getByText('2')).toBeInTheDocument();
    const confirmado = screen.getByRole('region', { name: 'Confirmado' });
    expect(within(confirmado).getByText('1')).toBeInTheDocument();
    const entregado = screen.getByRole('region', { name: 'Entregado' });
    expect(within(entregado).getByText('0')).toBeInTheDocument();
  });

  it('ubica cada tarjeta en la columna que indica getColumnId', () => {
    renderBoard();
    const pendiente = screen.getByRole('region', { name: 'Pendiente' });
    expect(within(pendiente).getByText('Ana')).toBeInTheDocument();
    expect(within(pendiente).getByText('Beto')).toBeInTheDocument();
    const confirmado = screen.getByRole('region', { name: 'Confirmado' });
    expect(within(confirmado).getByText('Caro')).toBeInTheDocument();
  });

  it('muestra el nodo empty en una columna sin tarjetas', () => {
    renderBoard({ empty: 'Sin pedidos' });
    const entregado = screen.getByRole('region', { name: 'Entregado' });
    expect(within(entregado).getByText('Sin pedidos')).toBeInTheDocument();
  });

  it('arrastrar y soltar en otra columna llama a onMove con el item y la columna destino', () => {
    const onMove = vi.fn();
    renderBoard({ onMove });
    const card = screen.getByText('Ana').parentElement as HTMLElement;
    const dataTransfer = fakeDataTransfer();
    fireEvent.dragStart(card, { dataTransfer });
    const confirmado = screen.getByRole('region', { name: 'Confirmado' });
    fireEvent.dragOver(confirmado, { dataTransfer });
    fireEvent.drop(confirmado, { dataTransfer });
    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith(pedidos[0], 'confirmado');
  });

  it('soltar en la misma columna de origen no llama a onMove', () => {
    const onMove = vi.fn();
    renderBoard({ onMove });
    const card = screen.getByText('Ana').parentElement as HTMLElement;
    const dataTransfer = fakeDataTransfer();
    fireEvent.dragStart(card, { dataTransfer });
    const pendiente = screen.getByRole('region', { name: 'Pendiente' });
    fireEvent.dragOver(pendiente, { dataTransfer });
    fireEvent.drop(pendiente, { dataTransfer });
    expect(onMove).not.toHaveBeenCalled();
  });

  it('canDrop false bloquea el drop y no llama a onMove', () => {
    const onMove = vi.fn();
    const canDrop = vi.fn().mockReturnValue(false);
    renderBoard({ onMove, canDrop });
    const card = screen.getByText('Ana').parentElement as HTMLElement;
    const dataTransfer = fakeDataTransfer();
    fireEvent.dragStart(card, { dataTransfer });
    const confirmado = screen.getByRole('region', { name: 'Confirmado' });
    fireEvent.dragOver(confirmado, { dataTransfer });
    fireEvent.drop(confirmado, { dataTransfer });
    expect(canDrop).toHaveBeenCalledWith(pedidos[0], 'confirmado');
    expect(onMove).not.toHaveBeenCalled();
  });

  it('className del consumidor se aplica al contenedor de columnas', () => {
    renderBoard({ className: 'mt-6' });
    expect(screen.getByRole('region', { name: 'Pendiente' }).parentElement?.className).toContain('mt-6');
  });
});
