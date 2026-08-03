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

// Íconos inline para la story de rail (evita depender de una lib externa).
function InboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const iconItems = [
  { href: '/inbox', label: 'Inbox', active: true, icon: <InboxIcon /> },
  { href: '/usuarios', label: 'Usuarios', icon: <UsersIcon /> },
];

/**
 * Rail: al colapsar, el sidebar queda angosto al costado mostrando solo los íconos.
 * El botón para expandir vive dentro del propio rail.
 */
export const CollapsibleRail: Story = {
  args: {
    logo: <div style={{ fontWeight: 700, fontSize: 14 }}>Central LED</div>,
    items: iconItems,
    user: { name: 'Dalila', subtitle: 'Superadmin', onLogout: () => alert('logout') },
    collapsedMode: 'rail',
    defaultCollapsed: true,
    children: <div style={{ padding: 24 }}>Contenido — rail colapsado por default</div>,
  },
};
