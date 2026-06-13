import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Table, type TableColumn } from './Table';
import { Badge } from './Badge';

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
