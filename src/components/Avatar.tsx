import { type HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const avatar = cva(
  'inline-flex items-center justify-center overflow-hidden rounded-full bg-primary text-on-primary font-medium select-none',
  {
    variants: { size: { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' } },
    defaultVariants: { size: 'md' },
  },
);

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const chars = (s: string) => Array.from(s);
  if (parts.length === 1) return chars(parts[0]).slice(0, 2).join('').toUpperCase();
  return (chars(parts[0])[0] + chars(parts[parts.length - 1])[0]).toUpperCase();
}

export interface AvatarProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatar> {
  src?: string;
  name: string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, src, name, ...props }, ref) => (
    <span ref={ref} aria-label={src ? undefined : name} className={cn(avatar({ size }), className)} {...props}>
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials(name)}
    </span>
  ),
);
Avatar.displayName = 'Avatar';
