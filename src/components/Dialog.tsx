import { type ReactNode, useRef } from 'react';
import * as RDialog from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const content = cva(
  'fixed z-50 flex flex-col overflow-hidden bg-surface shadow-[var(--shadow-2)] focus:outline-none',
  {
    variants: {
      placement: {
        center: 'left-1/2 top-1/2 max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg',
        /** Hoja anclada abajo, a todo el ancho (filtros en mobile). */
        sheet: 'inset-x-0 bottom-0 max-h-[92vh] w-full max-w-none rounded-t-lg rounded-b-none',
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
  className?: string;
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function Dialog({ open, onOpenChange, title, description, footer, children, headerBorder = true, size, placement, className }: DialogProps) {
  const resolvedPlacement: DialogPlacement = placement ?? 'center';
  // Radix devuelve el foco a su propio `Dialog.Trigger`, que este DS no usa: sin esto el
  // foco se perdía al cerrar. Se captura el elemento activo antes de que el FocusScope
  // lo mueva adentro (onOpenAutoFocus corre antes del autofocus) y se restaura al cerrar.
  const opener = useRef<HTMLElement | null>(null);
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
        <RDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <RDialog.Content
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
          <div className={cn('flex items-start gap-4 px-5 py-4', headerBorder && 'border-b border-border')}>
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
          {children != null && <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-text">{children}</div>}
          {footer != null && (
            <div
              className={cn(
                'flex items-center justify-end gap-2 border-t border-border bg-elevated/40 px-5 py-3',
                // Única clase arbitraria admitida: el pie de la hoja no puede quedar bajo el home indicator del celular.
                resolvedPlacement === 'sheet' && 'pb-[env(safe-area-inset-bottom)] pt-3',
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
