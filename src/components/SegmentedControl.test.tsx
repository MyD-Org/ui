import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'grilla', label: 'Grilla' },
  { value: 'lista', label: 'Lista' },
  { value: 'mapa', label: 'Mapa' },
];

describe('SegmentedControl', () => {
  afterEach(() => vi.restoreAllMocks());

  it('es un radiogroup con nombre y un radio por opción con aria-checked', () => {
    render(<SegmentedControl ariaLabel="Vista" options={options} value="grilla" onValueChange={() => {}} />);
    expect(screen.getByRole('radiogroup', { name: 'Vista' })).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(screen.getByRole('radio', { name: 'Grilla' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Lista' })).toHaveAttribute('aria-checked', 'false');
  });

  it('sólo el seleccionado tiene tabIndex 0 (roving tabindex)', () => {
    render(<SegmentedControl options={options} value="lista" onValueChange={() => {}} />);
    expect(screen.getByRole('radio', { name: 'Grilla' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'Lista' })).toHaveAttribute('tabindex', '0');
  });

  it('click → onValueChange(value)', async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl options={options} value="grilla" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Lista' }));
    expect(onValueChange).toHaveBeenCalledWith('lista');
  });

  it('ArrowRight/ArrowLeft/Home/End mueven la selección y el foco', async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl options={options} value="grilla" onValueChange={onValueChange} />);
    screen.getByRole('radio', { name: 'Grilla' }).focus();
    await userEvent.keyboard('[ArrowRight]');
    expect(onValueChange).toHaveBeenLastCalledWith('lista');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Lista' }));
    await userEvent.keyboard('[End]');
    expect(onValueChange).toHaveBeenLastCalledWith('mapa');
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Mapa' }));
    await userEvent.keyboard('[Home]');
    expect(onValueChange).toHaveBeenLastCalledWith('grilla');
    await userEvent.keyboard('[ArrowLeft]');
    expect(onValueChange).toHaveBeenLastCalledWith('mapa');
  });

  it('las flechas saltean opciones disabled', async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        options={[options[0], { ...options[1], disabled: true }, options[2]]}
        value="grilla"
        onValueChange={onValueChange}
      />,
    );
    screen.getByRole('radio', { name: 'Grilla' }).focus();
    await userEvent.keyboard('[ArrowRight]');
    expect(onValueChange).toHaveBeenLastCalledWith('mapa');
    expect(screen.getByRole('radio', { name: 'Lista' })).toBeDisabled();
  });

  it('opción sólo con icon usa ariaLabel como nombre', () => {
    render(
      <SegmentedControl
        ariaLabel="Vista"
        options={[
          { value: 'grilla', icon: <svg data-testid="i" />, ariaLabel: 'Vista en grilla' },
          { value: 'lista', icon: <svg />, ariaLabel: 'Vista en lista' },
        ]}
        value="grilla"
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Vista en grilla' })).toBeInTheDocument();
  });

  it('opción con icon y sin label ni ariaLabel emite console.warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<SegmentedControl options={[{ value: 'a', icon: <svg /> }, { value: 'b', label: 'B' }]} value="a" onValueChange={() => {}} />);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('a');
  });

  it('size sm aplica h-8; md h-9; seleccionado con bg-primary-soft text-primary', () => {
    const { rerender } = render(<SegmentedControl options={options} value="grilla" onValueChange={() => {}} size="sm" />);
    const sel = screen.getByRole('radio', { name: 'Grilla' });
    expect(sel.className).toContain('h-8');
    expect(sel.className).toContain('bg-primary-soft');
    expect(sel.className).toContain('text-primary');
    rerender(<SegmentedControl options={options} value="grilla" onValueChange={() => {}} />);
    expect(screen.getByRole('radio', { name: 'Grilla' }).className).toContain('h-9');
  });
});
