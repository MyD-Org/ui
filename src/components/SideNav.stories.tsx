import type { Meta, StoryObj } from '@storybook/react';
import { SideNav } from './SideNav';

const meta: Meta<typeof SideNav> = {
  title: 'Components/SideNav',
  component: SideNav,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof SideNav>;

const items = [
  { href: '/inbox', label: 'Inbox', active: true },
  { href: '/usuarios', label: 'Usuarios' },
];

export const Default: Story = {
  args: {
    items,
    user: { name: 'Dalila', subtitle: 'Superadmin', onLogout: () => alert('logout') },
    children: <div style={{ padding: 24 }}>Contenido principal</div>,
  },
};

export const WithLogo: Story = {
  args: {
    logo: <div style={{ fontWeight: 700, fontSize: 14 }}>Central LED</div>,
    items,
    user: { name: 'Dalila', subtitle: 'Operador', onLogout: () => alert('logout') },
    children: <div style={{ padding: 24 }}>Contenido principal</div>,
  },
};

export const NoUser: Story = {
  args: {
    logo: <div style={{ fontWeight: 700, fontSize: 14 }}>Central LED</div>,
    items,
    children: <div style={{ padding: 24 }}>Sin usuario en footer</div>,
  },
};
