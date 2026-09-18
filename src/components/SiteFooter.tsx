import { type HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface SiteFooterLink {
  label: string;
  href: string;
}

export interface SiteFooterColumn {
  title: string;
  links: SiteFooterLink[];
}

export interface SiteFooterProps extends HTMLAttributes<HTMLElement> {
  brandName: string;
  brandAccent?: string;
  description: string;
  columns: SiteFooterColumn[];
  barLeft?: string;
  barRight?: string;
}

export function SiteFooter({ brandName, brandAccent, description, columns, barLeft, barRight, className, ...props }: SiteFooterProps) {
  return (
    <footer className={cn('mt-2 rounded-t-[32px] bg-primary text-on-primary', className)} {...props}>
      <div className="mx-auto grid max-w-[1280px] gap-9 px-[clamp(18px,4vw,48px)] py-[clamp(48px,6vw,80px)] lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <span className="font-display text-3xl font-semibold">
            {brandName}
            {brandAccent ? <em className="italic text-highlight"> {brandAccent}</em> : null}
          </span>
          <p className="mt-4 max-w-[34ch] text-sm leading-[1.7] text-on-primary/60">{description}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h5 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-on-primary/45">
              {col.title}
            </h5>
            {col.links.map((link) => (
              <a
                key={link.label + link.href}
                href={link.href}
                className="block py-1.5 text-[14.5px] font-semibold text-on-primary/85 transition-[color,padding-left] duration-150 hover:pl-1.5 hover:text-highlight"
              >
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      {barLeft || barRight ? (
        <div className="border-t border-on-primary/15">
          <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-4 px-[clamp(18px,4vw,48px)] py-5 text-xs font-semibold text-on-primary/45">
            <span>{barLeft}</span>
            <span>{barRight}</span>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
