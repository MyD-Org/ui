import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectionBar } from './SelectionBar';

describe('SelectionBar', () => {
  it('no renderiza nada sin selección y sin emptyHint', () => {
    const { container } = render(<SelectionBar count={0} />);
    expect(container).toBeEmptyDOMElement();
  });
  it('muestra el conteo (plural) y el summary, y dispara onClear', async () => {
    const onClear = vi.fn();
    render(<SelectionBar count={3} onClear={onClear} summary="Total: $100" />);
    expect(screen.getByText('3 seleccionados')).toBeInTheDocument();
    expect(screen.getByText('Total: $100')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar selección' }));
    expect(onClear).toHaveBeenCalled();
  });
  it('usa singular con count 1', () => {
    render(<SelectionBar count={1} />);
    expect(screen.getByText('1 seleccionado')).toBeInTheDocument();
  });
  it('muestra emptyHint cuando count es 0', () => {
    render(<SelectionBar count={0} emptyHint="Seleccioná filas" />);
    expect(screen.getByText('Seleccioná filas')).toBeInTheDocument();
  });
  it('renderiza acciones (children) cuando hay selección', () => {
    render(<SelectionBar count={2}><button>Descargar</button></SelectionBar>);
    expect(screen.getByRole('button', { name: 'Descargar' })).toBeInTheDocument();
  });
});
