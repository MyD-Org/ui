import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type TableColumn } from './Table';
import { Badge } from './Badge';

interface Agent {
  id: string;
  name: string;
  model: string;
  status: string;
}

const sampleRows: Agent[] = [
  { id: '1', name: 'Soporte', model: 'claude-haiku-4-5', status: 'active' },
  { id: '2', name: 'Ventas', model: 'claude-sonnet-4-6', status: 'inactive' },
];

const columns: TableColumn<Agent>[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'model', header: 'Modelo' },
  {
    key: 'status',
    header: 'Estado',
    render: (a) => (
      <Badge tone={a.status === 'active' ? 'success' : 'neutral'}>{a.status}</Badge>
    ),
  },
];

const meta: Meta<typeof Table<Agent>> = {
  title: 'Components/Table',
  component: Table,
};
export default meta;
type Story = StoryObj<typeof Table<Agent>>;

export const Default: Story = {
  render: () => (
    <Table<Agent>
      columns={columns}
      rows={sampleRows}
      rowKey={(a) => a.id}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <Table<Agent>
      columns={columns}
      rows={[]}
      rowKey={(a) => a.id}
      empty="Todavía no hay agentes."
    />
  ),
};
