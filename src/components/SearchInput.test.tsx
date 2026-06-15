import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renderiza placeholder por defecto', () => {
    render(<SearchInput value="" onValueChange={() => {}} />);
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('refleja value en el input', () => {
    render(<SearchInput value="abc" onValueChange={() => {}} />);
    expect(screen.getByDisplayValue('abc')).toBeInTheDocument();
  });

  it('dispara onValueChange al tipear', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SearchInput value="" onValueChange={onValueChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(onValueChange).toHaveBeenCalledWith('a');
  });

  it('muestra el botón clear solo cuando hay value', () => {
    const { rerender } = render(<SearchInput value="" onValueChange={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).not.toBeInTheDocument();
    rerender(<SearchInput value="abc" onValueChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Limpiar búsqueda' })).toBeInTheDocument();
  });

  it('clear llama onValueChange("") y onClear', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onClear = vi.fn();
    render(<SearchInput value="abc" onValueChange={onValueChange} onClear={onClear} />);
    await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }));
    expect(onValueChange).toHaveBeenCalledWith('');
    expect(onClear).toHaveBeenCalled();
  });
});
