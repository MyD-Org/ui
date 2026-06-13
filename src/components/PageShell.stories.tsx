import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageShell } from './PageShell';
import { Button } from './Button';

const meta: Meta<typeof PageShell> = {
  title: 'Components/PageShell',
  component: PageShell,
  render: (args) => (
    <PageShell {...args} title="Agentes" actions={<Button>Nuevo agente</Button>}>
      <p className="text-muted">Contenido de la página.</p>
    </PageShell>
  ),
};
export default meta;
type Story = StoryObj<typeof PageShell>;

export const Default: Story = {};
