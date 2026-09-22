import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

export type StepState = 'done' | 'current' | 'pending';

export interface StepItem {
  label: string;
  state: StepState;
}

export interface StepperProps {
  /** Estado por paso: el componente no calcula progreso, sólo pinta. */
  steps: StepItem[];
  /** Nombre accesible del `<ol>`. Default 'Seguimiento del pedido'. */
  ariaLabel?: string;
  /** sm: text-xs; md: text-sm. Default 'md'. */
  size?: 'sm' | 'md';
  /** Default 'horizontal'. En anchos muy angostos conviene 'vertical'. */
  orientation?: 'horizontal' | 'vertical';
  /** Texto sólo para lectores de pantalla por estado. */
  stateLabels?: Partial<Record<StepState, string>>;
  className?: string;
}

const defaultStateLabels: Record<StepState, string> = {
  done: 'completado',
  current: 'en curso',
  pending: 'pendiente',
};

const dot = cva('flex shrink-0 items-center justify-center rounded-full border-2', {
  variants: {
    state: {
      done: 'border-success bg-success text-on-primary',
      current: 'border-primary bg-surface ring-4 ring-primary-soft',
      pending: 'border-border bg-surface',
    },
    size: { sm: 'h-4 w-4', md: 'h-5 w-5' },
  },
  defaultVariants: { state: 'pending', size: 'md' },
});

const label = cva('leading-snug', {
  variants: {
    state: {
      done: 'text-success',
      current: 'font-medium text-primary',
      pending: 'text-muted',
    },
    size: { sm: 'text-xs', md: 'text-sm' },
  },
  defaultVariants: { state: 'pending', size: 'md' },
});

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3/4 w-3/4">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * Seguimiento por pasos (`<ol>`): `done` en success con tilde, `current` en primary con
 * `aria-current="step"`, `pending` en muted. El estado también se anuncia por texto oculto.
 */
export function Stepper({
  steps,
  ariaLabel = 'Seguimiento del pedido',
  size = 'md',
  orientation = 'horizontal',
  stateLabels,
  className,
}: StepperProps) {
  const labels = { ...defaultStateLabels, ...stateLabels };
  const vertical = orientation === 'vertical';
  const connector = (done: boolean, hidden: boolean) =>
    cn(vertical ? 'w-0.5 flex-1' : 'h-0.5 flex-1', done ? 'bg-success' : 'bg-border', hidden && 'invisible');

  return (
    <ol
      aria-label={ariaLabel}
      data-orientation={orientation}
      className={cn('flex w-full', vertical ? 'flex-col' : 'items-start', className)}
    >
      {steps.map((step, i) => {
        const first = i === 0;
        const last = i === steps.length - 1;
        const prevDone = !first && steps[i - 1].state === 'done';
        return (
          <li
            key={`${step.label}-${i}`}
            aria-current={step.state === 'current' ? 'step' : undefined}
            className={cn(
              'relative flex min-w-0',
              vertical ? 'min-h-12 flex-row gap-3' : 'flex-1 flex-col items-center gap-2 text-center',
            )}
          >
            <span aria-hidden="true" className={cn('flex items-center', vertical ? 'flex-col self-stretch' : 'w-full')}>
              <span data-connector className={connector(prevDone, first)} />
              <span className={dot({ state: step.state, size })}>{step.state === 'done' && <Check />}</span>
              <span data-connector className={connector(step.state === 'done', last)} />
            </span>
            <span className={cn(label({ state: step.state, size }), vertical && 'py-1')}>
              {step.label}
              <span className="sr-only">, {labels[step.state]}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
