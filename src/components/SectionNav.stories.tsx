import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { SectionNav, type SectionNavItem } from './SectionNav';

const meta: Meta<typeof SectionNav> = {
  title: 'Components/SectionNav',
  component: SectionNav,
};
export default meta;
type Story = StoryObj<typeof SectionNav>;

const Icono = ({ d }: { d: ReactNode }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);

const conIconos: SectionNavItem[] = [
  { id: 'pedidos', label: 'Pedidos', href: '#pedidos', active: true, icon: <Icono d={<><path d="M21 8 12 3 3 8v8l9 5 9-5Z" /><path d="M3 8l9 5 9-5M12 13v8" /></>} /> },
  { id: 'facturas', label: 'Facturas', href: '#facturas', icon: <Icono d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>} /> },
  { id: 'favoritos', label: 'Favoritos', href: '#favoritos', icon: <Icono d={<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />} /> },
  { id: 'direcciones', label: 'Direcciones', href: '#direcciones', icon: <Icono d={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>} /> },
  { id: 'envios', label: 'Envíos y retiro', href: '#envios', icon: <Icono d={<><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-4l-4-5h-4" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></>} /> },
  { id: 'datos', label: 'Mis datos', href: '#datos', icon: <Icono d={<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>} /> },
  { id: 'seguridad', label: 'Seguridad', onSelect: () => {}, icon: <Icono d={<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>} /> },
  { id: 'salir', label: 'Cerrar sesión', tone: 'danger', onSelect: () => {}, icon: <Icono d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></>} /> },
];

export const Cuenta: Story = {
  args: { items: conIconos },
  render: (args) => (
    <div className="w-64">
      <SectionNav {...args} />
    </div>
  ),
};

export const Horizontal: Story = {
  args: { items: conIconos },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const SinIconos: Story = {
  args: { items: conIconos.map(({ icon: _icon, ...item }) => item) },
  render: (args) => (
    <div className="w-64">
      <SectionNav {...args} />
    </div>
  ),
};

const byId = (id: string) => conIconos.find((item) => item.id === id)!;

/** Mi cuenta agrupada: títulos desde `md`; en móvil los grupos se separan con una línea. */
export const Agrupada: Story = {
  args: {
    groups: [
      { id: 'compras', label: 'Compras online', items: [{ ...byId('pedidos'), active: false }, byId('favoritos')] },
      {
        id: 'facturacion',
        label: 'Facturación',
        items: [
          { ...byId('facturas'), label: 'Facturas y saldo', active: true },
          { id: 'pagos', label: 'Pagos', href: '#pagos' },
          { id: 'presupuestos', label: 'Presupuestos', href: '#presupuestos' },
          { id: 'avisos', label: 'Avisos', href: '#avisos', badge: 3 },
        ],
      },
      { id: 'perfil', label: 'Mi perfil', items: [byId('datos'), byId('direcciones'), byId('seguridad')] },
    ],
    items: [byId('salir')],
  },
  render: (args) => (
    <div className="w-64">
      <SectionNav {...args} />
    </div>
  ),
};

export const AgrupadaHorizontal: Story = {
  args: Agrupada.args,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
