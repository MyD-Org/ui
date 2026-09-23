import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface CtaBannerProps extends HTMLAttributes<HTMLElement> {
  icon: ReactNode;
  /** Vacío o ausente ⇒ no se muestra. */
  title?: string;
  /** Vacío o ausente ⇒ no se muestra. */
  text?: string;
  cta: { label: string; href: string };
}

export function CtaBanner({ icon, title, text, cta, className, ...props }: CtaBannerProps) {
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
          {title ? <p className="text-lg font-extrabold">{title}</p> : null}
          {text ? <p className="text-sm text-on-primary/70">{text}</p> : null}
        </div>
      </div>
      <a
        href={cta.href}
        className="shrink-0 rounded-full border-2 border-on-primary/60 px-6 py-2.5 text-sm font-bold transition-colors hover:bg-on-primary hover:text-primary"
      >
        {cta.label}
      </a>
    </section>
  );
}
