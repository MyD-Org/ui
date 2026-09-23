import { afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FacetGroup, type FacetItem } from './FacetGroup';

const marcas: FacetItem[] = [
  { value: 'GENROD', label: 'GENROD', count: 3390, checked: false },
  { value: 'MACROLED', label: 'MACROLED', count: 1788, checked: true },
  { value: 'INDICO', label: 'ÍNDICO', count: 12, checked: false },
];

const muchas = (checkedIndex?: number): FacetItem[] =>
  Array.from({ length: 22 }, (_, i) => ({
    value: `M${i + 1}`,
    label: `Marca ${i + 1}`,
    count: i,
    checked: i === checkedIndex,
  }));

const filas = () => screen.getAllByRole('checkbox');

describe('FacetGroup', () => {
  it('es un group nombrado por el título (h3)', () => {
    render(<FacetGroup title="Marcas" items={marcas} onToggle={() => {}} />);
    const group = screen.getByRole('group', { name: 'Marcas' });
    expect(within(group).getByRole('heading', { level: 3, name: 'Marcas' })).toBeInTheDocument();
  });

  it('cada fila tiene checkbox nombrado por la etiqueta y conteo visible', () => {
    render(<FacetGroup title="Marcas" items={marcas} onToggle={() => {}} />);
    expect(screen.getByRole('checkbox', { name: 'GENROD' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('checkbox', { name: 'MACROLED' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('3390')).toBeInTheDocument();
  });

  it('click en el texto de la fila → onToggle(value, true)', async () => {
    const onToggle = vi.fn();
    render(<FacetGroup title="Marcas" items={marcas} onToggle={onToggle} />);
    await userEvent.click(screen.getByText('GENROD'));
    expect(onToggle).toHaveBeenCalledWith('GENROD', true);
    await userEvent.click(screen.getByRole('checkbox', { name: 'MACROLED' }));
    expect(onToggle).toHaveBeenCalledWith('MACROLED', false);
  });

  it('searchable filtra insensible a tildes y mayúsculas; sin match muestra searchEmptyText', async () => {
    render(<FacetGroup title="Marcas" items={marcas} onToggle={() => {}} searchable searchPlaceholder="Buscar marca…" />);
    const input = screen.getByPlaceholderText('Buscar marca…');
    await userEvent.type(input, 'indico');
    expect(filas()).toHaveLength(1);
    expect(screen.getByRole('checkbox', { name: 'ÍNDICO' })).toBeInTheDocument();
    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('items=[] muestra emptyText', () => {
    render(<FacetGroup title="Categorías" items={[]} onToggle={() => {}} />);
    expect(screen.getByText('Sin opciones')).toBeInTheDocument();
  });

  it('emptyText y searchEmptyText son configurables', async () => {
    const { rerender } = render(<FacetGroup title="Categorías" items={[]} onToggle={() => {}} emptyText="Sin categorías para estos filtros" />);
    expect(screen.getByText('Sin categorías para estos filtros')).toBeInTheDocument();
    rerender(
      <FacetGroup title="Marcas" items={marcas} onToggle={() => {}} searchable searchEmptyText="No hay marcas que coincidan con su búsqueda." />,
    );
    await userEvent.type(screen.getByRole('textbox'), 'zzz');
    expect(screen.getByText('No hay marcas que coincidan con su búsqueda.')).toBeInTheDocument();
  });

  it('initialVisible colapsa: 6 + el tildado escondido = 7 filas y "Ver todas (22)"; al pulsar, 22 y "Ver menos"', async () => {
    render(<FacetGroup title="Marcas" items={muchas(14)} onToggle={() => {}} initialVisible={6} />);
    expect(filas()).toHaveLength(7);
    expect(screen.getByRole('checkbox', { name: 'Marca 15' })).toBeInTheDocument();
    const more = screen.getByRole('button', { name: 'Ver todas (22)' });
    await userEvent.click(more);
    expect(filas()).toHaveLength(22);
    await userEvent.click(screen.getByRole('button', { name: 'Ver menos' }));
    expect(filas()).toHaveLength(7);
  });

  it('moreLabel con {n} y lessLabel configurables', () => {
    render(<FacetGroup title="Marcas" items={muchas()} onToggle={() => {}} initialVisible={6} moreLabel="Ver todas las marcas ({n})" />);
    expect(screen.getByRole('button', { name: 'Ver todas las marcas (22)' })).toBeInTheDocument();
  });

  it('sin colapso cuando items.length <= initialVisible', () => {
    render(<FacetGroup title="Marcas" items={marcas} onToggle={() => {}} initialVisible={6} />);
    expect(screen.queryByRole('button', { name: /Ver todas/ })).toBeNull();
  });

  it('mientras hay búsqueda no aplica el colapso', async () => {
    render(<FacetGroup title="Marcas" items={muchas()} onToggle={() => {}} initialVisible={6} searchable />);
    await userEvent.type(screen.getByRole('textbox'), 'marca 1');
    // "Marca 1", "Marca 10".."Marca 19" = 11 coincidencias, todas visibles
    expect(filas()).toHaveLength(11);
    expect(screen.queryByRole('button', { name: /Ver todas/ })).toBeNull();
  });

  it('onClear + algún checked → botón "Limpiar"; sin checked no aparece', async () => {
    const onClear = vi.fn();
    const { rerender } = render(<FacetGroup title="Marcas" items={marcas} onToggle={() => {}} onClear={onClear} />);
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar' }));
    expect(onClear).toHaveBeenCalledOnce();
    rerender(<FacetGroup title="Marcas" items={marcas.map((m) => ({ ...m, checked: false }))} onToggle={() => {}} onClear={onClear} />);
    expect(screen.queryByRole('button', { name: 'Limpiar' })).toBeNull();
  });

  it('ítem disabled deja el checkbox deshabilitado', () => {
    render(<FacetGroup title="Marcas" items={[{ ...marcas[0], disabled: true }]} onToggle={() => {}} />);
    expect(screen.getByRole('checkbox', { name: 'GENROD' })).toBeDisabled();
  });
});

describe('FacetGroup: la lista expandida no agranda el grupo', () => {
  // jsdom no hace layout: todo mide 0. Se simula el alto de la lista colapsada.
  const simularAlto = (px: number) =>
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(px);
  afterEach(() => vi.restoreAllMocks());

  const lista = () => screen.getByRole('group', { name: 'Marcas' }).querySelector('ul')!;

  it('colapsada no tiene tope; expandida queda con el alto colapsado y scrollea', async () => {
    simularAlto(160);
    render(<FacetGroup title="Marcas" items={muchas()} onToggle={() => {}} initialVisible={6} />);
    expect(lista().style.maxHeight).toBe('');
    expect(lista().className).not.toContain('overflow-y-auto');

    await userEvent.click(screen.getByRole('button', { name: 'Ver todas (22)' }));
    expect(filas()).toHaveLength(22);
    expect(lista().style.maxHeight).toBe('160px');
    expect(lista().className).toContain('overflow-y-auto');

    await userEvent.click(screen.getByRole('button', { name: 'Ver menos' }));
    expect(lista().style.maxHeight).toBe('');
  });

  it('con una búsqueda también queda con el tope', async () => {
    simularAlto(160);
    render(<FacetGroup title="Marcas" items={muchas()} onToggle={() => {}} initialVisible={6} searchable />);
    await userEvent.type(screen.getByRole('textbox'), 'marca');
    expect(filas()).toHaveLength(22);
    expect(lista().style.maxHeight).toBe('160px');
  });

  it('sin initialVisible nunca hay tope: no hay un alto colapsado que respetar', async () => {
    simularAlto(160);
    render(<FacetGroup title="Marcas" items={muchas()} onToggle={() => {}} searchable />);
    await userEvent.type(screen.getByRole('textbox'), 'marca');
    expect(lista().style.maxHeight).toBe('');
  });

  it('sin medida (alto 0) no pone tope: nunca esconde la lista entera', async () => {
    simularAlto(0);
    render(<FacetGroup title="Marcas" items={muchas()} onToggle={() => {}} initialVisible={6} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ver todas (22)' }));
    expect(lista().style.maxHeight).toBe('');
  });
});

describe('FacetGroup: árbol plegable', () => {
  const arbol = (tildados: string[] = []): FacetItem[] =>
    [
      { value: 'ele', label: 'Electricidad', count: 758 },
      { value: 'ilu', label: 'Iluminación', count: 800 },
      { value: 'focos', label: 'Focos led', count: 6, depth: 1 },
      { value: 'dicro', label: 'Dicroicas', count: 2, depth: 2 },
      { value: 'paneles', label: 'Paneles', count: 41, depth: 1 },
      { value: 'seg', label: 'Seguridad', count: 16 },
    ].map((it) => ({ ...it, checked: tildados.includes(it.value) }));

  const nombres = () => filas().map((c) => c.getAttribute('aria-label'));

  it('arranca con las ramas cerradas: sólo las raíces, y chevron sólo en las madres', () => {
    render(<FacetGroup title="Categorías" items={arbol()} onToggle={() => {}} />);
    expect(nombres()).toEqual(['Electricidad', 'Iluminación', 'Seguridad']);
    expect(screen.getByRole('button', { name: 'Ver subcategorías de Iluminación' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: /subcategorías de Electricidad/ })).toBeNull();
  });

  it('el chevron abre y cierra la rama, un nivel por vez', async () => {
    const user = userEvent.setup();
    render(<FacetGroup title="Categorías" items={arbol()} onToggle={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Ver subcategorías de Iluminación' }));
    expect(nombres()).toEqual(['Electricidad', 'Iluminación', 'Focos led', 'Paneles', 'Seguridad']);
    await user.click(screen.getByRole('button', { name: 'Ocultar subcategorías de Iluminación' }));
    expect(nombres()).toEqual(['Electricidad', 'Iluminación', 'Seguridad']);
  });

  it('una rama con algo tildado adentro se abre sola y la madre queda en estado intermedio', () => {
    render(<FacetGroup title="Categorías" items={arbol(['dicro'])} onToggle={() => {}} />);
    expect(nombres()).toEqual(['Electricidad', 'Iluminación', 'Focos led', 'Dicroicas', 'Paneles', 'Seguridad']);
    expect(screen.getByRole('checkbox', { name: 'Iluminación' })).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByRole('checkbox', { name: 'Focos led' })).toHaveAttribute('aria-checked', 'mixed');
  });

  it('con la madre tildada, las hijas se ven tildadas y deshabilitadas', async () => {
    const user = userEvent.setup();
    render(<FacetGroup title="Categorías" items={arbol(['ilu'])} onToggle={() => {}} />);
    await user.click(screen.getByRole('button', { name: 'Ver subcategorías de Iluminación' }));
    const focos = screen.getByRole('checkbox', { name: 'Focos led' });
    expect(focos).toHaveAttribute('aria-checked', 'true');
    expect(focos).toBeDisabled();
  });

  it('el chevron no tilda: onToggle sólo sale de la casilla', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<FacetGroup title="Categorías" items={arbol()} onToggle={onToggle} />);
    await user.click(screen.getByRole('button', { name: 'Ver subcategorías de Iluminación' }));
    expect(onToggle).not.toHaveBeenCalled();
    await user.click(screen.getByText('Focos led'));
    expect(onToggle).toHaveBeenCalledWith('focos', true);
  });

  it('la sangría corre la fila entera por nivel y satura en 3', () => {
    render(
      <FacetGroup
        title="Categorías"
        items={[
          { value: 'a', label: 'A', checked: false },
          { value: 'b', label: 'B', checked: false, depth: 1 },
          { value: 'c', label: 'C', checked: false, depth: 2 },
          { value: 'd', label: 'D', checked: true, depth: 7 },
        ]}
        onToggle={() => {}}
      />,
    );
    const fila = (name: string) => screen.getByRole('checkbox', { name }).closest('li')!;
    expect(fila('A').className).not.toMatch(/\bpl-/);
    expect(fila('B').className).toContain('pl-6');
    expect(fila('D').className).toContain('pl-18');
  });

  it('el chevron va a la derecha de la fila y las raíces no se corren', () => {
    render(<FacetGroup title="Categorías" items={arbol()} onToggle={() => {}} />);
    const chevron = screen.getByRole('button', { name: 'Ver subcategorías de Iluminación' });
    const fila = chevron.closest('li')!;
    expect(fila.lastElementChild).toBe(chevron);
    expect(fila.className).not.toMatch(/\bpl-/);
  });

  it('expandLabel y collapseLabel configurables', () => {
    render(<FacetGroup title="Categorías" items={arbol()} onToggle={() => {}} expandLabel="Abrir {label}" collapseLabel="Cerrar {label}" />);
    expect(screen.getByRole('button', { name: 'Abrir Iluminación' })).toBeInTheDocument();
  });

  it('una lista sin madres no dibuja chevrons ni huecos', () => {
    const { container } = render(<FacetGroup title="Marcas" items={marcas} onToggle={() => {}} />);
    expect(screen.queryByRole('button', { name: /subcategorías/ })).toBeNull();
    expect(container.querySelector('li > span[aria-hidden="true"]')).toBeNull();
  });
});
