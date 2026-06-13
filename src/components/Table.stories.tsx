import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Table, type TableColumn } from './Table';
import { Badge } from './Badge';
import { SelectionBar } from './SelectionBar';
import { Progress } from './Progress';
import { Button } from './Button';

interface Agent {
  id: string;
  name: string;
  model: string;
  status: string;
  calls: number;
}
const agents: Agent[] = [
  { id: '1', name: 'Soporte', model: 'claude-haiku-4-5', status: 'active', calls: 1240 },
  { id: '2', name: 'Ventas', model: 'claude-sonnet-4-6', status: 'active', calls: 870 },
  { id: '3', name: 'Cobranzas', model: 'claude-haiku-4-5', status: 'inactive', calls: 12 },
];
const columns: TableColumn<Agent>[] = [
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'model', header: 'Modelo', sortable: true, hideBelow: 'sm', render: (a) => <span className="text-muted">{a.model}</span> },
  { key: 'calls', header: 'Llamadas', sortable: true, align: 'right', sortValue: (a) => a.calls, defaultSortDir: 'desc' },
  { key: 'status', header: 'Estado', render: (a) => <Badge tone={a.status === 'active' ? 'success' : 'neutral'}>{a.status}</Badge> },
];

const meta = { title: 'Components/Table' } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <Table<Agent> columns={columns} rows={agents} rowKey={(a) => a.id} empty="Sin agentes." />,
};
export const Empty: Story = {
  render: () => <Table<Agent> columns={columns} rows={[]} rowKey={(a) => a.id} empty="Todavía no hay agentes." />,
};
export const Sortable: Story = {
  render: () => <Table<Agent> columns={columns} rows={agents} rowKey={(a) => a.id} defaultSort={{ key: 'calls', dir: 'desc' }} />,
};
export const Selectable: Story = {
  render: function Render() {
    const [sel, setSel] = useState<string[]>(['2']);
    return <Table<Agent> columns={columns} rows={agents} rowKey={(a) => a.id} selectable selectedKeys={sel} onSelectionChange={setSel} />;
  },
};

interface Invoice {
  id: string;
  comprobante: string;
  vence: string;
  importe: number;
  pagado: number;
  estado: string;
}
const invoices: Invoice[] = [
  { id: '1', comprobante: 'FC-A 0001-0042', vence: '15/07', importe: 878750, pagado: 878750, estado: 'pagada' },
  { id: '2', comprobante: 'FC-A 0001-0043', vence: '20/07', importe: 500000, pagado: 150000, estado: 'parcial' },
  { id: '3', comprobante: 'FC-A 0001-0044', vence: '30/06', importe: 320000, pagado: 0, estado: 'vencida' },
];
const money = (n: number) => '$' + n.toLocaleString('es-AR');
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

export const Complete: Story = {
  name: 'Tabla rica (CRM-style)',
  render: function Render() {
    const [sel, setSel] = useState<string[]>([]);
    const cols: TableColumn<Invoice>[] = [
      {
        key: 'comprobante',
        header: 'Comprobante',
        sortable: true,
        render: (r) => (
          <div>
            <div className="font-medium">{r.comprobante}</div>
            <div className="text-xs text-muted">vence {r.vence}</div>
          </div>
        ),
      },
      {
        key: 'importe',
        header: 'Importe',
        sortable: true,
        align: 'right',
        sortValue: (r) => r.importe,
        defaultSortDir: 'desc',
        render: (r) =>
          r.pagado > 0 && r.pagado < r.importe ? (
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-muted">{money(r.importe)}</span>
              <Progress value={r.pagado} max={r.importe} size="sm" className="w-24" aria-label="pagado" />
              <span className="text-xs font-semibold">Saldo {money(r.importe - r.pagado)}</span>
            </div>
          ) : (
            <span className="tabular-nums">{money(r.importe)}</span>
          ),
      },
      {
        key: 'estado',
        header: 'Estado',
        hideBelow: 'sm',
        render: (r) => (
          <Badge tone={r.estado === 'pagada' ? 'success' : r.estado === 'vencida' ? 'danger' : 'warning'}>{r.estado}</Badge>
        ),
      },
      {
        key: 'acciones',
        header: '',
        align: 'right',
        render: () => (
          <Button variant="ghost" size="icon" aria-label="Editar">
            <EditIcon />
          </Button>
        ),
      },
    ];
    const total = invoices.filter((i) => sel.includes(i.id)).reduce((s, i) => s + i.importe, 0);
    return (
      <div>
        <SelectionBar
          count={sel.length}
          onClear={() => setSel([])}
          label={`${sel.length} factura${sel.length !== 1 ? 's' : ''} seleccionada${sel.length !== 1 ? 's' : ''}`}
          summary={`Total: ${money(total)}`}
          emptyHint="Seleccioná facturas para accionar"
        >
          <Button variant="secondary" size="sm">Descargar</Button>
        </SelectionBar>
        <div className="mt-2">
          <Table<Invoice> columns={cols} rows={invoices} rowKey={(r) => r.id} selectable selectedKeys={sel} onSelectionChange={setSel} />
        </div>
      </div>
    );
  },
};
