import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SegmentedControl, type SegmentedOption } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
};
export default meta;
type Story = StoryObj<typeof SegmentedControl>;

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="5" r="2" /><circle cx="12" cy="5" r="2" /><circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
      <circle cx="5" cy="19" r="2" /><circle cx="12" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function Demo({ options, size, ariaLabel }: { options: SegmentedOption[]; size?: 'sm' | 'md'; ariaLabel?: string }) {
  const [value, setValue] = useState(options[0].value);
  return <SegmentedControl options={options} value={value} onValueChange={setValue} size={size} ariaLabel={ariaLabel} />;
}

export const ConTexto: Story = {
  render: () => (
    <Demo
      ariaLabel="Período"
      options={[
        { value: 'dia', label: 'Día' },
        { value: 'semana', label: 'Semana' },
        { value: 'mes', label: 'Mes' },
      ]}
    />
  ),
};

export const ConIconos: Story = {
  render: () => (
    <Demo
      ariaLabel="Vista"
      options={[
        { value: 'grilla', icon: <GridIcon />, ariaLabel: 'Vista en grilla' },
        { value: 'lista', icon: <ListIcon />, ariaLabel: 'Vista en lista' },
      ]}
    />
  ),
};

export const Small: Story = {
  render: () => (
    <Demo
      size="sm"
      ariaLabel="Vista"
      options={[
        { value: 'grilla', icon: <GridIcon />, label: 'Grilla' },
        { value: 'lista', icon: <ListIcon />, label: 'Lista', disabled: true },
        { value: 'mapa', label: 'Mapa' },
      ]}
    />
  ),
};
