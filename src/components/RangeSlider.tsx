import { forwardRef } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '../lib/cn';

export interface RangeSliderProps {
  min: number;
  max: number;
  /** Default 1. */
  step?: number;
  /** Controlado: `[mínimo, máximo]`. */
  value: [number, number];
  /** Durante el arrastre / teclado. */
  onValueChange?: (value: [number, number]) => void;
  /** Al soltar o al terminar una interacción de teclado. */
  onValueCommit?: (value: [number, number]) => void;
  /** Default 1: los pulgares nunca se cruzan. */
  minStepsBetweenThumbs?: number;
  /** Alimenta `aria-valuetext` y los valores visibles. Default `String(n)`. */
  formatValue?: (n: number) => string;
  /** Default true: imprime los dos valores actuales bajo la pista. */
  showValues?: boolean;
  /** `aria-label` de cada pulgar. Default `['Mínimo', 'Máximo']`. */
  thumbLabels?: [string, string];
  disabled?: boolean;
  className?: string;
  /** `aria-label` del grupo (Root). */
  'aria-label'?: string;
}

const thumbClass =
  'block h-5 w-5 rounded-full border-2 border-primary bg-surface shadow-1 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none data-[disabled]:opacity-50';

export const RangeSlider = forwardRef<HTMLSpanElement, RangeSliderProps>(
  (
    {
      min,
      max,
      step = 1,
      value,
      onValueChange,
      onValueCommit,
      minStepsBetweenThumbs = 1,
      formatValue = String,
      showValues = true,
      thumbLabels = ['Mínimo', 'Máximo'],
      disabled,
      className,
      ...aria
    },
    ref,
  ) => {
    const asPair = (v: number[]): [number, number] => [v[0] ?? min, v[1] ?? max];
    return (
      <div className={cn('flex w-full flex-col gap-1', disabled && 'opacity-60', className)}>
        <Slider.Root
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={onValueChange ? (v) => onValueChange(asPair(v)) : undefined}
          onValueCommit={onValueCommit ? (v) => onValueCommit(asPair(v)) : undefined}
          minStepsBetweenThumbs={minStepsBetweenThumbs}
          disabled={disabled}
          aria-label={aria['aria-label']}
          className="relative flex w-full touch-none select-none items-center py-2"
        >
          <Slider.Track className="relative h-1 grow rounded-full bg-elevated">
            <Slider.Range className="absolute h-full rounded-full bg-primary" />
          </Slider.Track>
          <Slider.Thumb aria-label={thumbLabels[0]} aria-valuetext={formatValue(value[0])} className={thumbClass} />
          <Slider.Thumb aria-label={thumbLabels[1]} aria-valuetext={formatValue(value[1])} className={thumbClass} />
        </Slider.Root>
        {showValues && (
          <div className="flex justify-between text-xs tabular-nums text-muted">
            <span>{formatValue(value[0])}</span>
            <span>{formatValue(value[1])}</span>
          </div>
        )}
      </div>
    );
  },
);
RangeSlider.displayName = 'RangeSlider';
