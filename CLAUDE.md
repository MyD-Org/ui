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

## Componentes (lista no exhaustiva + `cn`; el barrel `src/index.ts` es la fuente de verdad)

`Button` `Input` `Textarea` `Field` `Select` `Card` `Table` `Badge` `PageShell` · `Spinner` `Alert` `Skeleton` `Divider` `Stack` `Avatar` `Checkbox` `Progress` `SelectionBar` · `Switch` `RangeSlider` `Breadcrumb` `Pagination` (+ `paginationWindow`) `SegmentedControl` `FacetGroup` `ProductCardSkeleton` · `SectionNav` `StatCard` `Stepper` `ToggleIconButton` · `DocumentViewer`.

- **`Select`** usa `@radix-ui/react-select` (dropdown custom accesible, no nativo). API: `options` + `value`/`defaultValue`/`onValueChange`.
- **`Table`** tiene paridad con la tabla del CRM: sort (built-in client-side o controlado), selección con `Checkbox` (select-all + indeterminate), columnas responsive (`hideBelow`), hover, `onRowClick`. API retro-compatible (las props nuevas son opcionales).
- **`SelectionBar`** es la barra de accionables sobre la tabla (aparece con la selección). **`Progress`** es la barra de progreso (ej. pago parcial). Ver el story `Components/Table → Tabla rica (CRM-style)`.
- **Primitivas del catálogo (0.12.0)**: `Switch` (a mano, `role=switch`), `RangeSlider` (`@radix-ui/react-slider`, dos pulgares, `onValueCommit` al soltar), `Breadcrumb` y `Pagination` (enlaces reales; `renderLink` para `next/link`), `SegmentedControl` (`radiogroup` + roving tabindex), `FacetGroup` (compone `Checkbox` + `SearchInput`, búsqueda sin tildes, colapso "Ver todas (n)").
- **Primitivas de Mi cuenta (0.13.0)**: `SectionNav` (navegación de secciones dentro de una página: `<nav><ul>`, activo con `aria-current="page"`, separador antes del ítem `danger`, horizontal desplazable en `< md`; no es un shell como `SideNav`), `StatCard` (ícono en tile + valor + etiqueta, enlazable, `loading`; `KpiCard` sigue siendo la de dashboards), `Stepper` (estados por paso `done|current|pending`, `<ol>` con `aria-current="step"` y estado sr-only; no calcula progreso), `ToggleIconButton` (`aria-pressed`, `onClick` antes de `onPressedChange`, `tone primary|danger`).
- **`renderLink`** (`src/lib/renderLink.tsx`): escape hatch con objeto de props `{ href, className, children, aria-label?, aria-current? }` para que el consumidor enchufe su `<Link>` sin reconstruir clases. Lo usan `Breadcrumb`, `Pagination`, `ProductCard.href`, `Button.href`, `StatCard` y `SectionNav`. (`SideNav` conserva su firma posicional vieja.)

### Changelog 0.27.0 (uso táctil; en desktop nada cambia)
- **`Dialog placement="sheet"`** se cierra **arrastrándola hacia abajo** con el dedo, como las hojas nativas, y lleva una manija arriba que lo anuncia (`data-sheet-handle`). La hoja sigue al dedo si el gesto arranca en el encabezado (manija incluida), o en el cuerpo cuando ya está arriba de todo; si no, el cuerpo scrollea como siempre. Al soltar se cierra si se la bajó ¼ de su alto (mín. 80 px) o con un tirón rápido; si no, vuelve a su lugar. Lo marcado `touch-none` (p. ej. `RangeSlider`) queda afuera. Respeta reduced motion. `dragToClose={false}` lo apaga (sin manija). Reglas del gesto en `src/lib/sheetDrag.ts`. El encabezado pasa a envolver manija + fila de título (el borde inferior no cambia).
- **`FacetGroup`**: con puntero táctil (`pointer-coarse:`), el chevron de las ramas pasa de 20 a 40 px, el hueco de las filas sin hijas también (conteos en columna) y las filas a 40 px de alto.
- **`Input`, `Textarea`, `SearchInput`, `QuantityStepper`**: `pointer-coarse:text-base` — 16 px con puntero táctil, para que Safari de iOS no haga zoom al enfocarlos. En desktop siguen en `text-sm`.

### Changelog 0.26.0 (aditivo: los defaults no cambian)
- **`Marquee`**: `items` acepta textos y logos mezclados (`MarqueeItem = string | { src, alt }`). El logo va a 28 px de alto con tope de 150 px de ancho (los apaisados quedan más bajos) y en gris uniforme (`brightness-0` + `opacity-50`), así que conviene PNG o SVG con fondo transparente: un fondo blanco se vería como un rectángulo gris. Sin hover a color: la cinta es `pointer-events-none`.

### Changelog 0.23.0 (un cambio visible: textos por defecto)
- **`FileDropZone`**: textos configurables — `title` (default "Arrastre su archivo aquí"), `orLabel` (default "o"; `''` lo omite) y `browseLabel` (default "selecciónelo desde su equipo"). **Los defaults pasan de voseo a español formal de usted** (antes "Arrastrá tu archivo acá / seleccioná desde tu computadora", sin forma de cambiarlos).
- **`FileDropZone` accesible por teclado**: `role="button"` + `tabIndex=0`, Enter y Espacio abren el selector, anillo de foco con el token `ring`. El nombre accesible es el texto (o el nombre del archivo elegido); `hint` y el nuevo `error` se leen con `aria-describedby`. `error` además marca `aria-invalid` y pinta el borde `danger`. Nuevas `disabled` (sin click, teclado ni arrastre) e `id`. El `<input type=file>` queda fuera del orden de tabulación.

### Changelog 0.22.0 (aditivo: los defaults no cambian)
- **`SectionNav`**: `groups` (`SectionNavGroup[]`: `{ id, label, items }`) para una navegación agrupada. Desde `md` cada grupo lleva su título (no interactivo) y es una sublista nombrada por él (`aria-labelledby`); en móvil (fila horizontal) el título no se ve y los grupos se separan con una línea vertical. Con `groups`, `items` pasa a ser opcional y son los ítems sueltos que van al final, sin título (p. ej. "Cerrar sesión", que conserva su separador `danger`). Un grupo vacío no se renderiza. Sin `groups`, el DOM es el mismo de antes.
- **`SectionNavItem.badge`** (número, p. ej. avisos sin leer): se oculta en 0/ausente, más de 99 se ve "99+" y el nombre accesible suma `badgeLabel` (prop del nav, default `'{n} sin leer'`) con el número real.
- Nuevo **`DocumentViewer`**: visor de PDF en un `Dialog` dentro de la página (facturas, recibos, presupuestos). Pide `src` con `fetch` (mismo origen, cookies de sesión) antes de mostrarlo, porque un `<iframe>` no expone el status: carga → "Cargando documento…"; error → `Alert` con el `{ error }` del servidor o `errorMessage`; listo → `<iframe>` con el blob + "Abrir en pestaña nueva" y "Descargar PDF" (`downloadHref`, `<a download>`), y la ayuda `hint` para iOS. Libera el blob al cerrar. `placement` pasa al `Dialog`. La descarga es un `<a>` plano a propósito: no debe pasar por el router del framework.
- **`KpiCard`**: slot `children` debajo del valor y del hint (p. ej. las facturas que suman un saldo, una `Progress`).

### Changelog 0.19.0
- **`RoomTiles variant="stack"`** pasa a pila tipo billetera (como Mercado Pago): todas las tarjetas se pegan a la misma altura y la de atrás se achica (8% por nivel) y sube a medida que la siguiente la tapa, así se asoma una franja cada vez más chica. Como mucho se ven `stackProfundidad` (nueva, default 2) detrás; la siguiente se desvanece. La profundidad se calcula por scroll (rAF) y se escribe como `transform`/`opacity` en cada tarjeta; con reduced motion quedan una debajo de otra.
- **Cambio de semántica**: `stackTop` ahora es el borde de la franja más al fondo; la de adelante se pega en `stackTop + stackProfundidad * stackSolape` (antes cada tarjeta se pegaba `stackSolape` px más abajo que la anterior).

### Changelog 0.18.1
- **`FacetGroup`** en árbol: el chevron pasa a la derecha de la fila, después del conteo (abajo = cerrada, arriba = abierta). A la izquierda corría todas las raíces por su ancho y la lista quedaba desalineada del título y de los otros grupos. La sangría de las hijas no cambia.

### Changelog 0.18.0 (aditivo: los defaults no cambian)
- **`ProductCard`**: nueva prop `actionPlacement` (`'inline' | 'below'`, default `'inline'`). Con `'below'` la acción va siempre en su propia línea, debajo del precio y a la derecha. Es para acciones anchas como un `QuantityStepper`: con `'inline'`, en una misma grilla unas cards lo ponían al lado y otras abajo según el largo del precio.
- **`FacetGroup`** en árbol: `FacetItem.depth` (0 = raíz; ítems en orden de lectura) corre la fila entera, casilla incluida, por nivel (hasta 3). Si algún ítem tiene hijas, las ramas se pliegan con un chevron (`aria-expanded`; nombres `expandLabel`/`collapseLabel` con `{label}`): arrancan cerradas salvo las que tienen algo tildado adentro. Con una madre tildada, sus hijas se ven tildadas y deshabilitadas; con sólo algunas hijas tildadas, la madre queda en estado intermedio. Qué valores quedan en el filtro sigue siendo del consumidor (`onToggle`). Sin madres, el grupo se ve igual que antes. `{n}` de `moreLabel` pasa a contar las filas a la vista.

### Changelog 0.15.0 (primitivas de la home del Shop; un cambio visible)
- Nuevo **`Carousel`**: carrusel horizontal de tarjetas. Scroll nativo con `scroll-snap` (en touch se arrastra con el dedo, el gesto no pasa por JS) + flechas desde `lg`, que se ocultan solas cuando no hay a dónde ir. `label` es obligatorio (la pista es un `region` con nombre y `tabIndex`), `perView` 3 o 4. Único slot por `children` del DS: lo que va adentro de la card (precio en vivo, agregar al carrito) es de la app, y duplicarla acá la desincronizaría de `ProductCard`.
- **`RoomTiles`**: nueva `variant="stack"` — tarjetas apiladas que se despegan al scrollear (`position: sticky` puro, sin JS; `stackTop`/`stackSolape` configurables; con reduced motion quedan una debajo de otra). En esta variante el texto va **arriba**: tapada por la siguiente, la franja visible es la de arriba.
- **`RoomTiles` (visible)**: `grid` y `stack` usan el mismo call to action que `mosaic` (link subrayado "Explorar →", texto configurable con `ctaLabel`). Antes `grid` tenía un círculo con la flecha rotando en hover: no se parecía al resto de las cards y pesaba más que el título.
- **`SiteHeader`**: `brandPlacement="start"` (marca a la izquierda y búsqueda al centro desde `lg`; default `center`, sin cambios) y `compactOnScroll` — el header se va con el scroll y lo reemplaza una barra compacta fija (marca + nav + búsqueda + acciones), con `compactSearch`/`compactActions` para los slots que no convenga montar dos veces y `onCompactChange` para saber cuál de las dos instancias está a la vista. La barra plegada es `inert` + `aria-hidden`.
- **`Marquee` (fix)**: recortaba con `overflow-hidden` y, como la pista mide miles de px, era un **contenedor scrolleable**: al hacer clic adentro el navegador la tomaba como scroll activo y la página dejaba de responder al teclado. Ahora usa `overflow-clip` y, por decorativa, `select-none` + `pointer-events-none`.
- Sin dependencias nuevas. `SiteHeader` y `Carousel` usan hooks: montalos desde un componente cliente (el repo no marca `'use client'`, lo hace el consumidor).

### Changelog 0.13.0 (aditivo: los defaults no cambian)
- Nuevos: `SectionNav`, `StatCard`, `Stepper`, `ToggleIconButton` (+ tipos `SectionNavItem`, `StepItem`, `StepState`, `ToggleIconButtonTone`).
- `Button`: `variant="outline"`; `href` + `renderLink` (enlace con aspecto de botón; `disabled`/`loading`/`ref` sólo aplican al `<button>`).
- `ProductCard`: slot `cornerAction` (esquina superior derecha de la imagen, `z-10`, fuera del enlace estirado).
- Sin dependencias nuevas. `OrderLineItem` **no** se agregó: la línea de pedido se compone en la app con clases de la escala (un solo consumidor).

### Changelog 0.12.0 (semver 0.x: cambios visibles)
- `ProductCard`: el indicador de stock **ahora se muestra también en `variant="editorial"`** (`showStock={false}` para ocultarlo); precio editorial pasa de `text-[22px]` a `text-xl md:text-2xl`; nuevas props `code`/`codeLabel`, `layout="grid"|"list"` (`data-layout`), `href` + `renderLink` (stretched link: un solo `<a>` por card, el slot `action` queda fuera); el `<h3>` en grid reserva dos líneas (`min-h-10`). Nuevo `ProductCardSkeleton`.
- `Button`: `variant="link"`, `size="inline"`, `size="icon-lg"`, `shape="round"`.
- `Card`: slot `action` a la derecha del título.
- `Dialog`: `placement="center"|"sheet"` (`data-placement`; `size` sólo aplica en `center`); el pie de la hoja lleva `pb-[env(safe-area-inset-bottom)]` (única clase arbitraria admitida). Al cerrar, el foco vuelve al elemento que lo abrió (antes se perdía: Radix sólo devolvía el foco a su propio `Dialog.Trigger`).
- Dep nueva: `@radix-ui/react-slider` (externalizada por el patrón `/^@radix-ui\//` de tsup).

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
