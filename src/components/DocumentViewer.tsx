'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { cn } from '../lib/cn.js';
import { Alert } from './Alert.js';
import { Button } from './Button.js';
import { Dialog, type DialogPlacement } from './Dialog.js';

export interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Título del diálogo y del `<iframe>` (p. ej. "Factura 0001-00000123"). */
  title: string;
  /**
   * URL del PDF (mismo origen; se pide con las cookies de la sesión). Se baja con `fetch`
   * antes de mostrarlo: un `<iframe>` no expone el status, así que un 404 o un 502 se
   * verían como JSON crudo adentro del visor.
   */
  src: string;
  /** Enlace de descarga (p. ej. `src + '?download=1'`, que responde `attachment`). */
  downloadHref: string;
  /** Default 'center'. Con 'sheet' el visor es una hoja a todo el ancho (móvil). */
  placement?: DialogPlacement;
  downloadLabel?: string;
  openLabel?: string;
  loadingLabel?: string;
  /** Mensaje si la respuesta no trae `{ error }` o falla la red. */
  errorMessage?: string;
  /** Ayuda bajo el visor (iOS y navegadores sin visor de PDF). `null` la oculta. */
  hint?: ReactNode;
  className?: string;
}

type Estado = { kind: 'loading' } | { kind: 'ready'; blobUrl: string } | { kind: 'error'; message: string };

const FRAME = 'h-[min(62vh,780px)] w-full rounded-[var(--radius)] border border-border bg-elevated';

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

/**
 * Visor de un PDF en un diálogo dentro de la página (facturas, recibos, presupuestos).
 * Muestra carga, el error que devuelva el servidor (`{ error }`) o el documento, y
 * sólo con el documento listo ofrece descargarlo o abrirlo en otra pestaña.
 */
export function DocumentViewer({
  open,
  onOpenChange,
  title,
  src,
  downloadHref,
  placement,
  downloadLabel = 'Descargar PDF',
  openLabel = 'Abrir en pestaña nueva',
  loadingLabel = 'Cargando documento…',
  errorMessage = 'No pudimos abrir el documento. Inténtelo de nuevo en unos minutos.',
  hint = 'Si no ve el documento, descárguelo.',
  className,
}: DocumentViewerProps) {
  const [estado, setEstado] = useState<Estado>({ kind: 'loading' });

  useEffect(() => {
    if (!open) return;
    let cancelado = false;
    let blobUrl: string | null = null;
    fetch(src, { credentials: 'same-origin' })
      .then(async (res) => {
        if (!res.ok) {
          const body: unknown = await res.json().catch(() => null);
          const msg =
            body && typeof body === 'object' && 'error' in body && typeof body.error === 'string' ? body.error : errorMessage;
          if (!cancelado) setEstado({ kind: 'error', message: msg });
          return;
        }
        const blob = await res.blob();
        if (cancelado) return;
        blobUrl = URL.createObjectURL(blob);
        setEstado({ kind: 'ready', blobUrl });
      })
      .catch(() => {
        if (!cancelado) setEstado({ kind: 'error', message: errorMessage });
      });
    return () => {
      cancelado = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      // Al reabrir (o cambiar de documento) arranca en "Cargando", no con el blob ya liberado.
      setEstado({ kind: 'loading' });
    };
  }, [open, src, errorMessage]);

  const footer =
    estado.kind === 'ready' ? (
      <>
        <Button
          variant="ghost"
          href={src}
          renderLink={(props) => <a {...props} target="_blank" rel="noopener" />}
        >
          {openLabel}
        </Button>
        <Button href={downloadHref} renderLink={(props) => <a {...props} download />}>
          <DownloadIcon />
          {downloadLabel}
        </Button>
      </>
    ) : undefined;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="lg"
      placement={placement}
      footer={footer}
      className={cn((placement ?? 'center') === 'center' && 'max-w-4xl', className)}
    >
      <div className="flex flex-col gap-2">
        {estado.kind === 'loading' && (
          <div role="status" className={cn(FRAME, 'flex items-center justify-center text-sm text-muted')}>
            {loadingLabel}
          </div>
        )}
        {estado.kind === 'error' && <Alert tone="danger">{estado.message}</Alert>}
        {estado.kind === 'ready' && (
          <>
            <iframe src={estado.blobUrl} title={title} className={FRAME} />
            {hint != null && <p className="text-xs text-muted">{hint}</p>}
          </>
        )}
      </div>
    </Dialog>
  );
}
