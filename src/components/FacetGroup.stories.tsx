import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { FacetGroup, type FacetItem } from './FacetGroup';
import { Card } from './Card';
import { Divider } from './Divider';

const meta: Meta<typeof FacetGroup> = {
  title: 'Components/FacetGroup',
  component: FacetGroup,
  decorators: [(Story) => <div className="w-72"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof FacetGroup>;

const categorias: FacetItem[] = [
  { value: 'ELECTRICIDAD', label: 'Electricidad', count: 7076, checked: false },
  { value: 'ILUMINACION', label: 'Iluminación', count: 2626, checked: true },
  { value: 'HERRAMIENTAS', label: 'Herramientas', count: 1815, checked: false },
  { value: 'SEGURIDAD', label: 'Seguridad', count: 268, checked: false },
];

const marcas: FacetItem[] = [
  ['GENROD', 3390, true],
  ['MACROLED', 1788, true],
  ['JADEVER', 1640, false],
  ['CHINT', 1389, false],
  ['WEIDMULLER', 751, false],
  ['TECLASTAR', 508, false],
  ['ÍNDICO', 420, false],
  ['EXULTT', 390, false],
  ['TACOMA', 210, false],
  ['SICA', 180, false],
  ['RICHI', 150, false],
  ['KALOP', 120, false],
  ['TRIVIALTECH', 90, false],
  ['PHILIPS', 80, false],
  ['OSRAM', 70, false],
  ['LEDVANCE', 60, false],
  ['ELIBET', 50, false],
  ['CAMBRE', 40, false],
  ['SCHNEIDER', 30, false],
  ['ABB', 20, false],
  ['SIEMENS', 10, false],
  ['LEGRAND', 5, false],
].map(([label, count, checked]) => ({ value: String(label), label: String(label), count: Number(count), checked: Boolean(checked) }));

function Demo({ items, ...props }: Omit<ComponentProps<typeof FacetGroup>, 'onToggle'>) {
  const [state, setState] = useState(items);
  return (
    <FacetGroup
      {...props}
      items={state}
      onToggle={(value, checked) => setState((s) => s.map((it) => (it.value === value ? { ...it, checked } : it)))}
      onClear={() => setState((s) => s.map((it) => ({ ...it, checked: false })))}
    />
  );
}

export const Categorias: Story = { render: () => <Demo title="Categorías" items={categorias} /> };

export const MarcasConBuscador: Story = {
  render: () => (
    <Demo
      title="Marcas"
      items={marcas}
      searchable
      searchPlaceholder="Buscar marca…"
      initialVisible={6}
      moreLabel="Ver todas las marcas ({n})"
      searchEmptyText="No hay marcas que coincidan con su búsqueda."
    />
  ),
};

export const Vacio: Story = {
  render: () => <Demo title="Categorías" items={[]} emptyText="Sin categorías para estos filtros" />,
};

export const EnPanelDeFiltros: Story = {
  render: () => (
    <Card title="Filtros">
      <Demo title="Categorías" items={categorias} />
      <Divider className="my-4" />
      <Demo title="Marcas" items={marcas} searchable searchPlaceholder="Buscar marca…" initialVisible={6} moreLabel="Ver todas las marcas ({n})" />
    </Card>
  ),
};
