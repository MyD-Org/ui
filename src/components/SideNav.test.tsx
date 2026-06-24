import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SideNav } from './SideNav';

const items = [
  { href: '/inbox', label: 'Inbox', active: true },
  { href: '/usuarios', label: 'Usuarios' },
];

describe('SideNav', () => {
  it('renders nav items', () => {
    render(<SideNav items={items} />);
    expect(screen.getByText('Inbox')).toBeDefined();
    expect(screen.getByText('Usuarios')).toBeDefined();
  });

  it('renders logo slot', () => {
    render(<SideNav items={items} logo={<span>Logo</span>} />);
    expect(screen.getByText('Logo')).toBeDefined();
  });

  it('applies active class to active item', () => {
    render(<SideNav items={items} />);
    const activeItem = screen.getByText('Inbox').closest('span');
    expect(activeItem?.className).toContain('text-primary');
  });

  it('renders user name and subtitle', () => {
    render(<SideNav items={items} user={{ name: 'Dalila', subtitle: 'Superadmin' }} />);
    expect(screen.getByText('Dalila')).toBeDefined();
    expect(screen.getByText('Superadmin')).toBeDefined();
  });

  it('calls onLogout when logout button is clicked', async () => {
    const onLogout = vi.fn();
    render(<SideNav items={items} user={{ name: 'Dalila', onLogout }} />);
    await userEvent.click(screen.getByText('Salir'));
    expect(onLogout).toHaveBeenCalledOnce();
  });

  it('uses custom logoutLabel', () => {
    render(<SideNav items={items} user={{ name: 'Dalila', onLogout: vi.fn(), logoutLabel: 'Cerrar sesión' }} />);
    expect(screen.getByText('Cerrar sesión')).toBeDefined();
  });

  it('uses renderLink when provided', () => {
    const renderLink = vi.fn((href, children) => <a href={href} data-custom>{children}</a>);
    render(<SideNav items={items} renderLink={renderLink} />);
    expect(renderLink).toHaveBeenCalledTimes(2);
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('data-custom');
  });

  it('renders children as main content', () => {
    render(<SideNav items={items}><div>Contenido</div></SideNav>);
    expect(screen.getByText('Contenido')).toBeDefined();
  });
});
