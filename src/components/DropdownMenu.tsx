import { type ReactNode } from 'react';
import * as RDD from '@radix-ui/react-dropdown-menu';
import { cn } from '../lib/cn';

export type DropdownMenuItemTone = 'default' | 'danger';

export interface DropdownMenuItem {
  type?: 'item';
  label: ReactNode;
  icon?: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  tone?: DropdownMenuItemTone;
}

export interface DropdownMenuSeparator {
  type: 'separator';
}

export interface DropdownMenuLabel {
  type: 'label';
  label: ReactNode;
}

export type DropdownMenuEntry = DropdownMenuItem | DropdownMenuSeparator | DropdownMenuLabel;

export interface DropdownMenuProps {
  items: DropdownMenuEntry[];
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const itemToneClass: Record<DropdownMenuItemTone, string> = {
  default: 'text-text data-[highlighted]:bg-elevated',
  danger: 'text-danger data-[highlighted]:bg-danger-soft',
};

export function DropdownMenu({ items, children, align = 'end', side = 'bottom', className, open, defaultOpen, onOpenChange }: DropdownMenuProps) {
  return (
    <RDD.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <RDD.Trigger asChild>{children}</RDD.Trigger>
      <RDD.Portal>
        <RDD.Content
          align={align}
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 min-w-[12rem] rounded-md border border-border bg-surface p-1 text-sm shadow-[var(--shadow-2)]',
            'focus-visible:outline-none',
            className,
          )}
        >
          {items.map((entry, i) => {
            if (entry.type === 'separator') {
              return <RDD.Separator key={i} className="my-1 h-px bg-border" />;
            }
            if (entry.type === 'label') {
              return (
                <RDD.Label key={i} className="px-3 py-1.5 text-xs font-semibold text-muted">
                  {entry.label}
                </RDD.Label>
              );
            }
            const tone = entry.tone ?? 'default';
            return (
              <RDD.Item
                key={i}
                disabled={entry.disabled}
                onSelect={() => entry.onSelect?.()}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-sm px-3 py-2 outline-none transition-colors',
                  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
                  itemToneClass[tone],
                )}
              >
                {entry.icon}
                <span className="flex-1 truncate">{entry.label}</span>
              </RDD.Item>
            );
          })}
        </RDD.Content>
      </RDD.Portal>
    </RDD.Root>
  );
}
DropdownMenu.displayName = 'DropdownMenu';
