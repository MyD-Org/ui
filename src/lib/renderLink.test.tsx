import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { defaultRenderLink } from './renderLink';

describe('defaultRenderLink', () => {
  it('renderiza un <a> real con href, className y aria-current', () => {
    render(<>{defaultRenderLink({ href: '/x', className: 'c', children: 'X', 'aria-current': 'page' })}</>);
    const link = screen.getByRole('link', { name: 'X' });
    expect(link).toHaveAttribute('href', '/x');
    expect(link).toHaveClass('c');
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('propaga aria-label', () => {
    render(<>{defaultRenderLink({ href: '/y', children: '›', 'aria-label': 'Página siguiente' })}</>);
    expect(screen.getByRole('link', { name: 'Página siguiente' })).toHaveAttribute('href', '/y');
  });
});
