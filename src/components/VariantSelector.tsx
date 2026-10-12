'use client';

import { Fragment, type KeyboardEvent, useId, useRef } from 'react';
import { cn } from '../lib/cn.js';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink.js';

export interface VariantOption {
  /** Identificador estable de la opción (ej. el id de la variante). */
  id: string;
  /** Texto visible y nombre accesible (ej. "Verde"). */
  label: string;
  /** Si se indica, la opción es un enlace a la ficha de esa variante (se dibuja con `renderLink`). */
  href?: string;
  /** Color de la muestra (cualquier color CSS, ej. "#2e7d32"). Es dato del producto, no de la marca. */
  swatch?: string;
  /** Agotada: se ve y se puede elegir (para mostrar "Sin stock"), pero queda tachada y anunciada. */
  soldOut?: boolean;
  /** No elegible (ej. combinación inexistente): atenuada y fuera del teclado. */
  disabled?: boolean;
}

export type VariantSelectorSize = 'sm' | 'md';

export interface VariantSelectorProps {
  /** Nombre del grupo (ej. "Color"). Es el nombre accesible del grupo. */
  label: string;
  /** Oculta el nombre del grupo a la vista (sigue disponible para lectores de pantalla). */
  hideLabel?: boolean;
  options: VariantOption[];
  /** Id de la opción elegida (controlado). `null` = ninguna. */
  value: string | null;
  onChange: (id: string) => void;
  /** `sm` para la card, `md` para la ficha. Default `md`. */
  size?: VariantSelectorSize;
  /** Texto anunciado junto a una opción agotada. Default "Sin stock". */
  soldOutLabel?: string;
  /** Texto anunciado junto a una opción no disponible. Default "No disponible". */
  unavailableLabel?: string;
  /** Enlace del framework para las opciones con `href` (ej. `next/link`). */
  renderLink?: RenderLink;
  className?: string;
  id?: string;
}

const SIZE: Record<VariantSelectorSize, string> = {
  sm: 'gap-1 px-2.5 py-1 text-xs',
  md: 'gap-1.5 px-3.5 py-1.5 text-sm',
};

function chipClass(size: VariantSelectorSize, selected: boolean, o: VariantOption): string {
  return cn(
    'inline-flex items-center rounded-full border font-medium transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
    SIZE[size],
    selected
      ? 'border-primary bg-primary text-on-primary'
      : 'border-border-strong bg-surface text-text hover:bg-elevated',
    o.soldOut && 'line-through',
    o.soldOut && !selected && 'border-dashed text-muted',
    o.disabled && 'cursor-not-allowed opacity-40 hover:bg-surface',
  );
}

/**
 * Selector de una opción de producto (color, potencia…) para la ficha y la card.
 *
 * Sin `href` es un `radiogroup` controlado con roving tabindex: una sola parada de Tab y
 * flechas ←/→/↑/↓ (más Inicio/Fin) que mueven y eligen. Si alguna opción trae `href`, el grupo
 * pasa a ser una lista de enlaces (`renderLink`), con `aria-current="page"` en la elegida y
 * Tab entre ellos: es lo que corresponde cuando cada variante tiene su propia URL.
 * Una opción agotada se ve tachada y se anuncia con `soldOutLabel`, pero se puede elegir.
 */
export function VariantSelector({
  label,
  hideLabel,
  options,
  value,
  onChange,
  size = 'md',
  soldOutLabel = 'Sin stock',
  unavailableLabel = 'No disponible',
  renderLink = defaultRenderLink,
  className,
  id,
}: VariantSelectorProps) {
  const auto = useId();
  const base = id ?? auto;
  const labelId = `${base}-label`;
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const conLinks = options.some((o) => o.href);

  const habilitadas = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
  const elegida = options.findIndex((o) => o.id === value && !o.disabled);
  const paradaTab = elegida >= 0 ? elegida : (habilitadas[0] ?? -1);

  function nota(o: VariantOption) {
    const texto = o.disabled ? unavailableLabel : o.soldOut ? soldOutLabel : null;
    return texto ? <span className="sr-only">{`, ${texto}`}</span> : null;
  }

  function contenido(o: VariantOption) {
    return (
      <>
        {o.swatch && (
          <span
            aria-hidden="true"
            data-slot="swatch"
            className={cn('shrink-0 rounded-full border border-border-strong', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')}
            style={{ backgroundColor: o.swatch }}
          />
        )}
        <span>
          {o.label}
          {nota(o)}
        </span>
      </>
    );
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (habilitadas.length === 0) return;
    const enFoco = refs.current.indexOf(document.activeElement as HTMLButtonElement);
    const actual = habilitadas.indexOf(enFoco >= 0 ? enFoco : elegida);
    let destino: number | undefined;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        destino = habilitadas[(actual + 1) % habilitadas.length];
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        destino = habilitadas[(actual - 1 + habilitadas.length) % habilitadas.length];
        break;
      case 'Home':
        destino = habilitadas[0];
        break;
      case 'End':
        destino = habilitadas[habilitadas.length - 1];
        break;
      default:
        return;
    }
    e.preventDefault();
    if (destino === undefined) return;
    refs.current[destino]?.focus();
    onChange(options[destino].id);
  }

  return (
    <div className={cn('flex flex-col', size === 'sm' ? 'gap-1' : 'gap-2', className)}>
      <span
        id={labelId}
        className={cn(hideLabel ? 'sr-only' : cn('font-medium text-text', size === 'sm' ? 'text-xs' : 'text-sm'))}
      >
        {label}
      </span>
      <div
        role={conLinks ? 'group' : 'radiogroup'}
        aria-labelledby={labelId}
        onKeyDown={conLinks ? undefined : onKeyDown}
        className={cn('flex flex-wrap', size === 'sm' ? 'gap-1' : 'gap-2')}
      >
        {options.map((o, i) => {
          const selected = i === elegida;
          if (conLinks && o.href && !o.disabled) {
            return (
              <Fragment key={o.id}>
                {renderLink({
                  href: o.href,
                  className: chipClass(size, selected, o),
                  'aria-current': selected ? 'page' : undefined,
                  onClick: () => onChange(o.id),
                  children: contenido(o),
                })}
              </Fragment>
            );
          }
          if (conLinks) {
            return (
              <span key={o.id} aria-disabled={o.disabled ? true : undefined} className={chipClass(size, selected, o)}>
                {contenido(o)}
              </span>
            );
          }
          return (
            <button
              key={o.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={o.disabled}
              tabIndex={i === paradaTab ? 0 : -1}
              onClick={() => onChange(o.id)}
              className={chipClass(size, selected, o)}
            >
              {contenido(o)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
