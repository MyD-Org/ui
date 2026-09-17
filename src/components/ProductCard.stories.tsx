import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductCard } from './ProductCard';
import { Badge } from './Badge';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
};
export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    brand: 'Macroled',
    name: 'Panel LED 48W 60×60 embutir',
    price: 14990,
    oldPrice: 17900,
    discount: '-16%',
    stock: 'in',
    badge: <Badge tone="danger">OFERTA</Badge>,
    image: <div className="text-4xl">💡</div>,
    action: (
      <button className="w-full rounded-sm bg-primary py-2 text-sm font-medium text-on-primary">
        Agregar al carrito
      </button>
    ),
  },
};

export const OutOfStock: Story = {
  args: {
    brand: 'Philips',
    name: 'Lámpara LED 12W E27 fría',
    price: 3200,
    stock: 'out',
  },
};

export const ConCuotasYNota: Story = {
  args: {
    brand: 'Macroled',
    name: 'Reflector LED 200W IP65',
    price: 713028.8,
    stock: 'in',
    image: <div className="text-4xl">💡</div>,
    priceNote: <>PRECIO SIN IMPUESTOS NACIONALES $589.280,00</>,
    installments: (
      <>
        <span className="font-medium text-text">Hasta 3 cuotas de $237.676,27</span>{' '}
        <span className="text-[11px]">Valor de referencia</span>
      </>
    ),
    action: (
      <button className="rounded-sm bg-primary px-3 py-2 text-sm font-medium text-on-primary">
        Agregar
      </button>
    ),
  },
};

export const LowStock: Story = {
  args: {
    brand: 'Osram',
    name: 'Dicroica LED GU10 7W',
    price: 5600,
    stock: 'low',
    badge: <Badge tone="warning">ÚLTIMO</Badge>,
  },
};
