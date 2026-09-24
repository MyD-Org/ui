import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileDropZone } from './FileDropZone';

const meta: Meta<typeof FileDropZone> = {
  title: 'Components/FileDropZone',
  component: FileDropZone,
  args: { file: null, accept: 'application/pdf,image/*', hint: 'PDF o imagen, hasta 10 MB' },
  parameters: { layout: 'padded' },
  render: (args) => {
    const [file, setFile] = useState<File | null>(args.file);
    return <FileDropZone {...args} file={file} onChange={setFile} />;
  },
};
export default meta;
type Story = StoryObj<typeof FileDropZone>;

export const Default: Story = {};

export const ConArchivo: Story = {
  args: { file: new File(['x'], 'comprobante-transferencia.pdf', { type: 'application/pdf' }) },
};

export const TextosPropios: Story = {
  args: {
    title: 'Adjunte el comprobante de pago',
    selectPrefix: 'o',
    selectLabel: 'búsquelo en su dispositivo',
  },
};

export const SinHint: Story = { args: { hint: undefined } };
