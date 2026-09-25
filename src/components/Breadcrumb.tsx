'use client';

import { type HTMLAttributes, type ReactNode, Fragment, forwardRef } from 'react';
import { cn } from '../lib/cn.js';
import { type RenderLink, defaultRenderLink } from '../lib/renderLink.js';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  items: BreadcrumbItem[];
  /** Default '/'. */
  separator?: ReactNode;
  /** Nombre accesible del `<nav>`. Default 'Ubicación'. */
  ariaLabel?: string;
  renderLink?: RenderLink;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = '/', ariaLabel = 'Ubicación', renderLink = defaultRenderLink, className, ...props }, ref) => (
    <nav ref={ref} aria-label={ariaLabel} className={className} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 && (
                <li aria-hidden="true" className="select-none text-subtle">
                  {separator}
                </li>
              )}
              <li className={cn('min-w-0', last && 'truncate')}>
                {last || !item.href ? (
                  <span aria-current={last ? 'page' : undefined} className={cn(last && 'font-medium text-text')}>
                    {item.label}
                  </span>
                ) : (
                  renderLink({ href: item.href, className: 'transition-colors hover:text-text', children: item.label })
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  ),
);
Breadcrumb.displayName = 'Breadcrumb';
