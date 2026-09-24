import { type DragEvent, type KeyboardEvent, useCallback, useId, useRef, useState } from 'react';
import { cn } from '../lib/cn';

export interface FileDropZoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  /** Ayuda debajo del texto (formatos, tamaño máximo). Se asocia con `aria-describedby`. */
  hint?: string;
  /** Texto principal cuando no hay archivo. Default: "Arrastre su archivo aquí". */
  title?: string;
  /** Conector antes de `browseLabel`. Default: "o". Pase `''` para omitirlo. */
  orLabel?: string;
  /** Acción de selección, resaltada con el color primario. Default: "selecciónelo desde su equipo". */
  browseLabel?: string;
  /** Error de validación: borde `danger`, `aria-invalid` y se lee con `aria-describedby`. */
  error?: string;
  /** Deshabilita click, teclado y arrastre. */
  disabled?: boolean;
  /** `id` del elemento enfocable (p. ej. para un `<label htmlFor>` externo). */
  id?: string;
  className?: string;
}

export const FileDropZone = ({
  file,
  onChange,
  accept,
  hint,
  title = 'Arrastre su archivo aquí',
  orLabel = 'o',
  browseLabel = 'selecciónelo desde su equipo',
  error,
  disabled = false,
  id,
  className,
}: FileDropZoneProps) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const f = e.dataTransfer.files?.[0];
      if (f) onChange(f);
    },
    [onChange, disabled],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  };

  return (
    <div
      id={id}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      aria-disabled={disabled || undefined}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      className={cn(
        'rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        error
          ? 'border-danger bg-bg'
          : dragging
            ? 'border-primary bg-primary-soft'
            : cn('border-border-strong bg-bg', !disabled && 'hover:border-primary'),
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-primary-soft">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div id={labelId}>
        {file ? (
          <p className="text-sm font-medium text-text">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-text">{title}</p>
            <p className="mt-1 text-xs text-muted">
              {orLabel ? `${orLabel} ` : null}
              <span className="text-primary">{browseLabel}</span>
            </p>
          </>
        )}
      </div>
      {hint && (
        <p id={hintId} className="mt-2 text-xs text-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
};

FileDropZone.displayName = 'FileDropZone';
