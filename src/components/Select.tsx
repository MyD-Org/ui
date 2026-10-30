'use client';

import { useState, useSyncExternalStore } from 'react';
import * as RSelect from '@radix-ui/react-select';
import { cn } from '../lib/cn.js';
import { Badge, type BadgeTone } from './Badge.js';

export interface SelectOption {
  label: string;
  value: string;
  /** Etiqueta junto al texto (ej. "Sin interés"). Se ve en la lista y en el campo cuando está elegida. */
  badge?: { label: string; tone?: BadgeTone };
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

/**
 * Pantalla táctil (`pointer: coarse`): ahí el Select usa el `<select>` nativo.
 * En el servidor y en la hidratación vale `false` (Radix) y cambia recién en el cliente.
 */
const TACTIL = '(pointer: coarse)';
function suscribirTactil(cb: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  const mq = window.matchMedia(TACTIL);
  mq.addEventListener?.('change', cb);
  return () => mq.removeEventListener?.('change', cb);
}
function esTactil() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(TACTIL).matches;
}
function usePantallaTactil() {
  return useSyncExternalStore(suscribirTactil, esTactil, () => false);
}

const TRIGGER = cn(
  'inline-flex w-full items-center justify-between gap-2 rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text',
  'transition-[color,box-shadow,border-color] duration-150 ease-out',
);

function OptionContent({ option }: { option: SelectOption }) {
  if (!option.badge) return <>{option.label}</>;
  // Una sola línea: el texto se recorta si no entra y la etiqueta no se parte.
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="truncate">{option.label}</span>
      <Badge tone={option.badge.tone} className="shrink-0 whitespace-nowrap">
        {option.badge.label}
      </Badge>
    </span>
  );
}

/**
 * Select nativo para pantallas táctiles. Radix Select falla con el dedo: la flecha sólo abre
 * (con la lista abierta, el toque la cierra y el clic la vuelve a abrir) y en navegadores
 * embebidos (Instagram) la lista se cierra con el `resize` del toque antes de elegir, y ese
 * toque cierra además el Dialog que la contiene. El `<select>` va invisible encima del campo
 * dibujado, así se conservan el aspecto y el badge, y el teléfono muestra su propio selector.
 */
function NativeSelect({
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
  const [interno, setInterno] = useState(defaultValue ?? '');
  const actual = value ?? interno;
  const elegida = options.find((o) => o.value === actual);
  return (
    <div
      className={cn(
        TRIGGER,
        'relative has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-[var(--color-ring)]',
        disabled && 'opacity-50',
        className,
      )}
      data-native=""
    >
      <span className={cn('flex min-w-0 flex-1 text-left', !elegida && 'text-muted')} aria-hidden="true">
        {elegida ? <OptionContent option={elegida} /> : placeholder}
      </span>
      <span className="shrink-0 text-muted" aria-hidden="true">
        <ChevronIcon />
      </span>
      <select
        id={id}
        name={name}
        disabled={disabled}
        value={actual}
        aria-label={aria['aria-label']}
        aria-invalid={aria['aria-invalid']}
        aria-describedby={aria['aria-describedby']}
        onChange={(e) => {
          if (value === undefined) setInterno(e.target.value);
          onValueChange?.(e.target.value);
        }}
        // 16px: con menos, Safari de iOS hace zoom al enfocar.
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0 text-base disabled:cursor-default"
      >
        {!elegida && (
          <option value={actual} disabled hidden>
            {placeholder ?? ''}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.badge ? `${o.label} · ${o.badge.label}` : o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Select(props: SelectProps) {
  const tactil = usePantallaTactil();
  return tactil ? <NativeSelect {...props} /> : <RadixSelect {...props} />;
}

function RadixSelect({
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
          TRIGGER,
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
          'disabled:opacity-50 disabled:pointer-events-none data-[placeholder]:text-muted',
          className,
        )}
      >
        <span className="flex min-w-0 flex-1 text-left">
          <RSelect.Value placeholder={placeholder} />
        </span>
        <RSelect.Icon className="shrink-0 text-muted">
          <ChevronIcon />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={6}
          className="z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-menu-1 border border-border bg-surface text-text shadow-2"
        >
          <RSelect.Viewport className="p-1">
            {options.map((o) => (
              <RSelect.Item
                key={o.value}
                value={o.value}
                className={cn(
                  // Ítem rounded-sm, como el trigger; el contenedor (Viewport p-1) usa
                  // rounded-menu-1 = sm + padding para que las curvas sean concéntricas
                  // (ver tokens.css).
                  'relative flex cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm outline-none',
                  'data-[highlighted]:bg-elevated data-[state=checked]:font-medium data-[disabled]:opacity-50',
                )}
              >
                <RSelect.ItemIndicator className="absolute left-2 inline-flex items-center text-primary">
                  <CheckIcon />
                </RSelect.ItemIndicator>
                <RSelect.ItemText>
                  <OptionContent option={o} />
                </RSelect.ItemText>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}
