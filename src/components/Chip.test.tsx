import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders a toggle chip with aria-selected false by default', () => {
    render(<Chip>Fría 6500K</Chip>);
    const el = screen.getByRole('option', { name: 'Fría 6500K' });
    expect(el.getAttribute('aria-selected')).toBe('false');
    expect(el.className).toContain('border-border-strong');
  });

  it('applies selected styles when selected', () => {
    render(<Chip selected>Fría 6500K</Chip>);
    const el = screen.getByRole('option', { name: 'Fría 6500K' });
    expect(el.getAttribute('aria-selected')).toBe('true');
    expect(el.className).toContain('bg-primary');
  });

  it('renders a removable chip with remove button', async () => {
    const onRemove = vi.fn();
    render(<Chip variant="removable" onRemove={onRemove}>Iluminación LED</Chip>);
    expect(screen.getByText('Iluminación LED')).toBeDefined();
    const removeBtn = screen.getByLabelText('Quitar');
    await userEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledOnce();
  });
});
