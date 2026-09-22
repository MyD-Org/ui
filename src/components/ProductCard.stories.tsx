import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ProductCard, ProductCardSkeleton, type ProductCardLayout } from './ProductCard';
import { ToggleIconButton } from './ToggleIconButton';
import { Badge } from './Badge';
import { Button } from './Button';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
};
export default meta;
type Story = StoryObj<typeof ProductCard>;

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const agregar = (
  <Button size="icon-lg" shape="round" aria-label="Agregar al carrito">
    <PlusIcon />
  </Button>
);

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

export const Editorial: Story = {
  args: {
    variant: 'editorial',
    brand: 'Macroled',
    name: 'Lámpara LED filamento vintage 8W E27 luz cálida',
    code: 'ML-2210',
    stock: 'in',
    price: 2667,
    installments: '6 cuotas de $ 445',
    badge: <span className="rounded-full bg-surface px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-widest text-accent-strong">Más vendido</span>,
  },
};

/** La card del catálogo: código, stock con cantidad, cuotas, "+" redondo y la card entera enlaza a la ficha. */
export const ConCodigoYStock: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-2 gap-5 md:grid-cols-3">
      <ProductCard
        variant="editorial"
        brand="Genrod"
        name="Lámpara LED A60 9W E27 fría"
        code="02141N"
        stock="in"
        price={538.01}
        installments="3 cuotas sin interés de $214,65"
        href="/producto/1"
        badge={<Badge tone="info">NUEVO</Badge>}
        image={<div className="text-4xl">💡</div>}
        action={agregar}
      />
      <ProductCard
        variant="editorial"
        brand="Exultt"
        name="Termomagnética 2P 20A curva C"
        code="0302302"
        stock="low"
        stockLabel="¡Últimas 3!"
        price={528.07}
        installments="3 cuotas sin interés de $210,68"
        href="/producto/2"
        image={<div className="text-4xl">🔌</div>}
        action={agregar}
      />
      <ProductCard
        variant="editorial"
        brand="Chint"
        name="Contactor trifásico 32A 220V"
        code="NXC-32"
        stock="in"
        price={8975.5}
        oldPrice={9972}
        discount="-10%"
        installments="3 cuotas sin interés de $3.578,00"
        href="/producto/3"
        image={<div className="text-4xl">⚙️</div>}
        action={agregar}
      />
    </div>
  ),
};

export const Lista: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-3">
      <ProductCard
        variant="editorial"
        layout="list"
        brand="Genrod"
        name="Lámpara LED A60 9W E27 fría"
        code="02141N"
        stock="in"
        price={538.01}
        installments="3 cuotas sin interés de $214,65"
        href="/producto/1"
        image={<div className="text-4xl">💡</div>}
        action={agregar}
      />
      <ProductCard
        variant="editorial"
        layout="list"
        brand="Jadever"
        name="Pinza amperimétrica digital 600A con pantalla retroiluminada y funda"
        code="JD-600"
        stock="low"
        stockLabel="¡Últimas 2!"
        price={12450}
        installments="3 cuotas sin interés de $4.150,00"
        href="/producto/2"
        image={<div className="text-4xl">🧰</div>}
        action={agregar}
      />
    </div>
  ),
};

function Favorito() {
  const [pressed, setPressed] = useState(false);
  return (
    <ToggleIconButton
      pressed={pressed}
      onPressedChange={setPressed}
      tone="danger"
      size="sm"
      aria-label={pressed ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill={pressed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      }
    />
  );
}

function CardConFavorito({ layout }: { layout: ProductCardLayout }) {
  return (
    <ProductCard
      variant="editorial"
      layout={layout}
      brand="Genrod"
      name="Lámpara LED A60 9W E27 fría"
      code="02141N"
      price={538.01}
      href="#producto-1"
      badge={<Badge tone="info">Nuevo</Badge>}
      image={<div className="text-4xl">💡</div>}
      cornerAction={<Favorito />}
      action={agregar}
    />
  );
}

/** El corazón queda sobre la imagen: un clic en él no navega; en el resto de la card sí. */
export const ConFavorito: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        <CardConFavorito layout="grid" />
        <CardConFavorito layout="grid" />
      </div>
      <CardConFavorito layout="list" />
    </div>
  ),
};

export const Skeleton: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-6">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        <ProductCardSkeleton variant="editorial" />
        <ProductCardSkeleton variant="editorial" />
        <ProductCardSkeleton variant="editorial" />
      </div>
      <ProductCardSkeleton variant="editorial" layout="list" />
    </div>
  ),
};
