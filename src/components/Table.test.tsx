import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, type TableColumn } from './Table';

interface Row {
  id: string;
  name: string;
  n: number;
}
const rows: Row[] = [
  { id: '1', name: 'Beta', n: 2 },
  { id: '2', name: 'Alfa', n: 1 },
  { id: '3', name: 'Gamma', n: 3 },
];
const base: TableColumn<Row>[] = [{ key: 'name', header: 'Nombre' }];

describe('Table', () => {
  it('renderiza headers y celdas', () => {
    render(<Table<Row> columns={base} rows={[{ id: '1', name: 'Soporte', n: 0 }]} rowKey={(r) => r.id} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Soporte')).toBeInTheDocument();
  });

  it('muestra el empty state sin filas', () => {
    render(<Table<Row> columns={base} rows={[]} rowKey={(r) => r.id} empty="Nada acá" />);
    expect(screen.getByText('Nada acá')).toBeInTheDocument();
  });

  it('usa el render de la columna cuando se provee', () => {
    const cols: TableColumn<Row>[] = [{ key: 'name', header: 'Nombre', render: (r) => <b>{r.name.toUpperCase()}</b> }];
    render(<Table<Row> columns={cols} rows={[{ id: '1', name: 'soporte', n: 0 }]} rowKey={(r) => r.id} />);
    expect(screen.getByText('SOPORTE')).toBeInTheDocument();
  });

  it('ordena por una columna sortable (asc luego desc)', async () => {
    const cols: TableColumn<Row>[] = [{ key: 'name', header: 'Nombre', sortable: true }];
    render(<Table<Row> columns={cols} rows={rows} rowKey={(r) => r.id} />);
    const header = screen.getByRole('button', { name: /Nombre/ });
    await userEvent.click(header);
    expect(screen.getAllByRole('cell')[0]).toHaveTextContent('Alfa');
    await userEvent.click(header);
    expect(screen.getAllByRole('cell')[0]).toHaveTextContent('Gamma');
  });

  it('ordena numéricamente con sortValue', async () => {
    const cols: TableColumn<Row>[] = [
      { key: 'name', header: 'Nombre' },
      { key: 'n', header: 'Cantidad', sortable: true, sortValue: (r) => r.n },
    ];
    render(<Table<Row> columns={cols} rows={rows} rowKey={(r) => r.id} />);
    await userEvent.click(screen.getByRole('button', { name: /Cantidad/ }));
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Alfa');
  });

  it('selección de una fila llama onSelectionChange', async () => {
    const onSelectionChange = vi.fn();
    render(<Table<Row> columns={base} rows={rows} rowKey={(r) => r.id} selectable onSelectionChange={onSelectionChange} />);
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['1']);
  });

  it('select-all selecciona todas las filas', async () => {
    const onSelectionChange = vi.fn();
    render(<Table<Row> columns={base} rows={rows} rowKey={(r) => r.id} selectable onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['1', '2', '3']);
  });

  it('aplica la clase responsive hideBelow', () => {
    const cols: TableColumn<Row>[] = [{ key: 'name', header: 'Nombre', hideBelow: 'md' }];
    render(<Table<Row> columns={cols} rows={rows} rowKey={(r) => r.id} />);
    const th = screen.getByText('Nombre').closest('th');
    expect(th?.className).toContain('md:table-cell');
  });

  it('dispara onRowClick', async () => {
    const onRowClick = vi.fn();
    render(<Table<Row> columns={base} rows={rows} rowKey={(r) => r.id} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText('Beta'));
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });
});

it('no crashea sin rows/columns/rowKey (data-driven: la query todavía no resolvió)', () => {
  render(<Table columns={undefined as never} rows={undefined as never} rowKey={undefined as never} empty="Sin datos" />);
  expect(screen.getByText('Sin datos')).toBeInTheDocument();
});
