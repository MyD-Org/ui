# Design System `@myd-org/ui` — Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar `@myd-org/ui@0.1.0` (tokens semánticos + 9 componentes Tailwind) a GitHub Packages y adoptarlo en dos sustratos — ai-dashboard (Tailwind) y ai-widget (CSS plano) — probando que el contrato de tokens cruza ambos.

**Architecture:** Repo propio (`~/Documents/projects/owns/ui`) que publica una librería React. Los tokens viven en dos archivos: `tokens.css` (CSS plano puro: `:root` con roles semánticos + theme default) y `tailwind.css` (`@import "./tokens.css"` + `@theme inline` que mapea roles a utilidades Tailwind v4). Los componentes se escriben en `.tsx` con clases Tailwind utility (estrategia A: ship source, el consumidor compila vía `@source`). Variantes vía CVA, merge de clases vía `cn` (clsx + tailwind-merge). El widget consume solo `tokens.css` y re-mapea sus `--aichat-*` sobre los roles.

**Tech Stack:** React 18 (peer `>=18`), TypeScript estricto, tsup (ESM+CJS+dts), vitest + Testing Library + jsdom, class-variance-authority, clsx, tailwind-merge, Tailwind v4, Vite (playground).

**Convención SDUI-ready (North Star del spec):** variantes por string enum (nunca subcomponentes estilados), componentes controlados sin estado oculto, props planas y tipadas. Los datos tabulares y opciones se pasan como arrays serializables (`options`, `columns`/`rows`), no como children JSX.

**Patrón de cada tarea de componente:** test (jsdom verifica comportamiento + que aplica la clase de variante correcta — NO compila Tailwind) → correr y ver fallar → implementación mínima → correr y ver pasar → commit. La verificación visual / de compilación Tailwind se hace en el playground (Task 14) y el dashboard (Task 16).

---

## File Structure

```
ui/
  package.json            # Task 1
  tsconfig.json           # Task 1
  tsup.config.ts          # Task 1
  vitest.config.ts        # Task 1
  vitest.setup.ts         # Task 1
  .npmrc                  # Task 1
  src/
    index.ts              # Task 13 — barrel de exports
    lib/cn.ts             # Task 2
    styles/
      tokens.css          # Task 3 — :root roles + theme default (CSS plano puro)
      tailwind.css        # Task 3 — @import tokens.css + @theme inline
    components/
      Button.tsx          # Task 4
      Input.tsx           # Task 5
      Textarea.tsx        # Task 6
      Field.tsx           # Task 7
      Select.tsx          # Task 8
      Card.tsx            # Task 9
      Table.tsx           # Task 10
      Badge.tsx           # Task 11
      PageShell.tsx       # Task 12
  example/                # Task 14 — playground Vite + Tailwind (verificación visual)
    vite.config.ts
    index.html
    styles.css
    main.tsx
```

Consumidores externos (no en este repo):
- `ai-dashboard` — Task 16 (camino Tailwind)
- `ai-widget` — Task 17 (camino CSS plano)

---

## Task 1: Scaffold del repo y tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsup.config.ts`, `vitest.config.ts`, `vitest.setup.ts`, `.npmrc`

- [ ] **Step 1: Crear `package.json`**

```json
{
  "name": "@myd-org/ui",
  "version": "0.1.0",
  "description": "Shared design system for the MyD venture frontends",
  "license": "UNLICENSED",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "files": ["dist"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./tokens.css": "./dist/tokens.css",
    "./tailwind.css": "./dist/tailwind.css"
  },
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build",
    "example": "vite --config example/vite.config.ts"
  },
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.7.0",
    "jsdom": "^25.0.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^4",
    "tsup": "^8.3.5",
    "typescript": "^5.7.2",
    "vite": "^5.4.21",
    "vitest": "^2.1.8"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "repository": { "type": "git", "url": "git+https://github.com/MyD-Org/ui.git" }
}
```

- [ ] **Step 2: Crear `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src", "vitest.setup.ts"]
}
```

- [ ] **Step 3: Crear `tsup.config.ts`**

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  publicDir: 'src/styles', // copia tokens.css + tailwind.css → dist/
});
```

- [ ] **Step 4: Crear `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

- [ ] **Step 5: Crear `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Crear `.npmrc`** (publicación + consumo del scope a GitHub Packages)

```
@myd-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

- [ ] **Step 7: Instalar dependencias**

Run: `cd ~/Documents/projects/owns/ui && npm install`
Expected: instala sin errores, genera `package-lock.json` y `node_modules/`.

- [ ] **Step 8: Verificar typecheck (vacío todavía)**

Run: `npm run typecheck`
Expected: PASS (sin archivos en `src/` aún, `tsc` no reporta nada). Si se queja por `src` inexistente, crear `src/` con `mkdir -p src/components src/lib src/styles` y re-correr.

- [ ] **Step 9: Commit**

```bash
git add package.json tsconfig.json tsup.config.ts vitest.config.ts vitest.setup.ts .npmrc package-lock.json
git commit -m "chore: scaffold @myd-org/ui (tsup + vitest + tailwind tooling)"
```

---

## Task 2: Helper `cn` (merge de clases)

**Files:**
- Create: `src/lib/cn.ts`
- Test: `src/lib/cn.test.ts`

- [ ] **Step 1: Escribir el test**

```ts
import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('junta class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('resuelve conflictos de Tailwind (gana el último)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
  it('descarta valores falsy', () => {
    expect(cn('a', false, undefined, 'c')).toBe('a c');
  });
});
```

- [ ] **Step 2: Correr el test y verificar que falla**

Run: `npx vitest run src/lib/cn.test.ts`
Expected: FAIL — `Cannot find module './cn'`.

- [ ] **Step 3: Implementar `src/lib/cn.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 4: Correr el test y verificar que pasa**

Run: `npx vitest run src/lib/cn.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/cn.ts src/lib/cn.test.ts
git commit -m "feat: cn() class-merge helper (clsx + tailwind-merge)"
```

---

## Task 3: Contrato de tokens (`tokens.css` + `tailwind.css`)

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/tailwind.css`

No hay unit test (es CSS); se verifica en el playground (Task 14).

- [ ] **Step 1: Crear `src/styles/tokens.css`** (CSS plano puro — lo consume el widget)

```css
/* @myd-org/ui — contrato de roles semánticos + theme default (neutral).
   Las apps re-marcan pisando estos :root. CSS plano: consumible sin Tailwind. */
:root {
  --color-bg: #f7f7f8;
  --color-surface: #ffffff;
  --color-elevated: #f1f1f3;
  --color-border: rgba(0, 0, 0, 0.1);
  --color-ring: rgba(0, 0, 0, 0.14);
  --color-text: #18181b;
  --color-muted: #71717a;
  --color-primary: #18181b;
  --color-on-primary: #ffffff;
  --color-success: #1b7a45;
  --color-success-soft: #e8f5ec;
  --color-danger: #d2150f;
  --color-danger-soft: #fdecec;
  --color-warning: #9a6400;
  --color-warning-soft: #fbf0db;
  --radius-sm: 8px;
  --radius: 12px;
  --radius-lg: 18px;
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-2: 0 16px 40px -16px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.06);
}
```

- [ ] **Step 2: Crear `src/styles/tailwind.css`** (entry para apps Tailwind v4)

El `@theme inline` hace que cada rol genere su utilidad (`bg-primary`, `text-muted`, `rounded-lg`, `shadow-1`, `font-sans`, etc.) y que la utilidad referencie el `var(--…)` en runtime (theming dinámico). Import **relativo** a `tokens.css` para que resuelva igual en `dist/` y en el playground.

```css
@import "./tokens.css";

@theme inline {
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-elevated: var(--color-elevated);
  --color-border: var(--color-border);
  --color-ring: var(--color-ring);
  --color-text: var(--color-text);
  --color-muted: var(--color-muted);
  --color-primary: var(--color-primary);
  --color-on-primary: var(--color-on-primary);
  --color-success: var(--color-success);
  --color-success-soft: var(--color-success-soft);
  --color-danger: var(--color-danger);
  --color-danger-soft: var(--color-danger-soft);
  --color-warning: var(--color-warning);
  --color-warning-soft: var(--color-warning-soft);
  --radius-sm: var(--radius-sm);
  --radius: var(--radius);
  --radius-lg: var(--radius-lg);
  --font-sans: var(--font-sans);
  --shadow-1: var(--shadow-1);
  --shadow-2: var(--shadow-2);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css src/styles/tailwind.css
git commit -m "feat: token contract — tokens.css (roles) + tailwind.css (@theme)"
```

---

## Task 4: `Button`

**Files:**
- Create: `src/components/Button.tsx`
- Test: `src/components/Button.test.tsx`

- [ ] **Step 1: Escribir el test**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza children', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });
  it('aplica la clase de la variante danger', () => {
    render(<Button variant="danger">Borrar</Button>);
    expect(screen.getByRole('button').className).toContain('bg-danger');
  });
  it('dispara onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ir</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it('queda disabled cuando loading', () => {
    render(<Button loading>Ir</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run src/components/Button.test.tsx`
Expected: FAIL — `Cannot find module './Button'`.

- [ ] **Step 3: Implementar `src/components/Button.tsx`**

```tsx
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary hover:opacity-90',
        secondary: 'bg-elevated text-text hover:opacity-80',
        ghost: 'bg-transparent text-text hover:bg-elevated',
        danger: 'bg-danger text-on-primary hover:opacity-90',
      },
      size: { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(button({ variant, size }), className)}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run src/components/Button.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Button.tsx src/components/Button.test.tsx
git commit -m "feat: Button (variant/size via CVA)"
```

---

## Task 5: `Input`

**Files:**
- Create: `src/components/Input.tsx`
- Test: `src/components/Input.test.tsx`

- [ ] **Step 1: Escribir el test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renderiza y acepta tipeo', async () => {
    render(<Input placeholder="email" />);
    const el = screen.getByPlaceholderText('email');
    await userEvent.type(el, 'hola');
    expect(el).toHaveValue('hola');
  });
  it('forwardea el atributo type', () => {
    render(<Input type="email" placeholder="email" />);
    expect(screen.getByPlaceholderText('email')).toHaveAttribute('type', 'email');
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run src/components/Input.test.tsx`
Expected: FAIL — `Cannot find module './Input'`.

- [ ] **Step 3: Implementar `src/components/Input.tsx`**

```tsx
import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text',
        'placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        'disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run src/components/Input.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Input.tsx src/components/Input.test.tsx
git commit -m "feat: Input"
```

---

## Task 6: `Textarea`

**Files:**
- Create: `src/components/Textarea.tsx`
- Test: `src/components/Textarea.test.tsx`

- [ ] **Step 1: Escribir el test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renderiza y acepta tipeo multilínea', async () => {
    render(<Textarea placeholder="personalidad" />);
    const el = screen.getByPlaceholderText('personalidad');
    await userEvent.type(el, 'sos un asistente');
    expect(el).toHaveValue('sos un asistente');
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run src/components/Textarea.test.tsx`
Expected: FAIL — `Cannot find module './Textarea'`.

- [ ] **Step 3: Implementar `src/components/Textarea.tsx`**

```tsx
import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text',
        'placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        'disabled:opacity-50 resize-y min-h-20',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run src/components/Textarea.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Textarea.tsx src/components/Textarea.test.tsx
git commit -m "feat: Textarea"
```

---

## Task 7: `Field` (label / error / hint)

**Files:**
- Create: `src/components/Field.tsx`
- Test: `src/components/Field.test.tsx`

`Field` envuelve un control de formulario, genera un `id` con `useId`, lo asocia al `<label>` y clona el child para inyectar `id` + `aria-invalid`/`aria-describedby`. El child sigue siendo un elemento plano (no render-prop) → serializable.

- [ ] **Step 1: Escribir el test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Input } from './Input';

describe('Field', () => {
  it('asocia el label con el input', () => {
    render(
      <Field label="Email">
        <Input placeholder="email" />
      </Field>,
    );
    const input = screen.getByPlaceholderText('email');
    const label = screen.getByText('Email');
    expect(input.id).toBeTruthy();
    expect(label).toHaveAttribute('for', input.id);
  });
  it('muestra el error y marca el input inválido', () => {
    render(
      <Field label="Email" error="Requerido">
        <Input />
      </Field>,
    );
    expect(screen.getByText('Requerido')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run src/components/Field.test.tsx`
Expected: FAIL — `Cannot find module './Field'`.

- [ ] **Step 3: Implementar `src/components/Field.tsx`**

```tsx
import { type ReactElement, cloneElement, useId } from 'react';
import { cn } from '../lib/cn';

export interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactElement;
}

export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      {cloneElement(children as ReactElement<Record<string, unknown>>, {
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run src/components/Field.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Field.tsx src/components/Field.test.tsx
git commit -m "feat: Field (label/error/hint, clona child para id+aria)"
```

---

## Task 8: `Select`

**Files:**
- Create: `src/components/Select.tsx`
- Test: `src/components/Select.test.tsx`

Opciones vía prop `options: {label,value}[]` (serializable, SDUI-ready), no children.

- [ ] **Step 1: Escribir el test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select } from './Select';

const options = [
  { label: 'Sonnet', value: 'claude-sonnet-4-6' },
  { label: 'Haiku', value: 'claude-haiku-4-5' },
];

describe('Select', () => {
  it('renderiza las opciones provistas', () => {
    render(<Select options={options} defaultValue="claude-haiku-4-5" aria-label="modelo" />);
    expect(screen.getByRole('option', { name: 'Sonnet' })).toBeInTheDocument();
    expect((screen.getByLabelText('modelo') as HTMLSelectElement).value).toBe('claude-haiku-4-5');
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run src/components/Select.test.tsx`
Expected: FAIL — `Cannot find module './Select'`.

- [ ] **Step 3: Implementar `src/components/Select.tsx`**

```tsx
import { type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  ),
);
Select.displayName = 'Select';
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run src/components/Select.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Select.tsx src/components/Select.test.tsx
git commit -m "feat: Select (options data-driven)"
```

---

## Task 9: `Card`

**Files:**
- Create: `src/components/Card.tsx`
- Test: `src/components/Card.test.tsx`

- [ ] **Step 1: Escribir el test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renderiza children sobre una superficie', () => {
    render(<Card>contenido</Card>);
    const el = screen.getByText('contenido');
    expect(el.className).toContain('bg-surface');
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run src/components/Card.test.tsx`
Expected: FAIL — `Cannot find module './Card'`.

- [ ] **Step 3: Implementar `src/components/Card.tsx`**

```tsx
import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-surface shadow-1 p-4', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run src/components/Card.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Card.tsx src/components/Card.test.tsx
git commit -m "feat: Card"
```

---

## Task 10: `Table` (columns/rows declarativos)

**Files:**
- Create: `src/components/Table.tsx`
- Test: `src/components/Table.test.tsx`

`columns`/`rows` son arrays serializables. `render` por columna es un escape hatch opcional (uso app); el camino default (`row[column.key]`) es serializable → SDUI-ready.

- [ ] **Step 1: Escribir el test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table, type TableColumn } from './Table';

interface Row {
  id: string;
  name: string;
}
const columns: TableColumn<Row>[] = [{ key: 'name', header: 'Nombre' }];

describe('Table', () => {
  it('renderiza headers y celdas', () => {
    render(<Table<Row> columns={columns} rows={[{ id: '1', name: 'Soporte' }]} rowKey={(r) => r.id} />);
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Soporte')).toBeInTheDocument();
  });
  it('muestra el empty state sin filas', () => {
    render(<Table<Row> columns={columns} rows={[]} rowKey={(r) => r.id} empty="Nada acá" />);
    expect(screen.getByText('Nada acá')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run src/components/Table.test.tsx`
Expected: FAIL — `Cannot find module './Table'`.

- [ ] **Step 3: Implementar `src/components/Table.tsx`**

```tsx
import { type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  className?: string;
}

export function Table<T>({ columns, rows, rowKey, empty, className }: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border bg-surface', className)}>
      <table className="w-full text-sm text-text">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            {columns.map((c) => (
              <th key={c.key} className={cn('px-4 py-2.5 font-medium', c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-muted">
                {empty ?? 'Sin datos.'}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-border last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className={cn('px-4 py-3', c.className)}>
                    {c.render ? c.render(row) : (row as Record<string, ReactNode>)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run src/components/Table.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Table.tsx src/components/Table.test.tsx
git commit -m "feat: Table (columns/rows declarativos)"
```

---

## Task 11: `Badge` (tone enum)

**Files:**
- Create: `src/components/Badge.tsx`
- Test: `src/components/Badge.test.tsx`

- [ ] **Step 1: Escribir el test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renderiza el texto y aplica la clase del tone success', () => {
    render(<Badge tone="success">activo</Badge>);
    const el = screen.getByText('activo');
    expect(el.className).toContain('bg-success-soft');
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run src/components/Badge.test.tsx`
Expected: FAIL — `Cannot find module './Badge'`.

- [ ] **Step 3: Implementar `src/components/Badge.tsx`**

```tsx
import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badge = cva('inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium', {
  variants: {
    tone: {
      neutral: 'bg-elevated text-muted',
      success: 'bg-success-soft text-success',
      danger: 'bg-danger-soft text-danger',
      warning: 'bg-warning-soft text-warning',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run src/components/Badge.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/Badge.tsx src/components/Badge.test.tsx
git commit -m "feat: Badge (tone via CVA)"
```

---

## Task 12: `PageShell` (layout header + contenido)

**Files:**
- Create: `src/components/PageShell.tsx`
- Test: `src/components/PageShell.test.tsx`

- [ ] **Step 1: Escribir el test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageShell } from './PageShell';

describe('PageShell', () => {
  it('renderiza el título y el contenido', () => {
    render(<PageShell title="Agentes">contenido</PageShell>);
    expect(screen.getByRole('heading', { name: 'Agentes' })).toBeInTheDocument();
    expect(screen.getByText('contenido')).toBeInTheDocument();
  });
  it('renderiza las actions', () => {
    render(<PageShell title="Agentes" actions={<button>Nuevo</button>}>x</PageShell>);
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run src/components/PageShell.test.tsx`
Expected: FAIL — `Cannot find module './PageShell'`.

- [ ] **Step 3: Implementar `src/components/PageShell.tsx`**

```tsx
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
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run src/components/PageShell.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/PageShell.tsx src/components/PageShell.test.tsx
git commit -m "feat: PageShell"
```

---

## Task 13: Barrel de exports + build + suite completa

**Files:**
- Create: `src/index.ts`

- [ ] **Step 1: Crear `src/index.ts`**

```ts
export { cn } from './lib/cn';
export { Button, type ButtonProps } from './components/Button';
export { Input, type InputProps } from './components/Input';
export { Textarea, type TextareaProps } from './components/Textarea';
export { Field, type FieldProps } from './components/Field';
export { Select, type SelectProps, type SelectOption } from './components/Select';
export { Card, type CardProps } from './components/Card';
export { Table, type TableProps, type TableColumn } from './components/Table';
export { Badge, type BadgeProps } from './components/Badge';
export { PageShell, type PageShellProps } from './components/PageShell';
```

- [ ] **Step 2: Correr la suite completa de tests**

Run: `npm test`
Expected: PASS — todos los archivos `*.test.tsx`/`*.test.ts` en verde (≈16 tests).

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS, sin errores.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: genera `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, y copia `dist/tokens.css` + `dist/tailwind.css`. Verificar:

Run: `ls dist`
Expected: incluye `index.js index.cjs index.d.ts tokens.css tailwind.css`.

- [ ] **Step 5: Commit**

```bash
git add src/index.ts
git commit -m "feat: barrel exports + verify build (dist con tokens.css/tailwind.css)"
```

---

## Task 14: Playground Vite + Tailwind (verificación visual y de compilación)

Este playground es la prueba de que Tailwind compila las utilidades de la lib (`bg-primary`, `text-muted`, `rounded-lg`, etc.) — el riesgo real de la estrategia A. Importa el source directamente (HMR).

**Files:**
- Create: `example/vite.config.ts`, `example/styles.css`, `example/index.html`, `example/main.tsx`

- [ ] **Step 1: Crear `example/vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), tailwindcss()],
  server: { port: 5175 },
});
```

- [ ] **Step 2: Crear `example/styles.css`**

`@source "../src"` hace que Tailwind escanee el source de los componentes y genere sus utilidades.

```css
@import "tailwindcss";
@import "../src/styles/tailwind.css";
@source "../src";
```

- [ ] **Step 3: Crear `example/index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>@myd-org/ui — playground</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Crear `example/main.tsx`**

```tsx
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  PageShell,
  Select,
  Table,
  type TableColumn,
} from '../src/index';
import './styles.css';

interface Agent {
  id: string;
  name: string;
  model: string;
  status: string;
}
const agents: Agent[] = [
  { id: '1', name: 'Soporte', model: 'claude-haiku-4-5', status: 'active' },
  { id: '2', name: 'Ventas', model: 'claude-sonnet-4-6', status: 'inactive' },
];
const columns: TableColumn<Agent>[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'model', header: 'Modelo', render: (a) => <span className="text-muted">{a.model}</span> },
  {
    key: 'status',
    header: 'Estado',
    render: (a) => <Badge tone={a.status === 'active' ? 'success' : 'neutral'}>{a.status}</Badge>,
  },
];

function Demo() {
  const [warm, setWarm] = useState(false);
  // Toggle de theme: demuestra re-marca pisando los roles (cálido vs neutral).
  const theme = warm
    ? ({ '--color-primary': '#1c1917', '--color-bg': '#faf9f7' } as React.CSSProperties)
    : undefined;
  return (
    <div style={theme}>
      <PageShell
        title="Agentes"
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setWarm((w) => !w)}>
              {warm ? 'Theme neutral' : 'Theme cálido'}
            </Button>
            <Button>Nuevo agente</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6">
          <Table<Agent> columns={columns} rows={agents} rowKey={(a) => a.id} empty="Sin agentes." />
          <Card>
            <div className="flex flex-col gap-4">
              <Field label="Nombre" hint="Nombre visible del agente">
                <Input placeholder="Soporte" />
              </Field>
              <Field label="Modelo">
                <Select
                  options={[
                    { label: 'Sonnet', value: 'claude-sonnet-4-6' },
                    { label: 'Haiku', value: 'claude-haiku-4-5' },
                  ]}
                />
              </Field>
              <Field label="Email" error="Requerido">
                <Input type="email" placeholder="vos@empresa.com" />
              </Field>
              <div className="flex gap-2">
                <Button>Guardar</Button>
                <Button variant="secondary">Cancelar</Button>
                <Button variant="danger">Borrar</Button>
              </div>
            </div>
          </Card>
        </div>
      </PageShell>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
```

- [ ] **Step 5: Levantar el playground y verificar visualmente**

Run: `npm run example`
Expected: Vite sirve en `http://localhost:5175`. Abrir en el browser y verificar: los componentes se ven estilados (colores/bordes/sombras de los tokens aplicados — confirma que Tailwind compiló `bg-primary`, `text-muted`, etc.), y el botón "Theme cálido" cambia primary/bg en vivo (confirma re-marca por override de roles). **Verificación visual la hace Emanuel.**

- [ ] **Step 6: Commit**

```bash
git add example/
git commit -m "feat: playground Vite+Tailwind (verifica compilación de utilidades y re-marca)"
```

---

## Task 15: Publicar `@myd-org/ui@0.1.0` a GitHub Packages

Requiere `GITHUB_TOKEN` con scope `write:packages` (el mismo que ya usás para el widget) exportado en el entorno, y el `gh` CLI autenticado.

- [ ] **Step 1: Crear el repo remoto y pushear**

```bash
cd ~/Documents/projects/owns/ui
gh repo create MyD-Org/ui --private --source=. --remote=origin --push
```
Expected: crea `github.com/MyD-Org/ui` (privado), setea `origin` y pushea `main`. Si el repo ya existe: `git remote add origin https://github.com/MyD-Org/ui.git && git push -u origin main`.

- [ ] **Step 2: Verificar el contenido del paquete antes de publicar**

Run: `npm run build && npm pack --dry-run`
Expected: el tarball lista solo `dist/` (incluye `index.js`, `index.cjs`, `index.d.ts`, `tokens.css`, `tailwind.css`) + `package.json`. NO debe incluir `src/` ni `example/`.

- [ ] **Step 3: Publicar**

Run: `GITHUB_TOKEN=<token> npm publish`
Expected: `+ @myd-org/ui@0.1.0` publicado a `https://npm.pkg.github.com`. (El `.npmrc` del repo resuelve registry + auth vía `${GITHUB_TOKEN}`.)

- [ ] **Step 4: Verificar que se puede instalar desde afuera**

```bash
cd /tmp && mkdir ui-smoke && cd ui-smoke && npm init -y >/dev/null
printf '@myd-org:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}\n' > .npmrc
GITHUB_TOKEN=<token> npm install @myd-org/ui
ls node_modules/@myd-org/ui/dist
```
Expected: instala e incluye `tokens.css tailwind.css index.js index.d.ts`. Confirma el loop publicar→instalar limpio (sin tarball en `/tmp`). Limpiar: `cd /tmp && rm -rf ui-smoke`.

---

## Task 16: Adoptar en ai-dashboard (camino Tailwind)

**Files:**
- Create: `~/Documents/projects/owns/ai-dashboard/.npmrc`
- Modify: `~/Documents/projects/owns/ai-dashboard/src/app/globals.css`
- Modify: `~/Documents/projects/owns/ai-dashboard/src/app/login/LoginForm.tsx`
- Modify: `~/Documents/projects/owns/ai-dashboard/src/app/agents/page.tsx`

- [ ] **Step 1: Crear `.npmrc` en ai-dashboard e instalar la lib**

```bash
cd ~/Documents/projects/owns/ai-dashboard
printf '@myd-org:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}\n' > .npmrc
GITHUB_TOKEN=<token> npm install @myd-org/ui
```
Expected: agrega `@myd-org/ui` a `dependencies`.

- [ ] **Step 2: Reescribir `src/app/globals.css`**

```css
@import "tailwindcss";
@import "@myd-org/ui/tailwind.css";
@source "../../node_modules/@myd-org/ui/dist";

/* Theme del dashboard: override de roles (dejamos el neutral default; ejemplo de re-marca abajo) */
/* :root { --color-primary: #0c3ed6; } */
```
Nota: `@source` es relativo a este archivo (`src/app/globals.css`) → `../../node_modules`. Necesario porque Tailwind v4 excluye `node_modules` por default; así escanea las clases de la lib.

- [ ] **Step 3: Reescribir `src/app/login/LoginForm.tsx`**

```tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Field, Input } from "@myd-org/ui"

export function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function requestCode(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const r = await fetch("/api/auth/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    if (r.ok) setStep("code")
    else setError("No se pudo enviar el código.")
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const r = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    })
    setLoading(false)
    if (r.ok) router.push("/agents")
    else setError("Código inválido o expirado.")
  }

  return step === "email" ? (
    <form onSubmit={requestCode} className="flex flex-col gap-4">
      <Field label="Email" error={error ?? undefined}>
        <Input type="email" placeholder="vos@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Button type="submit" loading={loading}>Enviar código</Button>
    </form>
  ) : (
    <form onSubmit={verify} className="flex flex-col gap-4">
      <Field label="Código" error={error ?? undefined}>
        <Input inputMode="numeric" placeholder="código de 6 dígitos" value={code} onChange={(e) => setCode(e.target.value)} required />
      </Field>
      <Button type="submit" loading={loading}>Entrar</Button>
    </form>
  )
}
```

- [ ] **Step 4: Reescribir `src/app/agents/page.tsx`**

```tsx
import Link from "next/link"
import { listAgents } from "@/lib/admin-api"
import { Badge, Button, PageShell, Table, type TableColumn } from "@myd-org/ui"

type Agent = Awaited<ReturnType<typeof listAgents>>[number]

const columns: TableColumn<Agent>[] = [
  {
    key: "name",
    header: "Nombre",
    render: (a) => (
      <Link href={`/agents/${a.id}`} className="font-medium hover:underline">
        {a.name}
      </Link>
    ),
  },
  { key: "model", header: "Modelo", render: (a) => <span className="text-muted">{a.model}</span> },
  {
    key: "status",
    header: "Estado",
    // NOTA: ajustar el literal al enum real de status si difiere de "active".
    render: (a) => <Badge tone={a.status === "active" ? "success" : "neutral"}>{a.status}</Badge>,
  },
]

export default async function AgentsPage() {
  const agents = await listAgents()
  return (
    <PageShell
      title="Agentes"
      actions={
        <Link href="/agents/new">
          <Button>Nuevo agente</Button>
        </Link>
      }
    >
      <Table<Agent> columns={columns} rows={agents} rowKey={(a) => a.id} empty="Todavía no hay agentes." />
    </PageShell>
  )
}
```

- [ ] **Step 5: Verificar typecheck + dev server**

```bash
cd ~/Documents/projects/owns/ai-dashboard
npx tsc --noEmit
npm run dev   # :3002
```
Expected: typecheck limpio; el dashboard levanta. Abrir `http://localhost:3002/login` y `/agents` → la UI usa los componentes del DS (ya no se ve "mínima"). **Verificación visual la hace Emanuel.** Si el literal `status === "active"` no matchea el enum real, ajustarlo (el fallback `neutral` no rompe).

- [ ] **Step 6: Commit (en el repo ai-dashboard)**

```bash
cd ~/Documents/projects/owns/ai-dashboard
git add .npmrc package.json package-lock.json src/app/globals.css src/app/login/LoginForm.tsx src/app/agents/page.tsx
git commit -m "feat: adoptar @myd-org/ui (tokens + Button/Input/Field/Table/Badge/PageShell)"
```

---

## Task 17: Adoptar en ai-widget (camino CSS plano)

Prueba que el contrato cruza el sustrato sin Tailwind. El widget importa `tokens.css` (no `tailwind.css`) y re-mapea sus `--aichat-*` sobre los roles, manteniendo su paleta cálida como override de roles → sin cambio visual.

**Decisión de empaquetado:** el `@import` resuelve `@myd-org/ui` en el consumidor, así que `@myd-org/ui` pasa a ser **dependency** del widget. Es aceptable: los consumidores del widget (ej. el CRM) ya autentican al scope `@myd-org` en GitHub Packages (instalan `@myd-org/ai-widget`). (Optimización futura, fuera de alcance: inlinear `tokens.css` en build para que el widget quede zero-runtime-dep.)

**Files:**
- Create: `~/Documents/projects/owns/ai-widget/.npmrc` (si no existe)
- Modify: `~/Documents/projects/owns/ai-widget/package.json` (agregar dependency)
- Modify: `~/Documents/projects/owns/ai-widget/src/styles/aichat.css`

- [ ] **Step 1: Asegurar `.npmrc` e instalar la lib en el widget**

```bash
cd ~/Documents/projects/owns/ai-widget
[ -f .npmrc ] || printf '@myd-org:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}\n' > .npmrc
GITHUB_TOKEN=<token> npm install @myd-org/ui
```
Expected: agrega `@myd-org/ui` a `dependencies` del widget.

- [ ] **Step 2: Editar `src/styles/aichat.css`** — agregar el import al tope y re-mapear los `--aichat-*` sobre los roles

Reemplazar el bloque inicial de `.aichat-root` (las definiciones de paleta) por esto. El `@import` debe ir **antes de cualquier regla** (la primera línea no-comentario del archivo):

```css
@import "@myd-org/ui/tokens.css";

/* aichat.css — "Cálido premium": ahora deriva del contrato de roles de @myd-org/ui.
   Todo es reskinneable vía las custom properties de .aichat-root. */
.aichat-root {
  /* theme cálido del widget = override de los roles del DS */
  --color-primary: #1c1917;
  --color-on-primary: #ffffff;
  --color-surface: #ffffff;
  --color-bg: #faf9f7;
  --color-elevated: #f4f2ee;
  --color-text: #1c1917;
  --color-muted: #78716c;
  --color-border: rgba(28, 25, 23, 0.08);
  --color-ring: rgba(28, 25, 23, 0.13);

  /* los tokens del widget ahora derivan de los roles */
  --aichat-primary: var(--color-primary);
  --aichat-on-primary: var(--color-on-primary);
  --aichat-surface: var(--color-surface);
  --aichat-bg: var(--color-bg);
  --aichat-elevated: var(--color-elevated);
  --aichat-text: var(--color-text);
  --aichat-muted: var(--color-muted);
  --aichat-border: var(--color-border);
  --aichat-ring: var(--color-ring);

  /* tokens propios del widget (no son roles del DS) — se mantienen */
  --aichat-whatsapp: #25d366;
  --aichat-radius: 18px;
  --aichat-radius-bubble: 16px;
  --aichat-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --aichat-shadow-1: 0 1px 2px rgba(28, 25, 23, 0.05);
  --aichat-shadow-2: 0 16px 40px -16px rgba(28, 25, 23, 0.28), 0 2px 8px rgba(28, 25, 23, 0.06);
  --aichat-shadow-launcher: 0 10px 26px -6px rgba(28, 25, 23, 0.4);

  font-family: var(--aichat-font);
  color: var(--aichat-text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```
(El resto de `aichat.css` no cambia: ya consume `var(--aichat-*)`.)

- [ ] **Step 3: Correr los tests del widget (deben seguir verdes)**

```bash
cd ~/Documents/projects/owns/ai-widget
npm test
```
Expected: PASS — los 30+ tests siguen verdes (los tests son de comportamiento en jsdom, no cargan CSS; el cambio es CSS-only).

- [ ] **Step 4: Build del widget**

Run: `npm run build`
Expected: build OK; `dist/aichat.css` se regenera con el `@import` al tope.

- [ ] **Step 5: Verificación visual en el playground del widget**

Run: `npm run example`  (Vite en `:5174`; requiere ai-api en `:3000` o modo mock)
Expected: el widget se ve **igual que antes** (misma paleta cálida) — confirma que re-mapear sobre los roles no cambió nada visual y que el contrato cruza el sustrato CSS-plano. **Verificación visual la hace Emanuel.**

- [ ] **Step 6: Commit (en el repo ai-widget)**

```bash
cd ~/Documents/projects/owns/ai-widget
git add .npmrc package.json package-lock.json src/styles/aichat.css
git commit -m "feat: consumir tokens de @myd-org/ui (--aichat-* derivan de los roles)"
```

---

## Done — criterios de éxito del slice 1

- [ ] `@myd-org/ui@0.1.0` publicado a GitHub Packages e instalable desde otra carpeta vía `.npmrc` (Task 15, sin tarball en `/tmp`).
- [ ] 9 componentes + `cn` con tests en verde (≈16 tests) y typecheck limpio (Task 13).
- [ ] Tokens consumidos por **ambos sustratos**: dashboard Tailwind (`tailwind.css` + `@source`, componentes funcionando, Task 16) y widget CSS plano (`tokens.css`, `--aichat-*` re-mapeados sin cambio visual, Task 17).
- [ ] Re-marca verificada en el playground (toggle de theme) y en el widget (paleta cálida intacta).
- [ ] ai-widget sigue con sus 30+ tests en verde tras el re-mapeo.
