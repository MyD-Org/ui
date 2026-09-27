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

/** Varias fotos: se desliza con el dedo; desde md, flechas al pasar el mouse. */
export const ConVariasFotos: Story = {
  args: {
    brand: 'Macroled',
    name: 'Panel LED 48W 60×60 embutir',
    price: 14990,
    href: '#',
    images: ['💡', '🔦', '🕯️'].map((e) => (
      <div key={e} className="text-5xl">
        {e}
      </div>
    )),
    action: agregar,
  },
  decorators: [(S) => <div style={{ width: 260 }}><S /></div>],
};

const fotoSoft = (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" style={{ color: 'var(--color-muted)' }}>
    <path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

/** `variant="soft"`: sin borde, foto en tile neutro, centavos chicos, stock junto al precio y "Agregar" a lo ancho. */
export const Soft: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 24, maxWidth: 1180 }}>
      <ProductCard variant="soft" href="#" brand="Macroled" name="AR111 11W GU10 SMD DIM AC100-240V FP>0.9 calido 2700K 24º" code="AR111-DIM-FC-11W-24DWW-MCL" price={15373.2} showStock={false} image={fotoSoft}
        installments="6 cuotas sin interés de $ 2.562,20" action={<Button variant="soft" className="w-full">Agregar</Button>} />
      <ProductCard variant="soft" href="#" brand="Macroled" name="AR111 10W GU10 SMD no DIM AC100-240V FP>0.9 neutro 4000K" code="AR111-FC-10W-24DNW-MCL" price={12203.77} stock="low" stockLabel="Quedan 3" image={fotoSoft}
        installments="6 cuotas sin interés de $ 2.033,96" action={<Button variant="soft" className="w-full">Agregar</Button>} />
      <ProductCard variant="soft" href="#" brand="Macroled" name="Amplificador RGB" code="AMP-RGB-12A-MCL" price={16395.11} showStock={false} image={fotoSoft}
        action={<Button variant="soft" className="w-full">Agregar</Button>} />
      <ProductCard variant="soft" href="#" brand="Akai" name="Akai 1200" price={7049.75} showStock={false} image={fotoSoft}
        action={<Button variant="soft" className="w-full">Agregar</Button>} />
    </div>
  ),
};

/** `variant="soft" layout="list"`: la foto se estira al alto de la fila; desde md, datos · precio · acción en columnas. */
export const SoftLista: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 960 }}>
      <ProductCard variant="soft" layout="list" href="#" brand="Macroled" name="AR111 10W GU10 SMD no DIM AC100-240V FP>0.9 neutro 4000K" code="AR111-FC-10W-24DNW-MCL" price={12203.77} stock="low" stockLabel="Quedan 3" image={fotoSoft}
        installments="6 cuotas sin interés de $ 2.033,96" action={<Button variant="soft" className="w-full">Agregar</Button>} />
      <ProductCard variant="soft" layout="list" href="#" brand="Akai" name="Akai 1200" price={7049.75} showStock={false} image={fotoSoft}
        action={<Button variant="soft" className="w-full">Agregar</Button>} />
    </div>
  ),
};
