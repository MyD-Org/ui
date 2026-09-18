import type { Meta, StoryObj } from '@storybook/react-vite';
import { ServiceCard } from './ServiceCard';

const meta: Meta<typeof ServiceCard> = {
  title: 'Components/ServiceCard',
  component: ServiceCard,
  args: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="17.5" r="1.6" />
        <circle cx="17" cy="17.5" r="1.6" />
      </svg>
    ),
    title: 'Envío gratis',
    text: 'En compras desde $100.000 a todo el país.',
  },
};
export default meta;
type Story = StoryObj<typeof ServiceCard>;

export const Default: Story = {};
