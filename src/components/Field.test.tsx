import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Field } from './Field';
import { Input } from './Input';

describe('Field', () => {
  it('asocia el label con el input', () => {
    render(
      <Field label="Email">
        <Input placeholder="email" />
      </Field>,
    );
    const input = screen.getByPlaceholderText('email');
    const label = screen.getByText('Email');
    expect(input.id).toBeTruthy();
    expect(label).toHaveAttribute('for', input.id);
  });
  it('muestra el error y marca el input inválido', () => {
    render(
      <Field label="Email" error="Requerido">
        <Input />
      </Field>,
    );
    expect(screen.getByText('Requerido')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});
