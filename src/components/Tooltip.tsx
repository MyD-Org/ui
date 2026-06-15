import { type ReactNode } from 'react';
import * as RTooltip from '@radix-ui/react-tooltip';
import { cn } from '../lib/cn';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayMs?: number;
  className?: string;
  /** Usar el TooltipProvider del consumidor en lugar de envolver con uno nuevo. */
  skipProvider?: boolean;
}

export interface TooltipProviderProps {
  children: ReactNode;
  delayDuration?: number;
}

export function TooltipProvider({ children, delayDuration = 300 }: TooltipProviderProps) {
  return <RTooltip.Provider delayDuration={delayDuration}>{children}</RTooltip.Provider>;
}

function Inner({ content, children, side = 'top', align = 'center', delayMs, className }: TooltipProps) {
  return (
    <RTooltip.Root delayDuration={delayMs}>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          side={side}
          align={align}
          sideOffset={6}
          className={cn(
            'z-50 max-w-[16rem] rounded-md bg-text px-2.5 py-1.5 text-xs text-on-primary shadow-[var(--shadow-1)]',
            className,
          )}
        >
          {content}
          <RTooltip.Arrow className="fill-text" />
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  );
}

export function Tooltip(props: TooltipProps) {
  if (props.skipProvider) return <Inner {...props} />;
  return (
    <TooltipProvider>
      <Inner {...props} />
    </TooltipProvider>
  );
}
Tooltip.displayName = 'Tooltip';
