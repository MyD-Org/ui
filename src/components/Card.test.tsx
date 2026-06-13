import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renderiza children sobre una superficie', () => {
    render(<Card>contenido</Card>);
    const el = screen.getByText('contenido');
    expect(el.className).toContain('bg-surface');
  });
});
