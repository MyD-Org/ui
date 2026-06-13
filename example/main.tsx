import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  PageShell,
  Select,
  Table,
  type TableColumn,
} from '../src/index';
import './styles.css';

interface Agent {
  id: string;
  name: string;
  model: string;
  status: string;
}
const agents: Agent[] = [
  { id: '1', name: 'Soporte', model: 'claude-haiku-4-5', status: 'active' },
  { id: '2', name: 'Ventas', model: 'claude-sonnet-4-6', status: 'inactive' },
];
const columns: TableColumn<Agent>[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'model', header: 'Modelo', render: (a) => <span className="text-muted">{a.model}</span> },
  {
    key: 'status',
    header: 'Estado',
    render: (a) => <Badge tone={a.status === 'active' ? 'success' : 'neutral'}>{a.status}</Badge>,
  },
];

function Demo() {
  const [warm, setWarm] = useState(false);
  const theme = warm
    ? ({ '--color-primary': '#1c1917', '--color-bg': '#faf9f7' } as React.CSSProperties)
    : undefined;
  return (
    <div style={theme}>
      <PageShell
        title="Agentes"
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setWarm((w) => !w)}>
              {warm ? 'Theme neutral' : 'Theme cálido'}
            </Button>
            <Button>Nuevo agente</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <Table<Agent> columns={columns} rows={agents} rowKey={(a) => a.id} empty="Sin agentes." />
          <Card>
            <div className="flex flex-col gap-4">
              <Field label="Nombre" hint="Nombre visible del agente">
                <Input placeholder="Soporte" />
              </Field>
              <Field label="Modelo">
                <Select
                  options={[
                    { label: 'Sonnet', value: 'claude-sonnet-4-6' },
                    { label: 'Haiku', value: 'claude-haiku-4-5' },
                  ]}
                />
              </Field>
              <Field label="Email" error="Requerido">
                <Input type="email" placeholder="vos@empresa.com" />
              </Field>
              <div className="flex gap-2">
                <Button>Guardar</Button>
                <Button variant="secondary">Cancelar</Button>
                <Button variant="danger">Borrar</Button>
              </div>
            </div>
          </Card>
        </div>
      </PageShell>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
