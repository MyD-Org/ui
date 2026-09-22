import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RangeSlider } from './RangeSlider';

describe('RangeSlider', () => {
  it('expone dos sliders con las etiquetas por defecto Mínimo / Máximo y aria-valuemin/max/now', () => {
    render(<RangeSlider min={0} max={1000} value={[100, 900]} />);
    const lo = screen.getByRole('slider', { name: 'Mínimo' });
    const hi = screen.getByRole('slider', { name: 'Máximo' });
    expect(lo).toHaveAttribute('aria-valuemin', '0');
    expect(lo).toHaveAttribute('aria-valuemax', '1000');
    expect(lo).toHaveAttribute('aria-valuenow', '100');
    expect(hi).toHaveAttribute('aria-valuenow', '900');
  });

  it('thumbLabels sobreescribe las etiquetas de los pulgares', () => {
    render(<RangeSlider min={0} max={10} value={[1, 9]} thumbLabels={['Precio mínimo', 'Precio máximo']} />);
    expect(screen.getByRole('slider', { name: 'Precio mínimo' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Precio máximo' })).toBeInTheDocument();
  });

  it('ArrowRight en el primer pulgar → onValueChange([lo+step, hi]) y onValueCommit al terminar', async () => {
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    render(
      <RangeSlider min={0} max={1000} step={10} value={[100, 900]} onValueChange={onValueChange} onValueCommit={onValueCommit} />,
    );
    screen.getByRole('slider', { name: 'Mínimo' }).focus();
    await userEvent.keyboard('[ArrowRight]');
    expect(onValueChange).toHaveBeenCalledWith([110, 900]);
    expect(onValueCommit).toHaveBeenCalledWith([110, 900]);
  });

  it('PageUp avanza 10 pasos; Home y End van a los extremos', async () => {
    const onValueChange = vi.fn();
    render(<RangeSlider min={0} max={1000} step={1} value={[100, 900]} onValueChange={onValueChange} />);
    const lo = screen.getByRole('slider', { name: 'Mínimo' });
    lo.focus();
    await userEvent.keyboard('[PageUp]');
    expect(onValueChange).toHaveBeenLastCalledWith([110, 900]);
    await userEvent.keyboard('[Home]');
    expect(onValueChange).toHaveBeenLastCalledWith([0, 900]);
    screen.getByRole('slider', { name: 'Máximo' }).focus();
    await userEvent.keyboard('[End]');
    expect(onValueChange).toHaveBeenLastCalledWith([100, 1000]);
  });

  it('los pulgares no se cruzan (minStepsBetweenThumbs=1)', async () => {
    const onValueChange = vi.fn();
    render(<RangeSlider min={0} max={1000} value={[500, 501]} onValueChange={onValueChange} />);
    screen.getByRole('slider', { name: 'Mínimo' }).focus();
    await userEvent.keyboard('[ArrowRight]');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('formatValue alimenta aria-valuetext y los valores visibles', () => {
    render(<RangeSlider min={0} max={100000} value={[500, 50000]} formatValue={(n) => '$' + n} />);
    expect(screen.getByRole('slider', { name: 'Mínimo' })).toHaveAttribute('aria-valuetext', '$500');
    expect(screen.getByRole('slider', { name: 'Máximo' })).toHaveAttribute('aria-valuetext', '$50000');
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('$50000')).toBeInTheDocument();
  });

  it('showValues={false} no imprime los valores', () => {
    render(<RangeSlider min={0} max={100} value={[5, 95]} showValues={false} />);
    expect(screen.queryByText('5')).toBeNull();
    expect(screen.queryByText('95')).toBeNull();
  });

  it('disabled no llama a onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<RangeSlider min={0} max={100} value={[5, 95]} disabled onValueChange={onValueChange} />);
    screen.getByRole('slider', { name: 'Mínimo' }).focus();
    await userEvent.keyboard('[ArrowRight]');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('usa clases de tokens para track, rango y pulgar', () => {
    const { container } = render(<RangeSlider min={0} max={100} value={[5, 95]} />);
    expect(container.querySelector('.bg-elevated')).not.toBeNull();
    expect(container.querySelector('.bg-primary')).not.toBeNull();
    expect(screen.getByRole('slider', { name: 'Mínimo' }).className).toContain('border-primary');
  });
});
