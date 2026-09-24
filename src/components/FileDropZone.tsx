import { type KeyboardEvent, useCallback, useId, useRef, useState } from 'react';
import { cn } from '../lib/cn';

export interface FileDropZoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  hint?: string;
  /** Línea principal sin archivo. */
  title?: string;
  /** Texto antes del enlace resaltado. */
  selectPrefix?: string;
  /** Parte resaltada de la segunda línea. */
  selectLabel?: string;
  className?: string;
}

export const FileDropZone = ({
  file,
  onChange,
  accept,
  hint,
  title = 'Arrastre su archivo aquí',
  selectPrefix = 'o',
  selectLabel = 'selecciónelo desde su equipo',
  className,
}: FileDropZoneProps) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const hintId = useId();
  const openPicker = () => inputRef.current?.click();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) onChange(f);
    },
    [onChange],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-labelledby={labelId}
      aria-describedby={hint ? hintId : undefined}
      onKeyDown={handleKeyDown}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={openPicker}
      className={cn(
        'cursor-pointer rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        dragging ? 'border-primary bg-primary-soft' : 'border-border-strong bg-bg hover:border-primary',
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        tabIndex={-1}
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <div aria-hidden="true" className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-primary-soft">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
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
              {selectPrefix && `${selectPrefix} `}
              <span className="text-primary">{selectLabel}</span>
            </p>
          </>
        )}
      </div>
      {hint && (
        <p id={hintId} className="mt-2 text-xs text-subtle">
          {hint}
        </p>
      )}
    </div>
  );
};

FileDropZone.displayName = 'FileDropZone';
