# Design System `@myd-org/ui` — Diseño (Slice 1)

**Fecha:** 2026-06-13
**Estado:** aprobado (brainstorm), pendiente plan de implementación
**Repo:** `~/Documents/projects/owns/ui` → publica `@myd-org/ui` a GitHub Packages

## Contexto y problema

El venture tiene varios frontends que hoy no comparten nada de UI:

- **CRM** (MyD-Org/CRM, lo mantiene Dalila): Tailwind v4 + Next 16 / React 19. Paleta **azul frío / corporativo** (`--blue #0c3ed6`, `--ink #16191d`, `--bg #f1f2f4`), tipografía Helvetica Neue. Componentes **bespoke** en `src/components/portal/` — no hay librería (`ui/`), ni shadcn, ni CVA; solo `lucide-react`.
- **ai-dashboard**: Tailwind v4 + Next 16. UI **mínima** (fue decisión explícita de v1: "la UI no es el foco"). Es el dolor que dispara este proyecto.
- **ai-widget** (`@myd-org/ai-widget@0.1.0`, publicado e integrado): paquete React standalone con **CSS plano + CSS vars `--aichat-*`** (SIN Tailwind, a propósito: liviano/embebible). Paleta **stone cálido / premium** (`--aichat-primary #1c1917`, `--aichat-bg #faf9f7`).

Dos hallazgos del relevamiento: (1) las apps no comparten ni estética ni vocabulario de tokens — no es solo un split técnico Tailwind-vs-CSS-plano, son dos identidades visuales; (2) el CRM no tiene librería de componentes, así que "extraer la cantera" es trabajo real de generización, no copy-paste.

**Objetivo:** infraestructura de UI compartida, **marca por-app** — consistencia *estructural* (componentes, comportamiento, vocabulario de tokens), no cromática forzada. Cada app (y a futuro cada tenant) inyecta su paleta.

## Decisiones tomadas

1. **Objetivo = infraestructura compartida, marca por-app** (no identidad visual única). Encaja con el modelo multi-tenant vendible.
2. **Arquitectura por capas (opción 2):** (a) **tokens universales** = contrato de roles semánticos (CSS custom properties) consumibles en todos lados, incluido el widget; (b) **librería de componentes Tailwind** (`@myd-org/ui`) para las apps Next (CRM/dashboard). El widget consume **solo los tokens** y sigue self-contained. Descartado meter el widget en la librería de componentes (opción 3): ya está pulido y publicado; reescribirlo por consistencia que nadie pidió = YAGNI.
3. **Repo propio `@myd-org/ui`, publicado a GitHub Packages** (no monorepo). 3 de los 4 consumidores son externos (CRM, dashboard, widget) y consumen vía paquete publicado igual; el contrato real entre todos son los tokens. Espeja el patrón del widget (tsup, `.npmrc` con `${GITHUB_TOKEN}`, `publishConfig`). Versionado semver: un cambio del DS no toca las apps hasta que cada una sube su versión pinneada.
4. **Source of truth de tokens = `@myd-org/ui`**, no el widget. La librería define los *nombres de roles* + un theme default; cada app (incluido el widget) *mapea sus valores* sobre esos roles. El widget pasa de "dueño de los tokens" a "un theme más que consume el contrato".
5. **Packaging de componentes = estrategia A (ship source, compila el consumidor).** La lib publica `.tsx` con clases Tailwind; la app agrega `@source ".../node_modules/@myd-org/ui/dist"` a su CSS y *su* Tailwind v4 genera las utilidades. Bundle mínimo, theming vía tokens fluye natural, cero duplicación de CSS. Requiere que el consumidor sea app Tailwind (CRM y dashboard lo son). Descartado B (ship CSS compilado): duplica/colisiona con el reset de la app y el theming es más rígido; su única ventaja ("anda sin Tailwind") es irrelevante porque el widget no usa estos componentes.

## North Star — SDUI-ready (restricción de diseño, NO se construye ahora)

Visión futura (iniciativa aparte, su propio brainstorm/spec): un renderer de UI **schema-driven** (al estilo nullplatform) que genere dashboards / formularios / vistas a partir de JSON schemas — eventualmente generados por IA o por el usuario. Ese renderer no es más que `Map<"type-string", Componente>` + un loop sobre el JSON: **no puede existir sin una librería de componentes a la que apuntar.** Por eso el DS se hace primero, por necesidad. Precedente del venture: las tarjetas interactivas del widget ya son data-driven (`{label, url, style, icon}`), y los semantic tokens permiten que una vista generada salga on-brand sin saber un hex.

Para que el DS sea buen sustrato de eso, la librería sigue 3 principios de API desde el día 1 (gratis ahora, caro de retrofitear):

1. **Props declarativas y serializables para variantes** — variante vía string enum (`variant="primary"`), nunca pasando un subcomponente estilado.
2. **Componentes controlados / sin estado oculto** — apariencia y comportamiento descritos por props; el estado vive afuera.
3. **Contrato de props plano y tipado** (primitivos, enums, discriminated unions) → de ahí se puede *derivar* un JSON schema por componente más adelante.

No se construye registry, ni renderer, ni schemas en este proyecto.

## Diseño del Slice 1

Objetivo del slice: vertical y de-riesgo. Despeja los dos riesgos reales — (1) que el contrato de tokens funcione cruzando sustratos (app Tailwind v4 vía `@theme inline` + widget vía CSS plano), y (2) que el loop publicar→instalar→consumir sea limpio (el tarball en `/tmp` del widget mostró fricción acá). Entrega valor visible adoptándolo en el ai-dashboard.

### Forma del paquete y exports

```
@myd-org/ui              → componentes React (.tsx con clases Tailwind + CVA)
@myd-org/ui/tokens.css   → contrato de roles + theme default (CSS plano PURO; lo consume cualquiera, incl. el widget)
@myd-org/ui/tailwind.css → @import "tokens.css" + @theme inline (entry para apps Tailwind v4)
```

Los tokens van en **dos archivos** a propósito: `@theme inline` es una directiva de Tailwind, y el widget consume CSS plano (sin Tailwind). Meter `@theme` en el archivo que importa el widget le ensuciaría el bundle con un at-rule que su pipeline no procesa. Por eso `tokens.css` es CSS plano puro (lo importan el widget y, transitivamente, las apps) y `tailwind.css` agrega el mapeo a utilidades solo para los consumidores Tailwind.

- Build **tsup** (ESM+CJS+dts), espejando el widget. React como peer dep.
- Tests **vitest + Testing Library + jsdom** (misma stack que el widget).
- **Playground Vite en `example/`** para ver los componentes en browser con HMR. No Storybook (sobre-ingeniería ahora; revisitar si crece).
- `publishConfig` a GitHub Packages + `.npmrc` con `${GITHUB_TOKEN}`. Versión inicial `0.1.0`.

### Contrato de tokens

Solo los roles que definen marca (lo que cambia entre apps). El spacing se apoya en los defaults de Tailwind por ahora (YAGNI).

`tokens.css` — CSS plano puro, el contrato + theme default:

```css
:root {
  --color-bg; --color-surface; --color-elevated; --color-border; --color-ring;
  --color-text; --color-muted;
  --color-primary; --color-on-primary;
  --color-success; --color-success-soft;
  --color-danger;  --color-danger-soft;
  --color-warning; --color-warning-soft;
  --radius-sm; --radius; --radius-lg;
  --font-sans;
  --shadow-1; --shadow-2;
}
```

`tailwind.css` — entry para apps Tailwind v4:

```css
@import "@myd-org/ui/tokens.css";
@theme inline {
  /* mapea cada rol a utilidad Tailwind: bg-primary, text-muted, etc. */
  --color-primary: var(--color-primary);
  /* … */
}
```

**Adopción en una app Tailwind (CRM / dashboard):**

```css
@import "tailwindcss";
@import "@myd-org/ui/tailwind.css";
@source "../node_modules/@myd-org/ui/dist";   /* para que las utilidades de la lib compilen */
/* override de roles para re-marcar: */
:root { --color-primary: #0c3ed6; /* … */ }
```

**Adopción en el widget (CSS plano, SIN Tailwind):** importa `tokens.css` (no `tailwind.css`) y re-mapea sus `--aichat-*` sobre los roles, manteniendo su paleta cálida vía override de roles. Visualmente no cambia; pasa a consumir el contrato compartido:

```css
@import "@myd-org/ui/tokens.css";
.aichat-root {
  /* theme cálido del widget = override de roles */
  --color-primary: #1c1917; --color-bg: #faf9f7; /* … */
  /* los --aichat-* ahora referencian los roles */
  --aichat-primary: var(--color-primary);
  --aichat-bg: var(--color-bg); /* … */
}
```

### Convenciones de API (SDUI-ready)

Variante por enum (CVA + tailwind-merge), controlados, props planas y tipadas:

```ts
<Button variant="primary"|"secondary"|"ghost"|"danger" size="sm"|"md" loading? disabled? />
<Field label error? hint?> <Input … /> </Field>
<Badge tone="success"|"danger"|"warning"|"neutral" />
```

### Componentes del slice (~9)

Elegidos por lo que el ai-dashboard usa hoy (login OTP, `/agents` list + new/edit con personality/model/status, knowledge CRUD):

`Button` · `Input` · `Textarea` · `Field` (label/error/hint) · `Select` · `Card` · `Table` (lista) · `Badge` (status agente) · `PageShell` (header + contenido).

### Theming

Slice 1: override de roles a nivel app (`:root` en el `globals.css` de cada app). **Per-tenant theming = futuro** (probablemente scope `[data-theme]` o vars inline). No entra ahora.

### Vertical de prueba (dos consumidores, dos sustratos)

1. Publicar `@myd-org/ui@0.1.0` a GitHub Packages.
2. **ai-dashboard (Tailwind):** instalar vía `.npmrc` (NO tarball en `/tmp`), importar `tailwind.css` + `@source`, y reemplazar la UI mínima actual por los componentes, con el dashboard definiendo su theme sobre los roles. Valida el camino Tailwind (tokens + componentes + utilidades).
3. **ai-widget (CSS plano):** instalar `@myd-org/ui`, importar `tokens.css` y re-mapear los `--aichat-*` sobre los roles (su paleta cálida queda como override de roles, sin cambio visual). Valida el camino CSS-plano (tokens only) — confirma que el contrato cruza ambos sustratos. El widget sube de versión (`0.1.x`/`0.2.0`) al adoptar la dep.

## Fuera de alcance (slices siguientes)

- Modal/Dialog, Toast, Tabs, formularios complejos.
- Renderer SDUI / JSON-schema (iniciativa futura, brainstorm aparte).
- Adopción en el CRM (es de Dalila — se coordina cuando el DS esté probado en el dashboard).
- Spacing scale propio, per-tenant theming, dark mode.

## Criterios de éxito del slice 1

- `@myd-org/ui@0.1.0` publicado a GitHub Packages e instalable vía `.npmrc` desde otra carpeta (reproducible, sin `/tmp`).
- Los ~9 componentes con tests (vitest + Testing Library) en verde y typecheck limpio.
- Los tokens consumidos por **ambos sustratos**: una app Tailwind v4 (`tailwind.css` vía `@import` + `@source`, override de roles funcionando) **y** el widget en CSS plano (`tokens.css`, `--aichat-*` re-mapeados, sin cambio visual). Confirma que el contrato cruza ambos.
- ai-dashboard adopta los componentes y su UI deja de verse "mínima"; verificación visual en el playground/dashboard.
- ai-widget sigue verde (sus 30+ tests) tras re-mapear sus tokens sobre los roles.
