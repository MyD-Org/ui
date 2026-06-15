import { type ReactNode } from 'react';
import * as RTabs from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

export interface TabItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

const list = cva('inline-flex items-center', {
  variants: {
    variant: {
      underline: 'gap-4 border-b border-border',
      pill: 'gap-1 rounded-full border border-border bg-elevated p-1',
    },
  },
  defaultVariants: { variant: 'underline' },
});

const trigger = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        underline:
          '-mb-px border-b-2 border-transparent px-1 py-2 text-muted hover:text-text data-[state=active]:border-primary data-[state=active]:text-primary',
        pill: 'rounded-full px-4 py-1.5 text-muted hover:text-text data-[state=active]:bg-primary data-[state=active]:text-on-primary',
      },
    },
    defaultVariants: { variant: 'underline' },
  },
);

export type TabsVariant = NonNullable<VariantProps<typeof list>['variant']>;

export interface TabsProps extends VariantProps<typeof list> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  ariaLabel?: string;
  className?: string;
  listClassName?: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, variant, ariaLabel, className, listClassName }: TabsProps) {
  return (
    <RTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
      className={className}
    >
      <RTabs.List aria-label={ariaLabel} className={cn(list({ variant }), listClassName)}>
        {items.map((item) => (
          <RTabs.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={cn(trigger({ variant }))}
          >
            {item.label}
          </RTabs.Trigger>
        ))}
      </RTabs.List>
    </RTabs.Root>
  );
}
Tabs.displayName = 'Tabs';
