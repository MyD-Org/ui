import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { defaultRenderImage } from './renderImage';

describe('defaultRenderImage', () => {
  it('renderiza un <img> lazy y async con src, alt y className, sin sizes', () => {
    render(<>{defaultRenderImage({ src: '/a.jpg', alt: 'Living', className: 'c', sizes: '100vw', fit: 'cover' })}</>);
    const img = screen.getByAltText('Living');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/a.jpg');
    expect(img).toHaveClass('c');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    // Sin srcset el sizes no aporta nada; tampoco se filtran fit/priority al DOM.
    expect(img).not.toHaveAttribute('sizes');
    expect(img).not.toHaveAttribute('fit');
    expect(img).not.toHaveAttribute('fetchpriority');
  });

  it('con priority carga eager', () => {
    render(<>{defaultRenderImage({ src: '/b.jpg', alt: 'Hero', sizes: '100vw', fit: 'cover', priority: true })}</>);
    expect(screen.getByAltText('Hero')).toHaveAttribute('loading', 'eager');
  });

  it('propaga los atributos data-*', () => {
    const { container } = render(
      <>{defaultRenderImage({ src: '/l.png', alt: '', sizes: '150px', fit: 'logo', 'data-logo': 'Acme' })}</>,
    );
    expect(container.querySelector('img')).toHaveAttribute('data-logo', 'Acme');
  });
});
