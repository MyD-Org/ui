import type { Meta, StoryObj } from '@storybook/react-vite';
import { PromoTag } from './PromoTag';

const meta: Meta<typeof PromoTag> = {
  title: 'Components/PromoTag',
  component: PromoTag,
  args: { eyebrow: 'Hasta', value: '6', title: 'cuotas sin interés', text: 'Con tarjeta de crédito.' },
};
export default meta;
type Story = StoryObj<typeof PromoTag>;

export const Cuotas: Story = {};

export const SimboloDecorativo: Story = {
  args: { eyebrow: undefined, value: '%', decorativeValue: true, title: 'Grandes descuentos', text: 'Pagando con transferencia.' },
};

export const LadoALado: Story = {
  render: () => (
    <ul className="grid max-w-3xl grid-cols-2 gap-2.5 sm:gap-4">
      <li>
        <PromoTag eyebrow="Hasta" value="6" title="cuotas sin interés" text="Con tarjeta de crédito." />
      </li>
      <li>
        <PromoTag value="%" decorativeValue title="Grandes descuentos" text="Pagando con transferencia." />
      </li>
    </ul>
  ),
};
