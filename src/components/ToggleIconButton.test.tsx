import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleIconButton } from './ToggleIconButton';

const heart = <svg data-testid="icono" />;

describe('ToggleIconButton', () => {
  it('es un button type="button" con aria-pressed=false y nombre accesible', () => {
    render(<ToggleIconButton pressed={false} aria-label="Guardar en favoritos" icon={heart} />);
    const b = screen.getByRole('button', { name: 'Guardar en favoritos', pressed: false });
    expect(b).toHaveAttribute('type', 'button');
    expect(screen.getByTestId('icono')).toBeInTheDocument();
  });

  it('pressed → aria-pressed="true"', () => {
    render(<ToggleIconButton pressed aria-label="Quitar de favoritos" icon={heart} />);
    expect(screen.getByRole('button', { name: 'Quitar de favoritos', pressed: true })).toHaveAttribute('aria-pressed', 'true');
  });

  it('no presionado es neutro: bg-surface text-muted border-border', () => {
    render(<ToggleIconButton pressed={false} aria-label="Guardar en favoritos" icon={heart} tone="danger" />);
    const c = screen.getByRole('button').className;
    expect(c).toContain('bg-surface');
    expect(c).toContain('text-muted');
    expect(c).toContain('border-border');
    expect(c).not.toContain('text-danger');
  });

  it('tone danger + pressed → text-danger y bg-danger-soft', () => {
    render(<ToggleIconButton pressed tone="danger" aria-label="Quitar de favoritos" icon={heart} />);
    const c = screen.getByRole('button').className;
    expect(c).toContain('text-danger');
    expect(c).toContain('bg-danger-soft');
    expect(c).not.toContain('bg-surface');
  });

  it('tone primary (default) + pressed → text-primary y bg-primary-soft', () => {
    render(<ToggleIconButton pressed aria-label="Destacar" icon={heart} />);
    const c = screen.getByRole('button').className;
    expect(c).toContain('text-primary');
    expect(c).toContain('bg-primary-soft');
  });

  it('click llama onClick antes que onPressedChange(!pressed) y ambos se llaman', async () => {
    const orden: string[] = [];
    const onClick = vi.fn(() => orden.push('click'));
    const onPressedChange = vi.fn(() => orden.push('change'));
    render(
      <ToggleIconButton
        pressed={false}
        aria-label="Guardar en favoritos"
        icon={heart}
        onClick={onClick}
        onPressedChange={onPressedChange}
      />,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(orden).toEqual(['click', 'change']);
  });

  it('onClick con preventDefault no frena el toggle', async () => {
    const onPressedChange = vi.fn();
    render(
      <ToggleIconButton
        pressed
        aria-label="Quitar de favoritos"
        icon={heart}
        onClick={(e) => e.preventDefault()}
        onPressedChange={onPressedChange}
      />,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onPressedChange).toHaveBeenCalledWith(false);
  });

  it('Space y Enter con foco disparan el toggle', async () => {
    const onPressedChange = vi.fn();
    render(<ToggleIconButton pressed={false} aria-label="Guardar en favoritos" icon={heart} onPressedChange={onPressedChange} />);
    await userEvent.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await userEvent.keyboard(' ');
    await userEvent.keyboard('{Enter}');
    expect(onPressedChange).toHaveBeenCalledTimes(2);
  });

  it('loading → disabled + aria-busy y no dispara', async () => {
    const onPressedChange = vi.fn();
    render(<ToggleIconButton pressed={false} loading aria-label="Guardar en favoritos" icon={heart} onPressedChange={onPressedChange} />);
    const b = screen.getByRole('button');
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(b);
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('aria-disabled="true" no llama ni a onClick ni a onPressedChange', async () => {
    const onClick = vi.fn();
    const onPressedChange = vi.fn();
    render(
      <ToggleIconButton
        pressed={false}
        aria-disabled="true"
        aria-label="Guardar en favoritos"
        icon={heart}
        onClick={onClick}
        onPressedChange={onPressedChange}
      />,
    );
    const b = screen.getByRole('button');
    expect(b).not.toBeDisabled();
    await userEvent.click(b);
    expect(onClick).not.toHaveBeenCalled();
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('sin aria-label emite console.warn en desarrollo', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // @ts-expect-error aria-label es obligatorio por tipo; se prueba el aviso en runtime.
    render(<ToggleIconButton pressed={false} icon={heart} />);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('ToggleIconButton');
    warn.mockRestore();
  });

  it('size sm → h-8 w-8; md (default) → h-9 w-9', () => {
    const { rerender } = render(<ToggleIconButton pressed={false} size="sm" aria-label="Guardar" icon={heart} />);
    expect(screen.getByRole('button').className).toContain('h-8 w-8');
    rerender(<ToggleIconButton pressed={false} aria-label="Guardar" icon={heart} />);
    expect(screen.getByRole('button').className).toContain('h-9 w-9');
  });

  it('reenvía ref al button y className va último', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<ToggleIconButton ref={ref} pressed={false} aria-label="Guardar" icon={heart} className="shadow-1" />);
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current?.className).toContain('shadow-1');
  });
});
