import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text transition-[color,box-shadow,border-color] duration-150 ease-out',
        'placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        'disabled:opacity-50 resize-y min-h-20',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
