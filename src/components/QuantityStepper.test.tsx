import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuantityStepper } from './QuantityStepper';

describe('QuantityStepper', () => {
  it('renders the current value', () => {
    render(<QuantityStepper value={3} onValueChange={() => {}} />);
    expect(screen.getByDisplayValue('3')).toBeDefined();
  });

  it('increments on + click', async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={1} onValueChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Aumentar cantidad'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('decrements on − click', async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={5} onValueChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Disminuir cantidad'));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('disables decrement at min', () => {
    render(<QuantityStepper value={1} min={1} onValueChange={() => {}} />);
    expect(screen.getByLabelText('Disminuir cantidad')).toBeDisabled();
  });

  it('disables increment at max', () => {
    render(<QuantityStepper value={10} max={10} onValueChange={() => {}} />);
    expect(screen.getByLabelText('Aumentar cantidad')).toBeDisabled();
  });
});
