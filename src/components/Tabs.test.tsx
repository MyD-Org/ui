import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

const items = [
  { value: 'a', label: 'Tab A' },
  { value: 'b', label: 'Tab B' },
  { value: 'c', label: 'Tab C', disabled: true },
];

describe('Tabs', () => {
  it('renderiza un tab por item', () => {
    render(<Tabs items={items} ariaLabel="demo" />);
    expect(screen.getByRole('tab', { name: 'Tab A' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab B' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab C' })).toBeInTheDocument();
  });

  it('selecciona el primero por defecto si no se pasa defaultValue', () => {
    render(<Tabs items={items} ariaLabel="demo" />);
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true');
  });

  it('respeta defaultValue', () => {
    render(<Tabs items={items} defaultValue="b" ariaLabel="demo" />);
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true');
  });

  it('dispara onValueChange al clickear otro tab', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Tabs items={items} onValueChange={onValueChange} ariaLabel="demo" />);
    await user.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('los items disabled no son clickeables', () => {
    render(<Tabs items={items} ariaLabel="demo" />);
    expect(screen.getByRole('tab', { name: 'Tab C' })).toBeDisabled();
  });
});
