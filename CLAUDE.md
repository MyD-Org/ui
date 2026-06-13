# @myd-org/ui — Design System

Librería de componentes React + design tokens compartida por los frontends del venture.
Se publica **versionada** a GitHub Packages y la consumen las apps como dependencia.

> Consumidores: **CRM** (MyD-Org/CRM), **ai-dashboard**, **ai-widget** (`@myd-org/ai-widget`) y futuros frontends.
> Docs de diseño: `docs/superpowers/specs/` y `docs/superpowers/plans/`.

---

## Principio rector: infra compartida, **marca por-app**

El DS da consistencia **estructural** (componentes, spacing, radios, tipografía, comportamiento), **no** cromática forzada. Cada app —y a futuro cada tenant— inyecta su paleta pisando los **roles** de token. Por eso nunca hardcodeamos colores: usamos roles semánticos.

### Tokens (el contrato)
Dos archivos, a propósito:
- **`src/styles/tokens.css`** — CSS plano puro: `:root` con los **roles semánticos** (`--color-primary`, `--color-surface`, `--color-muted`, `--radius`, `--shadow-1`, …) + un theme default neutral. Lo consume cualquiera, incluido el widget (que NO usa Tailwind).
- **`src/styles/tailwind.css`** — `@import "./tokens.css"` + `@theme inline` que mapea cada rol a una utilidad Tailwind v4 (`bg-primary`, `text-muted`, `rounded-lg`, …). Entry para apps Tailwind.

Una app re-marca pisando los roles en su propio `:root` (ej. `--color-primary: #0c3ed6`). Los componentes consumen el rol, nunca el color crudo → un solo set de componentes sirve a N marcas.

### Estrategia de empaquetado: **ship-source**
Publicamos los componentes como `.tsx` con clases Tailwind. **El consumidor compila** esas utilidades con SU Tailwind (vía `@source`). Por eso:
- Las clases de los componentes deben estar respaldadas por un token mapeado en `tailwind.css` (ej. `bg-primary`, `bg-success-soft`) o ser utilidades built-in de Tailwind (`flex`, `animate-spin`, `rounded-full`). **Una clase sin token de respaldo renderiza sin estilo.**
- Las deps runtime de UI (ej. `@radix-ui/*`) van **externalizadas** en `tsup.config.ts` (`external`), nunca bundleadas (evita duplicar React/contextos).

---

## Lineamientos de API de componentes (SDUI-ready)

El DS es el vocabulario que a futuro consumirá un **renderer schema-driven** (UI generada desde JSON, estilo nullplatform). Por eso, desde el día 1:

1. **Variantes por string enum** (vía `cva`), nunca pasando subcomponentes estilados. Ej. `variant="primary"`, `tone="success"`, `size="sm"`.
2. **Componentes controlados / sin estado oculto** — apariencia y comportamiento descritos por props; el estado vive afuera (o uncontrolled con `defaultX` + controlled con `X`/`onXChange`, como `Table`/`Select`/`SelectionBar`).
3. **Props planas y tipadas** (primitivos, enums, discriminated unions). Datos como **arrays serializables**, no children JSX: `Select` toma `options`, `Table` toma `columns`/`rows`. (El `render` por columna es un escape hatch opcional; el camino default es serializable.)

No se construye el renderer acá — es iniciativa aparte. Pero la API se diseña para habilitarlo.

### Convenciones de implementación (mirá los componentes existentes)
- Merge de clases: **`cn(...)`** (`src/lib/cn.ts` = clsx + tailwind-merge). `className` del consumidor siempre va **último** para poder overridear.
- Variantes: **`cva`** (class-variance-authority). Exportá los union types de variantes que el consumidor pueda querer (`ButtonVariant`, `BadgeTone`, …).
- Wrappers de un elemento host (Button, Input, Card, Badge, …): **`forwardRef` + `displayName`**. Componentes composite/layout (Field, Table, PageShell) son funciones normales.
- A11y: roles/aria correctos (ej. `Alert` deriva `role` del tone, `Checkbox` usa `role=checkbox`/`aria-checked` con `mixed`, `Table` headers ordenables son `<button>` con `aria-sort`).

---

## Componentes (18 + `cn`)

`Button` `Input` `Textarea` `Field` `Select` `Card` `Table` `Badge` `PageShell` · `Spinner` `Alert` `Skeleton` `Divider` `Stack` `Avatar` `Checkbox` `Progress` `SelectionBar`.

- **`Select`** usa `@radix-ui/react-select` (dropdown custom accesible, no nativo). API: `options` + `value`/`defaultValue`/`onValueChange`.
- **`Table`** tiene paridad con la tabla del CRM: sort (built-in client-side o controlado), selección con `Checkbox` (select-all + indeterminate), columnas responsive (`hideBelow`), hover, `onRowClick`. API retro-compatible (las props nuevas son opcionales).
- **`SelectionBar`** es la barra de accionables sobre la tabla (aparece con la selección). **`Progress`** es la barra de progreso (ej. pago parcial). Ver el story `Components/Table → Tabla rica (CRM-style)`.

---

## Estructura

```
src/
  index.ts            # barrel: único punto de export público
  lib/cn.ts           # merge de clases
  styles/
    tokens.css        # roles (CSS plano)
    tailwind.css      # @import tokens + @theme inline
  components/
    <Name>.tsx        # componente
    <Name>.test.tsx   # tests (vitest + Testing Library + jsdom)
    <Name>.stories.tsx# Storybook (CSF3)
.storybook/           # config de Storybook (Tailwind cableado en el preview)
example/              # playground Vite liviano (alternativa a Storybook)
docs/superpowers/     # specs + plans
```

Todo componente nuevo se **exporta desde `src/index.ts`** (value + types). Nada fuera de `dist/` se publica (`files: ["dist"]`).

---

## Workflow de desarrollo

```bash
npm test            # vitest run (correr SIEMPRE; los tests deben quedar verdes)
npm run test:watch
npm run typecheck   # tsc --noEmit (estricto, verbatimModuleSyntax)
npm run build       # tsup → dist (ESM + CJS + .d.ts + tokens.css + tailwind.css)
npm run storybook   # explorador visual de componentes (:6006)
npm run example     # playground Vite (:5175)
```

- **TDD**: test primero (rojo) → implementación mínima (verde) → commit. Un commit por unidad.
- Los tests corren en **jsdom y NO compilan Tailwind**: verifican **comportamiento** y **presencia de clases** (string), no estilos resueltos. La verificación visual es Storybook + ojo humano.
- TS estricto + `verbatimModuleSyntax`: imports de tipos con `type` inline (`import { type ButtonHTMLAttributes, forwardRef }`).
- Commits convencionales (`feat:`, `fix:`, `chore:`). Trabajar en rama; mergear a `main`.

### Agregar un componente — checklist
1. `src/components/X.tsx` (+ `forwardRef`/`cva`/`cn` según corresponda) + `X.test.tsx` (TDD) + `X.stories.tsx`.
2. Solo clases respaldadas por tokens o built-in de Tailwind.
3. Export en `src/index.ts` (component + Props + union types).
4. Si suma una dep runtime (ej. otro Radix): agregarla a `dependencies` **y** externalizarla en `tsup.config.ts`.
5. `npm test`, `npm run typecheck`, `npm run build`, `npm run build-storybook` → todo verde.

### Gotchas
- Radix necesita polyfills de jsdom para los tests (`hasPointerCapture`, `scrollIntoView`, `ResizeObserver`) — ya están en `vitest.setup.ts`.
- Modificador de opacidad sobre roles (ej. `bg-primary/10` para fila seleccionada) funciona en Tailwind v4 vía `color-mix`.

---

## Cómo se integra en los fronts

El DS expone 3 entrypoints: `@myd-org/ui` (componentes), `@myd-org/ui/tailwind.css` y `@myd-org/ui/tokens.css`.

### Instalación (cualquier app)
`.npmrc` en el repo consumidor (GitHub Packages es privado):
```
@myd-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```
Luego `npm install @myd-org/ui`. (El consumidor necesita un token con scope `read:packages`.)

### Apps Tailwind v4 (CRM, ai-dashboard) — tokens + componentes
En el CSS global:
```css
@import "tailwindcss";
@import "@myd-org/ui/tailwind.css";
/* permite que TU Tailwind compile las utilidades usadas por la lib (ship-source): */
@source "../../node_modules/@myd-org/ui/dist";   /* path relativo a este archivo CSS */

/* re-marca: pisá los roles con la paleta de tu app */
:root { --color-primary: #0c3ed6; /* … */ }
```
Y usás los componentes: `import { Button, Table, Field } from "@myd-org/ui"`.

### Consumidores de CSS plano (ai-widget) — solo tokens
El widget no usa Tailwind; consume el contrato de roles y mapea sus variables sobre él:
```css
@import "@myd-org/ui/tokens.css";
.aichat-root {
  --color-primary: #1c1917;        /* theme propio = override de roles */
  --aichat-primary: var(--color-primary);  /* sus tokens derivan de los roles */
}
```

### Versionado y release
Semver. **Estamos en 0.x**: un bump de **minor puede incluir cambios breaking** (ej. la API de `Select` cambió `onChange`→`onValueChange`). Los consumidores pinnean su versión (`^0.x`) y suben cuando deciden — un cambio del DS no toca las apps hasta que cada una actualiza.

Publicar (requiere `GITHUB_TOKEN` con scope `write:packages`):
```bash
# bump version en package.json, commitear
npm publish            # corre prepublishOnly (build) y publica a GitHub Packages
git push origin main && git tag vX.Y.Z && git push origin vX.Y.Z
```
