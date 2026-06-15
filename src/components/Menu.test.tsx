import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menu } from './Menu';

const items = [
  { value: 'inbox', label: 'Inbox' },
  { value: 'sent', label: 'Enviados' },
  { value: 'spam', label: 'Spam', disabled: true },
];

describe('Menu', () => {
  it('renderiza un item por elemento', () => {
    render(<Menu items={items} ariaLabel="nav" />);
    expect(screen.getByRole('button', { name: 'Inbox' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviados' })).toBeInTheDocument();
  });

  it('marca el item activo con aria-current=page', () => {
    render(<Menu items={items} value="sent" ariaLabel="nav" />);
    expect(screen.getByRole('button', { name: 'Enviados' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Inbox' })).not.toHaveAttribute('aria-current');
  });

  it('dispara onValueChange al clickear', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Menu items={items} onValueChange={onValueChange} ariaLabel="nav" />);
    await user.click(screen.getByRole('button', { name: 'Inbox' }));
    expect(onValueChange).toHaveBeenCalledWith('inbox');
  });

  it('respeta disabled', () => {
    render(<Menu items={items} ariaLabel="nav" />);
    expect(screen.getByRole('button', { name: 'Spam' })).toBeDisabled();
  });
});
