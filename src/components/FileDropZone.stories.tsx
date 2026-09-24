import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileDropZone, type FileDropZoneProps } from './FileDropZone';

const meta: Meta<typeof FileDropZone> = {
  title: 'Components/FileDropZone',
  component: FileDropZone,
  args: { file: null, accept: 'application/pdf,image/*' },
};
export default meta;
type Story = StoryObj<typeof FileDropZone>;

const Controlled = (args: FileDropZoneProps) => {
  const [file, setFile] = useState<File | null>(args.file);
  return <FileDropZone {...args} file={file} onChange={setFile} />;
};

export const Default: Story = { render: (args) => <Controlled {...args} /> };

export const ConAyuda: Story = {
  args: { hint: 'PDF o imagen, hasta 5 MB.' },
  render: (args) => <Controlled {...args} />,
};

export const TextosPropios: Story = {
  args: {
    title: 'Adjunte el comprobante de pago',
    orLabel: '',
    browseLabel: 'Seleccione un archivo',
    hint: 'Transferencia o depósito. PDF o imagen.',
  },
  render: (args) => <Controlled {...args} />,
};

export const ConError: Story = {
  args: { hint: 'PDF o imagen, hasta 5 MB.', error: 'El archivo supera los 5 MB. Seleccione otro.' },
  render: (args) => <Controlled {...args} />,
};

export const Deshabilitada: Story = { args: { disabled: true }, render: (args) => <Controlled {...args} /> };
