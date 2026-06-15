import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from './Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip content="Más información sobre esta acción">
      <Button variant="secondary">Hover sobre mí</Button>
    </Tooltip>
  ),
};

export const SideRight: Story = {
  render: () => (
    <Tooltip content="A la derecha" side="right">
      <Button variant="secondary">Hover sobre mí</Button>
    </Tooltip>
  ),
};
