import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { DocumentViewer } from './DocumentViewer';
import { Button } from './Button';

const meta: Meta<typeof DocumentViewer> = {
  title: 'Components/DocumentViewer',
  component: DocumentViewer,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof DocumentViewer>;

// PDF mínimo de una página, armado en el navegador para no depender de un servidor.
const PDF = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 58 >> stream
BT /F1 24 Tf 72 760 Td (Factura 0001-00000123) Tj ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
trailer << /Root 1 0 R >>
%%EOF`;

function Demo({ src }: { src?: string }) {
  const [open, setOpen] = useState(false);
  const blobSrc = useMemo(() => URL.createObjectURL(new Blob([PDF], { type: 'application/pdf' })), []);
  const url = src ?? blobSrc;
  return (
    <>
      <Button onClick={() => setOpen(true)}>Ver factura</Button>
      <DocumentViewer open={open} onOpenChange={setOpen} title="Factura 0001-00000123" src={url} downloadHref={url} />
    </>
  );
}

export const Documento: Story = { render: () => <Demo /> };

/** El servidor responde 404: se ve el mensaje por defecto, sin acciones. */
export const ConError: Story = { render: () => <Demo src="/documento-inexistente.pdf" /> };
