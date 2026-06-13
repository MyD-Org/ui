import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('expone role checkbox con aria-checked false por defecto', () => {
    render(<Checkbox aria-label="Seleccionar" />);
    const el = screen.getByRole('checkbox', { name: 'Seleccionar' });
    expect(el).toHaveAttribute('aria-checked', 'false');
  });
  it('refleja aria-checked true cuando checked', () => {
    render(<Checkbox checked aria-label="x" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });
  it('refleja aria-checked mixed cuando indeterminate', () => {
    render(<Checkbox indeterminate aria-label="x" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });
  it('llama onCheckedChange con el valor invertido al click', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox checked={false} onCheckedChange={onCheckedChange} aria-label="x" />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
  it('no dispara cuando disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={onCheckedChange} aria-label="x" />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
