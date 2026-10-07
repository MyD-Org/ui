'use client';

import { type ChangeEvent, type ReactNode, forwardRef, useId, useState } from 'react';
import { cn } from '../lib/cn.js';
import { Badge, type BadgeTone } from './Badge.js';

export interface RadioAction {
  /** Texto visible del enlace/botón final (ej. "Editar"). */
  label: string;
  /** Nombre accesible si el texto solo no alcanza (ej. "Editar Calle Falsa 123"). */
  ariaLabel?: string;
  onClick: () => void;
}

export interface RadioBadge {
  label: string;
  tone?: BadgeTone;
}

export interface RadioOption {
  value: string;
  /** Título de la opción. */
  label: string;
  /** Segunda línea (secundaria, `text-muted`). */
  description?: string;
  /** Etiqueta junto al título (ej. "Predeterminada"). */
  badge?: RadioBadge;
  /** Acción final de la fila (ej. "Editar"). Es un botón aparte: no cambia la selección. */
  action?: RadioAction;
  /** Ícono o ilustración opcional antes del texto. */
  icon?: ReactNode;
  /**
   * Contenido que se muestra dentro de la fila, debajo del título, sólo mientras la opción
   * está elegida (ej. el formulario de ese medio de pago).
   */
  content?: ReactNode;
  disabled?: boolean;
}

export interface RadioProps {
  /** Radios con el mismo `name` forman un grupo (flechas del teclado). */
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  badge?: RadioBadge;
  action?: RadioAction;
  icon?: ReactNode;
  /** Ver `RadioOption.content`: se muestra sólo con `checked`. */
  content?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * Una fila de opción: `<input type="radio">` nativo (teclado, foco y formularios gratis)
 * oculto visualmente, un punto dibujado con tokens y, opcionalmente, descripción, badge y
 * una acción final. Con `content`, la fila elegida se abre y lo muestra debajo del título.
 * Para un grupo usar `RadioGroup`.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ name, value, checked, onChange, label, description, badge, action, icon, content, disabled, id, className }, ref) => {
    const auto = useId();
    const base = id ?? auto;
    const labelId = `${base}-label`;
    const descId = `${base}-desc`;
    const abierta = checked && content != null;
    return (
      <div
        data-slot="radio-row"
        data-checked={checked ? 'true' : undefined}
        className={cn(
          'rounded-md border bg-surface transition-colors duration-150',
          'has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[var(--color-ring)]',
          checked ? 'border-primary' : 'border-border hover:border-border-strong',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 px-4 py-3 transition-colors duration-150',
            abierta ? 'rounded-t-[inherit]' : 'rounded-[inherit]',
            checked && 'bg-primary-soft',
          )}
        >
        <label htmlFor={base} className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
          <input
            ref={ref}
            id={base}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            disabled={disabled}
            aria-labelledby={labelId}
            aria-describedby={description ? descId : undefined}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.checked) onChange(value);
            }}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={cn(
              'mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-150',
              checked ? 'border-primary bg-surface' : 'border-border-strong bg-surface',
            )}
          >
            <span className={cn('h-2 w-2 rounded-full bg-primary transition-opacity duration-150', checked ? 'opacity-100' : 'opacity-0')} />
          </span>
          {icon && <span className="mt-0.5 inline-flex shrink-0 items-center text-muted" aria-hidden="true">{icon}</span>}
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="flex flex-wrap items-center gap-2">
              <span id={labelId} className="text-sm font-medium text-text">{label}</span>
              {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
            </span>
            {description && (
              <span id={descId} className="text-sm text-muted">{description}</span>
            )}
          </span>
        </label>
        {action && (
          <button
            type="button"
            aria-label={action.ariaLabel}
            onClick={action.onClick}
            disabled={disabled}
            className="shrink-0 rounded-sm text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            {action.label}
          </button>
        )}
        </div>
        {abierta && (
          <div data-slot="radio-content" className="border-t border-border px-4 py-4">
            {content}
          </div>
        )}
      </div>
    );
  },
);
Radio.displayName = 'Radio';

export interface RadioGroupProps {
  /** Nombre del grupo: leyenda del `<fieldset>`. Obligatorio (nombre accesible). */
  legend: string;
  /** Oculta la leyenda visualmente (sigue leyéndose). */
  hideLegend?: boolean;
  options: RadioOption[];
  /** Valor elegido (controlado). */
  value?: string;
  /** Valor inicial (sin control). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `name` compartido por los radios; se genera uno si falta. */
  name?: string;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ legend, hideLegend, options, value, defaultValue, onValueChange, name, disabled, className }, ref) => {
    const auto = useId();
    const [interno, setInterno] = useState(defaultValue);
    const controlado = value !== undefined;
    const actual = controlado ? value : interno;

    const elegir = (v: string) => {
      if (!controlado) setInterno(v);
      onValueChange?.(v);
    };

    return (
      <fieldset ref={ref} role="radiogroup" disabled={disabled} className={cn('m-0 min-w-0 border-0 p-0', className)}>
        <legend className={cn('mb-2 p-0 text-sm font-medium text-text', hideLegend && 'sr-only')}>{legend}</legend>
        <div className="flex flex-col gap-2">
          {options.map((o) => (
            <Radio
              key={o.value}
              name={name ?? auto}
              value={o.value}
              checked={o.value === actual}
              onChange={elegir}
              label={o.label}
              description={o.description}
              badge={o.badge}
              action={o.action}
              icon={o.icon}
              content={o.content}
              disabled={disabled || o.disabled}
            />
          ))}
        </div>
      </fieldset>
    );
  },
);
RadioGroup.displayName = 'RadioGroup';
