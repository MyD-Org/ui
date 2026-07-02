import { type ReactNode } from 'react';
import * as RDialog from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const content = cva(
  'fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-2)] focus:outline-none',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-xl',
        lg: 'max-w-3xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type DialogSize = NonNullable<VariantProps<typeof content>['size']>;

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

export function Dialog({ open, onOpenChange, title, description, footer, children, headerBorder = true, size, className }: DialogProps) {
  return (
    <RDialog.Root open={open} onOpenChange={onOpenChange}>
      <RDialog.Portal>
        <RDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <RDialog.Content className={cn(content({ size }), className)}>
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
            <div className="flex items-center justify-end gap-2 border-t border-border bg-elevated/40 px-5 py-3">
              {footer}
            </div>
          )}
        </RDialog.Content>
      </RDialog.Portal>
    </RDialog.Root>
  );
}
Dialog.displayName = 'Dialog';
