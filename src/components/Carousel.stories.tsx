import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel } from './Carousel';
import { ProductCard } from './ProductCard';

const productos = [
  { name: 'Panel LED 60×60 40W', brand: 'Macroled', price: 33234 },
  { name: 'Spot embutido 7W', brand: 'Genrod', price: 7049 },
  { name: 'Guirnalda 10 m', brand: 'Exultt', price: 15373 },
  { name: 'Tira LED 5 m 12V', brand: 'Macroled', price: 12203 },
  { name: 'Velador de mesa', brand: 'Jadever', price: 18990 },
  { name: 'Colgante rattan', brand: 'Exultt', price: 42100 },
];

const meta: Meta<typeof Carousel> = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: { layout: 'padded' },
  render: (args) => (
    <Carousel {...args}>
      {productos.map((p) => (
        <ProductCard
          key={p.name}
          variant="editorial"
          className="h-full"
          brand={p.brand}
          name={p.name}
          price={p.price}
          stock="in"
        />
      ))}
    </Carousel>
  ),
  args: { label: 'Los más vendidos' },
};
export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {};

/** Con `perView={3}` entran tres desde lg en vez de cuatro. */
export const TresPorVista: Story = { args: { perView: 3 } };
