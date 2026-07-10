# Charts para el AI Dashboard Builder — Plan de implementación (sub-proyecto 1/5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar los widgets de visualización (KpiCard + 5 charts Recharts) a `@myd-org/ui` y registrarlos en `@myd-org/sdui` (registry + componentManifest), publicando ui 0.5.0 y sdui 0.5.0.

**Architecture:** Componentes SDUI-ready (props planas serializables, sin estado oculto) sobre Recharts, con paleta vía tokens CSS nuevos (`--chart-1..6`). En jsdom Recharts no mide contenedores: cada chart acepta `width` fijo opcional (tests) y usa `ResponsiveContainer` cuando no se lo pasan. Luego se registran en el registry/manifest de sdui para que el renderer los pinte y el agente/inspector los conozcan.

**Tech Stack:** React 19, Recharts ^2.12.7 (la versión de Avantec), CVA/Tailwind (patrones del DS), vitest + Testing Library, tsup.

**Spec:** `platform/docs/superpowers/specs/2026-07-10-ai-dashboard-builder-design.md`

## Global Constraints

- Repos: `~/Documents/projects/owns/ui` y `~/Documents/projects/owns/sdui`. Trabajar en main (repos propios pre-release).
- Recharts se agrega como `dependency` de ui y se **externaliza** en tsup (mismo patrón que `@radix-ui/*`).
- Todos los charts: `data` ausente o vacía → placeholder "Sin datos" (nunca crashear — regla SDUI).
- Textos default en es-AR (idioma del producto).
- Correr SIEMPRE: `npm test && npm run typecheck && npm run build` antes de cada commit.

---

### Task 1: Setup — dep recharts, external en tsup, tokens de paleta

**Files:**
- Modify: `ui/package.json` (dependencia `"recharts": "^2.12.7"`)
- Modify: `ui/tsup.config.ts` (external + `'recharts'`)
- Modify: `ui/src/styles/tokens.css` (tokens `--chart-1..6`)

**Interfaces:**
- Produces: tokens CSS `--chart-1` a `--chart-6` que `chartTheme.ts` (Task 2) referencia.

- [ ] **Step 1:** `cd ~/Documents/projects/owns/ui && npm install recharts@^2.12.7`
- [ ] **Step 2:** En `tsup.config.ts`, external pasa a `['react', 'react-dom', 'recharts', /^@radix-ui\//]`.
- [ ] **Step 3:** En `tokens.css`, después de `--color-info-soft`, agregar:

```css
  /* paleta categórica para charts (dashboards) */
  --chart-1: #2563eb;
  --chart-2: #1b7a45;
  --chart-3: #9a6400;
  --chart-4: #d2150f;
  --chart-5: #7c3aed;
  --chart-6: #0891b2;
```

- [ ] **Step 4:** `npm run build` → OK. Commit: `feat(charts): dep recharts + tokens de paleta --chart-1..6`

### Task 2: `chartTheme.ts` — paleta, normalización de series, empty state

**Files:**
- Create: `ui/src/components/chartTheme.tsx`
- Test: `ui/src/components/chartTheme.test.tsx`

**Interfaces:**
- Produces:
  - `type SeriesSpec = string | { key: string; label?: string; color?: string }`
  - `normalizeSeries(series?: SeriesSpec[]): { key: string; label: string; color: string }[]` (color = `var(--chart-N)` ciclando)
  - `CHART_COLORS: string[]` (6 vars)
  - `<ChartEmpty height={number} label?>` — caja borde punteado, texto "Sin datos", `role="img"` `aria-label`
  - `axisProps`, `gridProps`, `tooltipProps` — objetos de estilo compartidos (tick fill `var(--color-muted)` size 12; grid stroke `var(--color-border)`; tooltip surface+borde+radius)
  - `<ChartShell width? height children>` — con `width` renderiza hijos fijos; sin `width`, `ResponsiveContainer` (100% × height)

- [ ] **Step 1: Test que falla** (`chartTheme.test.tsx`):

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { normalizeSeries, CHART_COLORS, ChartEmpty } from './chartTheme';

describe('normalizeSeries', () => {
  it('convierte strings a series con label=key y color de la paleta', () => {
    expect(normalizeSeries(['ventas', 'costos'])).toEqual([
      { key: 'ventas', label: 'ventas', color: CHART_COLORS[0] },
      { key: 'costos', label: 'costos', color: CHART_COLORS[1] },
    ]);
  });
  it('respeta label y color explícitos y cicla la paleta', () => {
    const out = normalizeSeries([{ key: 'a', label: 'Ventas', color: '#111' }, 'b', 'c', 'd', 'e', 'f', 'g']);
    expect(out[0]).toEqual({ key: 'a', label: 'Ventas', color: '#111' });
    expect(out[6].color).toBe(CHART_COLORS[0]); // 7ma serie cicla
  });
  it('series vacías/undefined → []', () => {
    expect(normalizeSeries(undefined)).toEqual([]);
  });
});

describe('ChartEmpty', () => {
  it('muestra Sin datos con role img', () => {
    render(<ChartEmpty height={200} />);
    expect(screen.getByRole('img', { name: 'Sin datos' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** correr → FAIL (módulo no existe).
- [ ] **Step 3: Implementación** (`chartTheme.tsx`):

```tsx
import type { ReactElement, ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';

export type SeriesSpec = string | { key: string; label?: string; color?: string };
export interface NormalizedSeries { key: string; label: string; color: string }

export const CHART_COLORS = [1, 2, 3, 4, 5, 6].map((n) => `var(--chart-${n})`);

export function normalizeSeries(series?: SeriesSpec[]): NormalizedSeries[] {
  if (!series) return [];
  return series.map((s, i) => {
    const spec = typeof s === 'string' ? { key: s } : s;
    return { key: spec.key, label: spec.label ?? spec.key, color: spec.color ?? CHART_COLORS[i % CHART_COLORS.length] };
  });
}

export function ChartEmpty({ height, label = 'Sin datos' }: { height: number; label?: string }) {
  return (
    <div role="img" aria-label={label} style={{ height }}
      className="flex items-center justify-center rounded-[var(--radius)] border border-dashed border-border text-sm text-muted">
      {label}
    </div>
  );
}

export const axisProps = { tick: { fill: 'var(--color-muted)', fontSize: 12 }, tickLine: false, axisLine: { stroke: 'var(--color-border)' } } as const;
export const gridProps = { stroke: 'var(--color-border)', vertical: false } as const;
export const tooltipProps = {
  contentStyle: { background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: 12 },
} as const;

export function ChartShell({ width, height, children }: { width?: number; height: number; children: ReactElement }) {
  if (width) return children; // tamaño fijo (tests / hosts que miden ellos)
  return <ResponsiveContainer width="100%" height={height}>{children}</ResponsiveContainer>;
}
```

- [ ] **Step 4:** test → PASS. Commit: `feat(charts): chartTheme (paleta, normalizeSeries, ChartEmpty, ChartShell)`

### Task 3: `KpiCard`

**Files:**
- Create: `ui/src/components/KpiCard.tsx` · Test: `ui/src/components/KpiCard.test.tsx`

**Interfaces:**
- Produces: `<KpiCard label value? unit? prefix? suffix? tone? hint? locale?>` — `value: string|number`; número → `Intl.NumberFormat(locale='es-AR')`; `tone: 'neutral'|'success'|'warning'|'danger'` colorea el valor.

- [ ] **Step 1: Test que falla:**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('muestra label y valor numérico formateado es-AR', () => {
    render(<KpiCard label="Ventas del mes" value={125430.5} prefix="$" />);
    expect(screen.getByText('Ventas del mes')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('125.430,5')).toBeInTheDocument();
  });
  it('valor string pasa tal cual + unit y hint', () => {
    render(<KpiCard label="Stock crítico" value="12" unit="ítems" hint="últimos 30 días" />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('ítems')).toBeInTheDocument();
    expect(screen.getByText('últimos 30 días')).toBeInTheDocument();
  });
  it('sin value muestra —', () => {
    render(<KpiCard label="Total" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** FAIL. **Step 3: Implementación:**

```tsx
import { cn } from '../lib/cn';

export interface KpiCardProps {
  label: string;
  value?: string | number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  hint?: string;
  locale?: string;
  className?: string;
}

const toneClass = {
  neutral: 'text-text', success: 'text-success', warning: 'text-warning', danger: 'text-danger',
} as const;

export function KpiCard({ label, value, unit, prefix, suffix, tone = 'neutral', hint, locale = 'es-AR', className }: KpiCardProps) {
  const display = value === undefined || value === null ? '—'
    : typeof value === 'number' ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value) : value;
  return (
    <div className={cn('rounded-[var(--radius)] border border-border bg-surface p-4 shadow-[var(--shadow-1)]', className)}>
      <div className="text-sm text-muted">{label}</div>
      <div className={cn('mt-1 flex items-baseline gap-1 text-3xl font-semibold tracking-tight', toneClass[tone])}>
        {prefix && <span className="text-xl font-medium text-muted">{prefix}</span>}
        <span>{display}</span>
        {unit && <span className="text-sm font-normal text-muted">{unit}</span>}
        {suffix && <span className="text-xl font-medium text-muted">{suffix}</span>}
      </div>
      {hint && <div className="mt-1 text-xs text-subtle">{hint}</div>}
    </div>
  );
}
```

- [ ] **Step 4:** PASS → Commit: `feat(charts): KpiCard`

### Task 4: charts cartesianos — `LineChart`, `AreaChart`, `BarChart`

**Files:**
- Create: `ui/src/components/LineChart.tsx`, `AreaChart.tsx`, `BarChart.tsx`
- Test: `ui/src/components/CartesianCharts.test.tsx`

**Interfaces:**
- Consumes: Task 2 (`normalizeSeries`, `ChartShell`, `ChartEmpty`, `axisProps/gridProps/tooltipProps`, `SeriesSpec`).
- Produces (props comunes `CartesianChartProps`): `data?: Array<Record<string, unknown>>`, `xKey: string`, `series?: SeriesSpec[]`, `height?=280`, `width?`, `showLegend?=true`, `showGrid?=true`. `AreaChart` + `stacked?`; `BarChart` + `stacked?` y `horizontal?` (mapea a `layout="vertical"` de Recharts con ejes invertidos).

- [ ] **Step 1: Test que falla** (representativo; los tres comparten forma):

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LineChart } from './LineChart';
import { AreaChart } from './AreaChart';
import { BarChart } from './BarChart';

const data = [
  { mes: 'Ene', ventas: 10, costos: 6 },
  { mes: 'Feb', ventas: 14, costos: 8 },
];

describe.each([
  ['LineChart', LineChart], ['AreaChart', AreaChart], ['BarChart', BarChart],
] as const)('%s', (_name, Chart) => {
  it('renderiza SVG con leyenda de las series', () => {
    const { container } = render(
      <Chart data={data} xKey="mes" series={['ventas', { key: 'costos', label: 'Costos' }]} width={400} height={240} />,
    );
    expect(container.querySelector('svg.recharts-surface')).toBeTruthy();
    expect(screen.getByText('ventas')).toBeInTheDocument();
    expect(screen.getByText('Costos')).toBeInTheDocument();
  });
  it('sin data muestra Sin datos', () => {
    render(<Chart xKey="mes" series={['ventas']} width={400} />);
    expect(screen.getByRole('img', { name: 'Sin datos' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** FAIL. **Step 3: Implementación** — `LineChart.tsx` (patrón; Area/Bar análogos):

```tsx
import { CartesianGrid, Legend, Line, LineChart as RLineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { axisProps, ChartEmpty, ChartShell, gridProps, normalizeSeries, tooltipProps, type SeriesSpec } from './chartTheme';

export interface LineChartProps {
  data?: Array<Record<string, unknown>>;
  xKey: string;
  series?: SeriesSpec[];
  height?: number;
  width?: number;
  showLegend?: boolean;
  showGrid?: boolean;
}

export function LineChart({ data, xKey, series, height = 280, width, showLegend = true, showGrid = true }: LineChartProps) {
  const s = normalizeSeries(series);
  if (!data?.length || !s.length) return <ChartEmpty height={height} />;
  return (
    <ChartShell width={width} height={height}>
      <RLineChart data={data} width={width} height={width ? height : undefined} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
        {showGrid && <CartesianGrid {...gridProps} />}
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={44} />
        <Tooltip {...tooltipProps} />
        {showLegend && <Legend />}
        {s.map((serie) => (
          <Line key={serie.key} type="monotone" dataKey={serie.key} name={serie.label}
            stroke={serie.color} strokeWidth={2} dot={false} isAnimationActive={false} />
        ))}
      </RLineChart>
    </ChartShell>
  );
}
```

`AreaChart.tsx`: igual con `<Area ... fill={serie.color} fillOpacity={0.15} stackId={stacked ? 'stack' : undefined} />`.
`BarChart.tsx`: igual con `<Bar ... fill={serie.color} stackId={stacked ? 'stack' : undefined} radius={[3,3,0,0]} />`; si `horizontal`, `layout="vertical"` + `<XAxis type="number">` + `<YAxis dataKey={xKey} type="category">`.
En los tres: `isAnimationActive={false}` (determinismo en jsdom y en dashboards).

- [ ] **Step 4:** PASS → Commit: `feat(charts): LineChart, AreaChart, BarChart (Recharts, SDUI-ready)`

### Task 5: `PieChart` y `DonutChart`

**Files:**
- Create: `ui/src/components/PieChart.tsx`, `DonutChart.tsx` · Test: `ui/src/components/PieCharts.test.tsx`

**Interfaces:**
- Consumes: Task 2. Produces: `<PieChart data? labelKey valueKey height?=280 width? showLegend?=true colors?>`; `<DonutChart ...igual + showTotal?>` (total = Σ valueKey, centrado).

- [ ] **Step 1: Test que falla:**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PieChart } from './PieChart';
import { DonutChart } from './DonutChart';

const data = [
  { estado: 'aceptado', total: 12 },
  { estado: 'enviado', total: 8 },
];

describe('PieChart/DonutChart', () => {
  it('renderiza SVG con leyenda por categoría', () => {
    const { container } = render(<PieChart data={data} labelKey="estado" valueKey="total" width={400} height={240} />);
    expect(container.querySelector('svg.recharts-surface')).toBeTruthy();
    expect(screen.getByText('aceptado')).toBeInTheDocument();
  });
  it('DonutChart con showTotal muestra la suma', () => {
    render(<DonutChart data={data} labelKey="estado" valueKey="total" showTotal width={400} height={240} />);
    expect(screen.getByText('20')).toBeInTheDocument();
  });
  it('sin data muestra Sin datos', () => {
    render(<PieChart labelKey="x" valueKey="y" width={400} />);
    expect(screen.getByRole('img', { name: 'Sin datos' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** FAIL. **Step 3:** `PieChart.tsx` implementa un componente interno `BasePie({ innerRadius, centerLabel, ...props })`: `<RPieChart>` + `<Pie data dataKey={valueKey} nameKey={labelKey} isAnimationActive={false}>` con `<Cell fill={colors[i % n]}>` por slice (colors default `CHART_COLORS`) + `<Tooltip {...tooltipProps}/>` + `<Legend/>` opcional; `DonutChart.tsx` = `BasePie` con `innerRadius="62%"` y, si `showTotal`, `<text>` SVG centrado con la suma formateada (`Intl.NumberFormat('es-AR')`). Export `BasePie` NO va al barrel.
- [ ] **Step 4:** PASS → Commit: `feat(charts): PieChart y DonutChart (+showTotal)`

### Task 6: barrel, stories, verificación total y publish ui 0.5.0

**Files:**
- Modify: `ui/src/index.ts` (exportar KpiCard/LineChart/AreaChart/BarChart/PieChart/DonutChart + tipos + SeriesSpec)
- Create: `ui/src/components/Charts.stories.tsx` (grupo "Charts/": una story por widget + un dashboard-style grid)

**Steps:**
- [ ] Barrel + stories (datos de ejemplo tipo Avantec: ventas por mes, presupuestos por estado).
- [ ] `npm test && npm run typecheck && npm run build && npm run build-storybook` → todo verde.
- [ ] `npm version 0.5.0 --no-git-tag-version` → commit `feat(charts): widgets de visualización para dashboards (0.5.0)` → `npm publish` → push main.

### Task 7: sdui — registro en registry + componentManifest, publish sdui 0.5.0

**Files:**
- Modify: `sdui/src/registry.ts` (importar y registrar los 6)
- Modify: `sdui/src/manifest.ts` (entradas con defaults con data de ejemplo para que el builder/palette los muestre vivos)
- Modify: `sdui/package.json` (bump 0.5.0; `@myd-org/ui` dep de dev/peer a `>=0.5.0`)
- Test: `sdui/test/registry-charts.test.tsx` (nuevo)

**Interfaces:**
- Consumes: `@myd-org/ui@0.5.0` (los 6 componentes).
- Produces: types `KpiCard|LineChart|AreaChart|BarChart|PieChart|DonutChart` renderizables por `createRenderer()` y descriptos en `componentManifest` (los usa la guía del agente en ai-api y el inspector del design mode).

- [ ] **Step 1: Test que falla** (`registry-charts.test.tsx`):

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRenderer } from '../src';
import { componentManifest } from '../src/manifest';
import { defaultRegistry } from '../src/registry';

const CHARTS = ['KpiCard', 'LineChart', 'AreaChart', 'BarChart', 'PieChart', 'DonutChart'];

describe('charts en el registry', () => {
  it('todos los charts están en registry y manifest', () => {
    for (const t of CHARTS) {
      expect(defaultRegistry[t], t).toBeTruthy();
      expect(componentManifest[t], t).toBeTruthy();
    }
  });
  it('renderiza un BarChart desde un nodo SDUI con data bindeada', () => {
    const { render: renderNode } = createRenderer();
    const { container } = render(renderNode(
      { type: 'BarChart', props: { data: '{{ventasPorMes}}', xKey: 'mes', series: ['total'], width: 360, height: 200 } },
      { data: { ventasPorMes: [{ mes: 'Ene', total: 5 }] } },
    ));
    expect(container.querySelector('svg.recharts-surface')).toBeTruthy();
  });
  it('KpiCard bindea value', () => {
    const { render: renderNode } = createRenderer();
    render(renderNode(
      { type: 'KpiCard', props: { label: 'Total', value: '{{total}}' } },
      { data: { total: 42 } },
    ));
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2:** FAIL. **Step 3:** registrar en `registry.ts`; entradas de manifest:

```ts
// helpers ya existentes: str, strd, bool
const num = (def?: number): PropSpec => ({ type: 'number', ...(def !== undefined ? { default: def } : {}) });
const sampleSeries = [{ mes: 'Ene', total: 12 }, { mes: 'Feb', total: 18 }, { mes: 'Mar', total: 9 }];
const samplePie = [{ etiqueta: 'A', valor: 40 }, { etiqueta: 'B', valor: 25 }, { etiqueta: 'C', valor: 20 }];

KpiCard: { label: 'KPI', props: {
  label: strd('Métrica'), value: { type: 'string', bindable: true, default: '0' },
  unit: str(), prefix: str(), suffix: str(),
  tone: { type: 'enum', options: ['neutral', 'success', 'warning', 'danger'], default: 'neutral' },
  hint: str(),
} },
LineChart: { label: 'Línea', props: {
  data: { type: 'json', bindable: true, default: sampleSeries },
  xKey: strd('mes', false), series: { type: 'json', default: ['total'] },
  height: num(280), showLegend: bool(), showGrid: bool(),
} },
AreaChart: { ...igual + stacked: bool() },
BarChart: { ...igual + stacked: bool(), horizontal: bool() },
PieChart: { label: 'Torta', props: {
  data: { type: 'json', bindable: true, default: samplePie },
  labelKey: strd('etiqueta', false), valueKey: strd('valor', false),
  height: num(280), showLegend: bool(),
} },
DonutChart: { ...igual + showTotal: bool() },
```

- [ ] **Step 4:** `npm test` (los 82 previos + nuevos) + typecheck + build → verde. Bump 0.5.0.
- [ ] **Step 5:** Commit `feat: charts del DS en registry + manifest (KpiCard, Line/Area/Bar, Pie/Donut)` → `npm publish` (primera publicación desde 0.1.0: publica 0.5.0) → push main.
