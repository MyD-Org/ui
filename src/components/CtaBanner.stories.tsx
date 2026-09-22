import type { Meta, StoryObj } from '@storybook/react-vite';
import { CtaBanner } from './CtaBanner';

const meta: Meta<typeof CtaBanner> = {
  title: 'Components/CtaBanner',
  component: CtaBanner,
  args: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: '¿Necesitás asesoramiento técnico?',
    text: 'Escribinos por WhatsApp y te ayudamos a elegir el producto correcto.',
    cta: { label: 'Consultar ahora', href: 'https://wa.me/5492235903025' },
  },
};
export default meta;
type Story = StoryObj<typeof CtaBanner>;

export const Default: Story = {};
