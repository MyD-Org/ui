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

/** Columna Legales con un enlace a otro sitio (pestaña nueva) y el QR de Data Fiscal en la barra. */
export const ConLegales: Story = {
  args: {
    columns: [
      { title: 'Mi cuenta', links: [{ label: 'Mis pedidos', href: '#' }, { label: 'Facturas', href: '#' }] },
      { title: 'Contacto', links: [{ label: 'WhatsApp', href: '#' }, { label: 'Ubicación', href: '#' }] },
      {
        title: 'Legales',
        links: [
          { label: 'Términos y condiciones', href: '#' },
          { label: 'Política de privacidad', href: '#' },
          { label: 'Envíos y pagos', href: '#' },
          { label: 'Defensa del Consumidor', href: 'https://defensa.example/formulario', external: true },
        ],
      },
    ],
    barExtra: (
      <a href="https://qr.afip.gob.ar/?qr=EJEMPLO" target="_blank" rel="noopener noreferrer">
        <img
          alt="Data Fiscal"
          width={40}
          height={54}
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='54'%3E%3Crect width='40' height='54' fill='%23fff'/%3E%3C/svg%3E"
        />
      </a>
    ),
  },
};
