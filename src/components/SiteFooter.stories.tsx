import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteFooter } from './SiteFooter';

const meta: Meta<typeof SiteFooter> = {
  title: 'Components/SiteFooter',
  component: SiteFooter,
  args: {
    brandName: 'Central',
    brandAccent: 'Led',
    description: 'Materiales eléctricos e iluminación en Puerto Iguazú, Misiones. Venta mayorista y minorista con amor por la luz.',
    columns: [
      { title: 'Rubros', links: [{ label: 'Iluminación LED', href: '#' }, { label: 'Línea decorativa', href: '#' }, { label: 'Electricidad', href: '#' }] },
      { title: 'Mi cuenta', links: [{ label: 'Mis pedidos', href: '#' }, { label: 'Facturas', href: '#'}] },
      { title: 'Contacto', links: [{ label: 'WhatsApp', href: '#' }, { label: 'Ubicación', href: '#' }] },
    ],
    barLeft: '© 2026 Central Led — Puerto Iguazú, Misiones',
    barRight: 'Hecho con luz en Misiones',
  },
};
export default meta;
type Story = StoryObj<typeof SiteFooter>;

export const Default: Story = {};
