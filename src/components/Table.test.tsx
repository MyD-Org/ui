import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table, type TableColumn } from './Table';

interface Row {
  id: string;
  name: string;
}
const columns: TableColumn<Row>[] = [{ key: 'name', header: 'Nombre' }];

describe('Table', () => {
  it('renderiza headers y celdas', () => {
    render(<Table<Row> columns={columns} rows={[{ id: '1', name: 'Soporte' }]} rowKey={(r) => r.id} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Soporte')).toBeInTheDocument();
  });
  it('muestra el empty state sin filas', () => {
    render(<Table<Row> columns={columns} rows={[]} rowKey={(r) => r.id} empty="Nada acá" />);
    expect(screen.getByText('Nada acá')).toBeInTheDocument();
  });
  it('usa el render de la columna cuando se provee', () => {
    const cols: TableColumn<Row>[] = [
      { key: 'name', header: 'Nombre', render: (r) => <span data-testid="custom">{r.name.toUpperCase()}</span> },
    ];
    render(<Table<Row> columns={cols} rows={[{ id: '1', name: 'soporte' }]} rowKey={(r) => r.id} />);
    expect(screen.getByTestId('custom')).toHaveTextContent('SOPORTE');
  });
});
