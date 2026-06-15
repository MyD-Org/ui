import type { Meta, StoryObj } from '@storybook/react-vite';
import { DropdownMenu } from './DropdownMenu';
import { Button } from './Button';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu
      items={[
        { type: 'label', label: 'Mi cuenta' },
        { label: 'Perfil' },
        { label: 'Configuración' },
        { type: 'separator' },
        { label: 'Salir', tone: 'danger' },
      ]}
    >
      <Button variant="secondary">Abrir menú</Button>
    </DropdownMenu>
  ),
};
