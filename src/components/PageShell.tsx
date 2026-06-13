import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface PageShellProps {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageShell({ title, actions, children, className }: PageShellProps) {
  return (
    <div className={cn('min-h-screen bg-bg text-text font-sans', className)}>
      <div className="mx-auto max-w-3xl px-6 py-8">
        {(title || actions) && (
          <header className="mb-6 flex items-center justify-between gap-4">
            {title ? <h1 className="text-xl font-semibold text-text">{title}</h1> : <span />}
            {actions}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}
