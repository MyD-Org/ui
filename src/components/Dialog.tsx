'use client';

import { type ReactNode, type RefObject, useEffect, useRef, useState } from 'react';
import * as RDialog from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';
import { SHEET_DRAG_INTENT_PX, dragsSheet, shouldCloseSheet } from '../lib/sheetDrag.js';

const content = cva(
  'fixed z-50 flex flex-col overflow-hidden bg-surface shadow-[var(--shadow-2)] focus:outline-none',
  {
    variants: {
      placement: {
        // data-[state] lo pone Radix (open/closed). Animación CSS, no
        // transition: Presence espera `animationend` para desmontar, y con
        // `transition` se pierde ese aviso y se desmonta antes de terminar.
        center:
          'left-1/2 top-1/2 max-h-[90dvh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out motion-reduce:animate-none',
        /**
         * Hoja anclada abajo, a todo el ancho (filtros en mobile). `dvh` y no
         * `vh`: en Safari de iOS `vh` cuenta el alto con las barras del
         * navegador escondidas y la hoja tapaba el título y la X.
         */
        sheet: 'inset-x-0 bottom-0 max-h-[92dvh] w-full max-w-none rounded-t-lg rounded-b-none data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out motion-reduce:animate-none',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    // `size` sólo limita el ancho cuando el diálogo está centrado.
    compoundVariants: [
      { placement: 'center', size: 'sm', className: 'max-w-sm' },
      { placement: 'center', size: 'md', className: 'max-w-xl' },
      { placement: 'center', size: 'lg', className: 'max-w-3xl' },
    ],
    defaultVariants: { placement: 'center', size: 'md' },
  },
);

export type DialogSize = NonNullable<VariantProps<typeof content>['size']>;
export type DialogPlacement = NonNullable<VariantProps<typeof content>['placement']>;

export interface DialogProps extends VariantProps<typeof content> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  headerBorder?: boolean;
  /**
   * Sólo con `placement="sheet"`: la hoja se cierra arrastrándola hacia abajo
   * con el dedo, como las hojas nativas del celular, y lleva una manija arriba
   * que lo anuncia. Default `true`.
   */
  dragToClose?: boolean;
  className?: string;
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const SHEET_DRAG_MS = 200;

/**
 * Arrastrar hacia abajo para cerrar la hoja. La hoja sigue al dedo si el gesto
 * arranca en el encabezado (o la manija), o en el cuerpo cuando ya está arriba
 * de todo; si no, el cuerpo scrollea como siempre. Lo que está marcado
 * `touch-none` (p. ej. el `RangeSlider`) queda afuera: ahí el dedo mueve el
 * control. Al soltar, si se la bajó lo suficiente (`shouldCloseSheet`) termina
 * de bajar y se cierra; si no, vuelve a su lugar.
 *
 * `content` llega por callback ref en estado: el portal de Radix monta el
 * contenido después del render que abre el diálogo.
 */
function useSheetDrag(
  content: HTMLElement | null,
  header: RefObject<HTMLElement | null>,
  body: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  // El cierre por gesto usa siempre el último `onOpenChange` sin re-enganchar listeners.
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!content) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    let phase: 'idle' | 'deciding' | 'dragging' | 'free' = 'idle';
    let start: { x: number; y: number; inHeader: boolean } | null = null;
    let last = { y: 0, t: 0 };
    let velocity = 0;
    let offset = 0;
    let closing: ReturnType<typeof setTimeout> | undefined;

    const move = (px: number, animate: boolean) => {
      content.style.transition = animate && !reduced ? `transform ${SHEET_DRAG_MS}ms ease-out` : 'none';
      content.style.transform = px ? `translateY(${px}px)` : '';
    };

    const onStart = (e: TouchEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      if (e.touches.length !== 1 || target?.closest('.touch-none')) {
        phase = 'free';
        return;
      }
      const t = e.touches[0];
      phase = 'deciding';
      start = { x: t.clientX, y: t.clientY, inHeader: !!target && !!header.current?.contains(target) };
      last = { y: t.clientY, t: e.timeStamp };
      velocity = 0;
      offset = 0;
    };

    const onMove = (e: TouchEvent) => {
      if (!start || phase === 'free' || phase === 'idle') return;
      const t = e.touches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      if (phase === 'deciding') {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < SHEET_DRAG_INTENT_PX) return;
        const bodyAtTop = (body.current?.scrollTop ?? 0) <= 0;
        phase = dragsSheet({ dx, dy, inHeader: start.inHeader, bodyAtTop }) ? 'dragging' : 'free';
        if (phase === 'free') return;
      }
      // Arrastrando: el dedo mueve la hoja, no el cuerpo ni la página.
      e.preventDefault();
      const dt = e.timeStamp - last.t;
      if (dt > 0) velocity = (t.clientY - last.y) / dt;
      last = { y: t.clientY, t: e.timeStamp };
      offset = Math.max(0, dy);
      move(offset, false);
    };

    const onEnd = () => {
      if (phase === 'dragging') {
        if (shouldCloseSheet(offset, content.offsetHeight, velocity)) {
          move(content.offsetHeight, true);
          closing = setTimeout(() => close.current(), reduced ? 0 : SHEET_DRAG_MS);
        } else {
          move(0, true);
        }
      }
      phase = 'idle';
      start = null;
    };

    content.addEventListener('touchstart', onStart, { passive: true });
    // No pasivo: tiene que poder cancelar el scroll mientras arrastra la hoja.
    content.addEventListener('touchmove', onMove, { passive: false });
    content.addEventListener('touchend', onEnd);
    content.addEventListener('touchcancel', onEnd);
    return () => {
      clearTimeout(closing);
      content.removeEventListener('touchstart', onStart);
      content.removeEventListener('touchmove', onMove);
      content.removeEventListener('touchend', onEnd);
      content.removeEventListener('touchcancel', onEnd);
    };
  }, [content, header, body]);
}

export function Dialog({ open, onOpenChange, title, description, footer, children, headerBorder = true, dragToClose = true, size, placement, className }: DialogProps) {
  const resolvedPlacement: DialogPlacement = placement ?? 'center';
  const draggable = resolvedPlacement === 'sheet' && dragToClose;
  const [contentEl, setContentEl] = useState<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useSheetDrag(draggable ? contentEl : null, headerRef, bodyRef, () => onOpenChange(false));
  // Radix devuelve el foco a su propio `Dialog.Trigger`, que este DS no usa: sin esto el
  // foco se perdía al cerrar. Se captura el elemento activo antes de que el FocusScope
  // lo mueva adentro (onOpenAutoFocus corre antes del autofocus) y se restaura al cerrar.
  const opener = useRef<HTMLElement | null>(null);
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
        <RDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out motion-reduce:animate-none" />
        <RDialog.Content
          ref={setContentEl}
          data-placement={resolvedPlacement}
          className={cn(content({ size, placement: resolvedPlacement }), className)}
          onOpenAutoFocus={() => {
            opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            if (!opener.current?.isConnected) return;
            event.preventDefault();
            opener.current.focus();
          }}
        >
          <div ref={headerRef} className={cn('flex flex-col', headerBorder && 'border-b border-border')}>
          {/* Manija de la hoja: avisa que se puede arrastrar para cerrar. Es parte del encabezado, así que arrastrar desde ella mueve la hoja. */}
          {draggable && <div aria-hidden="true" data-sheet-handle="" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border-strong" />}
          <div className="flex items-start gap-4 px-5 py-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <RDialog.Title className="text-base font-semibold text-text">{title}</RDialog.Title>
              {description != null && (
                <RDialog.Description className="text-sm text-muted">{description}</RDialog.Description>
              )}
            </div>
            <RDialog.Close
              aria-label="Cerrar"
              className="-mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
            >
              <XIcon />
            </RDialog.Close>
          </div>
          </div>
          {children != null && <div ref={bodyRef} className="flex-1 overflow-y-auto px-5 py-4 text-sm text-text">{children}</div>}
          {footer != null && (
            <div
              className={cn(
                'flex items-center justify-end gap-2 border-t border-border bg-elevated/40 px-5 py-3',
                // Única clase arbitraria admitida: el pie de la hoja no puede quedar bajo el home indicator del
                // celular, y sin home indicator conserva el mismo aire que arriba.
                resolvedPlacement === 'sheet' && 'pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3',
              )}
            >
              {footer}
            </div>
          )}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
Dialog.displayName = 'Dialog';
