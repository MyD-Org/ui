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
  it('respeta el id propio del child', () => {
    render(
      <Field label="Nombre">
        <Input id="custom-id" placeholder="nombre" />
      </Field>,
    );
    expect(screen.getByPlaceholderText('nombre')).toHaveAttribute('id', 'custom-id');
    expect(screen.getByText('Nombre')).toHaveAttribute('for', 'custom-id');
  });
  it('muestra el hint cuando no hay error', () => {
    render(
      <Field label="Email" hint="Te mandamos un código">
        <Input />
      </Field>,
    );
    expect(screen.getByText('Te mandamos un código')).toBeInTheDocument();
  });
});
