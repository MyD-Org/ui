import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renderiza y acepta tipeo', async () => {
    render(<Input placeholder="email" />);
    const el = screen.getByPlaceholderText('email');
    await userEvent.type(el, 'hola');
    expect(el).toHaveValue('hola');
  });
  it('forwardea el atributo type', () => {
    render(<Input type="email" placeholder="email" />);
    expect(screen.getByPlaceholderText('email')).toHaveAttribute('type', 'email');
  });
});
