import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  onClear?: () => void;
  clearLabel?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onValueChange, onClear, clearLabel = 'Limpiar búsqueda', placeholder = 'Buscar...', className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-sm text-text transition-colors',
          'focus-within:border-primary',
          className,
        )}
      >
        <span className="shrink-0 text-muted">
          <SearchIcon />
        </span>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
          {...props}
        />
        {value && (
          <button
            type="button"
            aria-label={clearLabel}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onValueChange('');
              onClear?.();
            }}
            className="shrink-0 text-muted transition-opacity hover:opacity-70"
          >
            <XIcon />
          </button>
        )}
      </div>
    );
  },
);
SearchInput.displayName = 'SearchInput';
