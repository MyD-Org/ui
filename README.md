# @myd-org/ui

Design system compartido para los frontends del venture (CRM, ai-dashboard, ai-widget y futuros).
Infraestructura compartida con **marca por-app**: un contrato de _tokens semánticos_ (roles de color, radios, tipografía, sombras) que cada app re-marca, más una librería de componentes React estilados con Tailwind v4.

## Instalación

Se publica en **GitHub Packages** (registry privado). En el repo consumidor, agregá un `.npmrc`:

```
@myd-org:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Luego:

```bash
npm install @myd-org/ui
```

## Uso

### Apps Tailwind v4 (CRM, ai-dashboard) — tokens + componentes

En tu CSS global:

```css
@import "tailwindcss";
@import "@myd-org/ui/tailwind.css";
/* permite que Tailwind compile las utilidades usadas por la lib (ship-source) */
@source "../../node_modules/@myd-org/ui/dist";

/* re-marca: pisá los roles con la paleta de tu app */
:root {
  --color-primary: #0c3ed6;
  /* … */
}
```

> El path de `@source` es relativo a tu archivo CSS. Ajustalo según dónde viva (ej. desde `src/app/globals.css` en Next: `../../node_modules/@myd-org/ui/dist`).

En tus componentes:

```tsx
import { Button, Field, Input, Table, Badge, PageShell } from "@myd-org/ui";

<PageShell title="Agentes" actions={<Button>Nuevo</Button>}>
  <Field label="Nombre" hint="Nombre visible">
    <Input placeholder="Soporte" />
  </Field>
</PageShell>;
```

### Consumidores de CSS plano (ai-widget) — solo tokens

El widget no usa Tailwind; consume únicamente el contrato de roles y mapea sus variables sobre él:

```css
@import "@myd-org/ui/tokens.css";

.aichat-root {
  /* theme propio = override de roles */
  --color-primary: #1c1917;
  --color-bg: #faf9f7;
  /* tus tokens derivan de los roles */
  --aichat-primary: var(--color-primary);
}
```

## Componentes

`Button` · `Input` · `Textarea` · `Field` · `Select` · `Card` · `Table` · `Badge` · `PageShell`, más el helper `cn` (clsx + tailwind-merge).

Convención de API (SDUI-ready): variantes por string enum (`variant`, `tone`), componentes controlados, props planas y tipadas (datos tabulares y opciones como arrays serializables).

## Roles de token

Color: `--color-bg` `--color-surface` `--color-elevated` `--color-border` `--color-border-strong` `--color-ring` `--color-text` `--color-muted` `--color-subtle` `--color-primary` `--color-primary-hover` `--color-primary-soft` `--color-on-primary` `--color-accent` `--color-accent-strong` `--color-{success,danger,warning}(-soft)`.
Forma/texto: `--radius-sm` `--radius` `--radius-lg` `--font-sans` `--shadow-1` `--shadow-2`.
