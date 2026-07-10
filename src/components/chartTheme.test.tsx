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
