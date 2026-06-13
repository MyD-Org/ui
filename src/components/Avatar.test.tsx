import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('muestra iniciales cuando no hay src', () => {
    render(<Avatar name="Central Led" />);
    expect(screen.getByText('CL')).toBeInTheDocument();
  });
  it('muestra la imagen con alt = name cuando hay src', () => {
    render(<Avatar name="Soporte" src="https://x/a.png" />);
    expect(screen.getByRole('img', { name: 'Soporte' })).toHaveAttribute('src', 'https://x/a.png');
  });
  it('etiqueta el fallback de iniciales con el nombre y toma 2 chars de una palabra', () => {
    render(<Avatar name="Soporte" />);
    const el = screen.getByLabelText('Soporte');
    expect(el).toHaveTextContent('SO');
  });
});
