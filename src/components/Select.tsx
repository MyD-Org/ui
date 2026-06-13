import * as RSelect from '@radix-ui/react-select';
import { cn } from '../lib/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled,
  name,
  id,
  className,
  ...aria
}: SelectProps) {
  return (
    <RSelect.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled} name={name}>
      <RSelect.Trigger
        id={id}
        aria-label={aria['aria-label']}
        aria-invalid={aria['aria-invalid']}
        aria-describedby={aria['aria-describedby']}
        className={cn(
          'inline-flex w-full items-center justify-between gap-2 rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text',
          'transition-[color,box-shadow,border-color] duration-150 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
          'disabled:opacity-50 disabled:pointer-events-none data-[placeholder]:text-muted',
          className,
        )}
      >
        <RSelect.Value placeholder={placeholder} />
        <RSelect.Icon className="shrink-0 text-muted">
          <ChevronIcon />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border bg-surface text-text shadow-2"
        >
          <RSelect.Viewport className="p-1">
            {options.map((o) => (
              <RSelect.Item
                key={o.value}
                value={o.value}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm outline-none',
                  'data-[highlighted]:bg-elevated data-[state=checked]:font-medium data-[disabled]:opacity-50',
                )}
              >
                <RSelect.ItemIndicator className="absolute left-2 inline-flex items-center text-primary">
                  <CheckIcon />
                </RSelect.ItemIndicator>
                <RSelect.ItemText>{o.label}</RSelect.ItemText>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}
