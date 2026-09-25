'use client';

import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface ServiceCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  /** Vacío o ausente ⇒ no se muestra. */
  title?: string;
  /** Vacío o ausente ⇒ no se muestra. */
  text?: string;
}

export function ServiceCard({ icon, title, text, className, ...props }: ServiceCardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-border/50 bg-surface p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-2',
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-accent-soft text-accent-strong [&_svg]:h-[22px] [&_svg]:w-[22px]">
        {icon}
      </div>
      {title ? <b className="block text-[15px] font-extrabold text-text">{title}</b> : null}
      {text ? <span className="mt-1.5 block text-[13px] leading-snug text-muted">{text}</span> : null}
    </div>
  );
}
