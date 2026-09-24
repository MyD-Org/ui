import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentViewer } from './DocumentViewer';

const SRC = '/api/mi-cuenta/documentos/factura/123';
const DOWNLOAD = `${SRC}?download=1`;

function pdfResponse() {
  return new Response(new Blob(['%PDF-1.4'], { type: 'application/pdf' }), { status: 200 });
}
function jsonError(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

const createObjectURL = vi.fn(() => 'blob:doc-1');
const revokeObjectURL = vi.fn();

beforeEach(() => {
  Object.assign(URL, { createObjectURL, revokeObjectURL });
});
afterEach(() => {
  vi.unstubAllGlobals();
  createObjectURL.mockClear();
  revokeObjectURL.mockClear();
});

describe('DocumentViewer', () => {
  it('cerrado no pide el documento', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<DocumentViewer open={false} onOpenChange={() => {}} title="Factura 0001-00000123" src={SRC} downloadHref={DOWNLOAD} />);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('muestra "Cargando documento…" mientras llega y después el PDF en un iframe', async () => {
    let resolver: (r: Response) => void = () => {};
    const fetchMock = vi.fn(() => new Promise<Response>((r) => (resolver = r)));
    vi.stubGlobal('fetch', fetchMock);
    render(<DocumentViewer open onOpenChange={() => {}} title="Factura 0001-00000123" src={SRC} downloadHref={DOWNLOAD} />);
    expect(screen.getByRole('dialog', { name: 'Factura 0001-00000123' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Cargando documento…');
    expect(fetchMock).toHaveBeenCalledWith(SRC, expect.objectContaining({ credentials: 'same-origin' }));

    resolver(pdfResponse());
    const iframe = await screen.findByTitle('Factura 0001-00000123');
    expect(iframe.tagName).toBe('IFRAME');
    expect(iframe).toHaveAttribute('src', 'blob:doc-1');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('con el PDF listo ofrece Descargar (downloadHref) y abrir en pestaña nueva, más la ayuda para iOS', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => pdfResponse()));
    render(<DocumentViewer open onOpenChange={() => {}} title="Factura" src={SRC} downloadHref={DOWNLOAD} />);
    const descargar = await screen.findByRole('link', { name: 'Descargar PDF' });
    expect(descargar).toHaveAttribute('href', DOWNLOAD);
    expect(descargar).toHaveAttribute('download');
    const abrir = screen.getByRole('link', { name: 'Abrir en pestaña nueva' });
    expect(abrir).toHaveAttribute('href', SRC);
    expect(abrir).toHaveAttribute('target', '_blank');
    expect(abrir).toHaveAttribute('rel', 'noopener');
    expect(screen.getByText('Si no ve el documento, descárguelo.')).toBeInTheDocument();
  });

  it('error con {error} del servidor: muestra ese mensaje, sin iframe ni acciones', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonError(404, { error: 'No encontramos el documento.' })));
    render(<DocumentViewer open onOpenChange={() => {}} title="Factura" src={SRC} downloadHref={DOWNLOAD} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('No encontramos el documento.');
    expect(screen.queryByTitle('Factura')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Descargar PDF' })).toBeNull();
  });

  it('error sin JSON o de red: mensaje por defecto en usted', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>', { status: 502 })));
    const { unmount } = render(<DocumentViewer open onOpenChange={() => {}} title="Factura" src={SRC} downloadHref={DOWNLOAD} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos abrir el documento. Inténtelo de nuevo en unos minutos.');
    unmount();

    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('offline'); }));
    render(<DocumentViewer open onOpenChange={() => {}} title="Factura" src={SRC} downloadHref={DOWNLOAD} errorMessage="Sin conexión." />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Sin conexión.');
  });

  it('libera la URL del blob al cerrar', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => pdfResponse()));
    const { rerender } = render(<DocumentViewer open onOpenChange={() => {}} title="Factura" src={SRC} downloadHref={DOWNLOAD} />);
    await screen.findByTitle('Factura');
    rerender(<DocumentViewer open={false} onOpenChange={() => {}} title="Factura" src={SRC} downloadHref={DOWNLOAD} />);
    await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith('blob:doc-1'));
  });

  it('Cerrar llama onOpenChange(false)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => pdfResponse()));
    const onOpenChange = vi.fn();
    render(<DocumentViewer open onOpenChange={onOpenChange} title="Factura" src={SRC} downloadHref={DOWNLOAD} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('los textos se pueden cambiar', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => pdfResponse()));
    render(
      <DocumentViewer
        open
        onOpenChange={() => {}}
        title="Recibo"
        src={SRC}
        downloadHref={DOWNLOAD}
        downloadLabel="Bajar"
        openLabel="Abrir aparte"
        hint={null}
      />,
    );
    expect(await screen.findByRole('link', { name: 'Bajar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Abrir aparte' })).toBeInTheDocument();
    expect(screen.queryByText('Si no ve el documento, descárguelo.')).toBeNull();
  });

  it('al reabrir arranca en "Cargando", no con el documento anterior', async () => {
    let resolver: (r: Response) => void = () => {};
    const fetchMock = vi.fn(async () => pdfResponse());
    vi.stubGlobal('fetch', fetchMock);
    const props = { onOpenChange: () => {}, title: 'Factura', src: SRC, downloadHref: DOWNLOAD };
    const { rerender } = render(<DocumentViewer open {...props} />);
    await screen.findByTitle('Factura');
    rerender(<DocumentViewer open={false} {...props} />);
    fetchMock.mockImplementation(() => new Promise<Response>((r) => (resolver = r)));
    rerender(<DocumentViewer open {...props} />);
    expect(screen.getByRole('status')).toHaveTextContent('Cargando documento…');
    expect(screen.queryByTitle('Factura')).toBeNull();
    resolver(pdfResponse());
    expect(await screen.findByTitle('Factura')).toBeInTheDocument();
  });

  it('en hoja (sheet) no limita el ancho', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => {})));
    render(<DocumentViewer open placement="sheet" onOpenChange={() => {}} title="Factura" src={SRC} downloadHref={DOWNLOAD} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-placement', 'sheet');
    expect(dialog.className).not.toContain('max-w-4xl');
  });
});

