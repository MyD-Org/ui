import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink';
import { visibleOnClass, type VisibleOn } from '../lib/visibleOn';

export interface CtaBannerProps extends HTMLAttributes<HTMLElement> {
  icon: ReactNode;
  /** Vacío o ausente ⇒ no se muestra. */
  title?: string;
  /** Dónde se ve el título. Ausente ⇒ en los dos tamaños. Lo mismo `textVisibleOn`. */
  titleVisibleOn?: VisibleOn;
  /** Vacío o ausente ⇒ no se muestra. */
  text?: string;
  textVisibleOn?: VisibleOn;
  cta: { label: string; href: string };
  /**
   * Enlace del framework (ej. `next/link`) para el botón. Sin esto son `<a>`
   * comunes y cada clic recarga la página entera.
   */
  renderLink?: RenderLink;
}

export function CtaBanner({
  icon,
  title,
  titleVisibleOn,
  text,
  textVisibleOn,
  cta,
  renderLink = defaultRenderLink,
  className,
  ...props
}: CtaBannerProps) {
  return (
    <section
      className={cn(
        'flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[28px] bg-primary px-[clamp(24px,5vw,72px)] py-10 text-on-primary',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-5">
        <span className="[&_svg]:h-8 [&_svg]:w-8 [&_svg]:text-highlight">{icon}</span>
        <div>
          {title ? <p className={cn('text-lg font-extrabold', visibleOnClass(titleVisibleOn))}>{title}</p> : null}
          {text ? <p className={cn('text-sm text-on-primary/70', visibleOnClass(textVisibleOn))}>{text}</p> : null}
        </div>
      </div>
      {renderLink({
        href: cta.href,
        className:
          'shrink-0 rounded-full border-2 border-on-primary/60 px-6 py-2.5 text-sm font-bold transition-colors hover:bg-on-primary hover:text-primary',
        children: cta.label,
      })}
    </section>
  );
}
