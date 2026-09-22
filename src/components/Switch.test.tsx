import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

describe('Switch', () => {
  it('expone role switch con el label como nombre accesible', () => {
    render(<Switch label="Solo con stock" />);
    expect(screen.getByRole('switch', { name: 'Solo con stock' })).toHaveAttribute('aria-checked', 'false');
  });

  it('refleja aria-checked desde la prop (controlado): sin onCheckedChange el click no lo cambia', async () => {
    render(<Switch checked label="x" />);
    const el = screen.getByRole('switch');
    expect(el).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(el);
    expect(el).toHaveAttribute('aria-checked', 'true');
  });

  it('click → onCheckedChange(true) exactamente una vez', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} label="x" />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledOnce();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('Space y Enter con foco alternan', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} label="x" />);
    screen.getByRole('switch').focus();
    await userEvent.keyboard('[Space]');
    await userEvent.keyboard('[Enter]');
    expect(onCheckedChange).toHaveBeenCalledTimes(2);
    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true);
  });

  it('disabled: tiene el atributo y no llama', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch disabled onCheckedChange={onCheckedChange} label="x" />);
    const el = screen.getByRole('switch');
    expect(el).toBeDisabled();
    await userEvent.click(el);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('click en el texto del label alterna', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} label="Solo con stock" />);
    await userEvent.click(screen.getByText('Solo con stock'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('sin label usa aria-label como nombre', () => {
    render(<Switch aria-label="Modo oscuro" />);
    expect(screen.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
  });

  it('size sm aplica h-4 w-7 al track; md usa h-5 w-9', () => {
    const { rerender } = render(<Switch aria-label="x" size="sm" />);
    expect(screen.getByRole('switch').className).toContain('h-4 w-7');
    rerender(<Switch aria-label="x" />);
    expect(screen.getByRole('switch').className).toContain('h-5 w-9');
  });

  it('estado activo usa bg-primary; inactivo bg-border-strong', () => {
    const { rerender } = render(<Switch aria-label="x" checked />);
    expect(screen.getByRole('switch').className).toContain('bg-primary');
    rerender(<Switch aria-label="x" checked={false} />);
    expect(screen.getByRole('switch').className).toContain('bg-border-strong');
  });
});
