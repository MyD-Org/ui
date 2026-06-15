import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownMenu, type DropdownMenuEntry } from './DropdownMenu';

describe('DropdownMenu', () => {
  it('no muestra items mientras está cerrado', () => {
    render(
      <DropdownMenu items={[{ label: 'Perfil' }] as DropdownMenuEntry[]}>
        <button>Abrir</button>
      </DropdownMenu>,
    );
    expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
  });

  it('abre y muestra los items al clickear el trigger', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu items={[{ label: 'Perfil' }, { label: 'Salir' }] as DropdownMenuEntry[]}>
        <button>Abrir</button>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Salir')).toBeInTheDocument();
  });

  it('dispara onSelect al elegir un item', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu items={[{ label: 'Perfil', onSelect }] as DropdownMenuEntry[]}>
        <button>Abrir</button>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole('button', { name: 'Abrir' }));
    await user.click(screen.getByText('Perfil'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('renderiza separators y labels', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu
        items={[
          { type: 'label', label: 'Acciones' },
          { label: 'Editar' },
          { type: 'separator' },
          { label: 'Borrar', tone: 'danger' },
        ] as DropdownMenuEntry[]}
        defaultOpen
      >
        <button>Abrir</button>
      </DropdownMenu>,
    );
    expect(screen.getByText('Acciones')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
    expect(screen.getByText('Borrar')).toBeInTheDocument();
    // user not strictly needed but kept to avoid unused var
    void user;
  });
});
