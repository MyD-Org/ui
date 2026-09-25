import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PromoBanner } from './PromoBanner';
import type { RenderLink } from '../lib/renderLink';
import type { RenderImage } from '../lib/renderImage';

const imagen: RenderImage = ({ src, alt, className, sizes, fit, priority }) => (
  <img src={src} alt={alt} className={className} data-framework-img data-sizes={sizes} data-fit={fit} data-priority={priority ? 'si' : 'no'} />
);

const enlace: RenderLink = ({ children, ...p }) => <a {...p} data-framework>{children}</a>;

describe('PromoBanner', () => {
  it('renderiza eyebrow, título con acento y CTA claro', () => {
    render(
      <PromoBanner
        eyebrow="Línea decorativa · Nuevo"
        title="Ambientá tus noches con"
        accent="luz cálida"
        lead="Guirnaldas, neones, veladores y colgantes."
        cta={{ label: 'Descubrir la línea →', href: '/deco' }}
        imageSrc="/deco.jpg"
      />,
    );
    expect(screen.getByText('Línea decorativa · Nuevo')).toBeInTheDocument();
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2.querySelector('em')?.textContent).toBe('luz cálida');
    const cta = screen.getByRole('link', { name: 'Descubrir la línea →' });
    expect(cta).toHaveAttribute('href', '/deco');
    expect(cta.className).toContain('bg-surface');
  });

  it('el banner es redondeado y lleva overlay oscuro', () => {
    const { container } = render(<PromoBanner eyebrow="e" title="t" imageSrc="/d.jpg" />);
    const section = container.querySelector('section');
    expect(section?.className).toContain('rounded-[28px]');
    expect(section?.querySelector('img')?.className).toContain('object-cover');
  });

  it('acepta el acento en cualquier posición y eyebrow opcional', () => {
    render(<PromoBanner title="*Luz cálida* para sus noches" imageSrc="/d.jpg" />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2.querySelector('em')?.textContent).toBe('Luz cálida');
    expect(h2).toHaveTextContent('Luz cálida para sus noches');
  });

  it('el velo de contraste va pegado a la columna de texto', () => {
    render(<PromoBanner title="t" imageSrc="/x.jpg" />);
    const columna = screen.getByRole('heading').parentElement;
    expect(columna?.className).toContain('before:-right-24');
    expect(columna?.className).toContain('self-stretch');
  });

  it('eyebrow, título, bajada y botón se pueden mostrar solo en un tamaño', () => {
    render(
      <PromoBanner
        eyebrow="Eyebrow"
        eyebrowVisibleOn="mobile"
        title="Título"
        titleVisibleOn="desktop"
        lead="Bajada"
        leadVisibleOn="mobile"
        cta={{ label: 'Ver', href: '/deco', visibleOn: 'desktop' }}
        imageSrc="/b.jpg"
      />,
    );
    expect(screen.getByText('Eyebrow').className.split(' ')).toContain('md:hidden');
    expect(screen.getByRole('heading', { level: 2 }).className.split(' ')).toContain('max-md:hidden');
    expect(screen.getByText('Bajada').closest('p')?.className.split(' ')).toContain('md:hidden');
    expect(screen.getByRole('link', { name: 'Ver' }).className.split(' ')).toContain('max-md:hidden');
  });

  it('renderLink reemplaza el <a> del CTA', () => {
    render(<PromoBanner cta={{ label: 'Ver', href: '/x' }} imageSrc="/i.jpg" renderLink={enlace} />);
    expect(screen.getByRole('link', { name: 'Ver' })).toHaveAttribute('data-framework');
  });


  it('sin renderImage la foto es un <img> lazy y async con las clases de siempre', () => {
    render(<PromoBanner title="t" imageSrc="/p.jpg" imageAlt="Patio" />);
    const img = screen.getByAltText('Patio');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img.className).toBe('absolute inset-0 -z-20 h-full w-full object-cover');
  });

  it('renderImage recibe src, alt, className, sizes 100vw, fit cover y sin priority', () => {
    const { container } = render(<PromoBanner title="t" imageSrc="/p.jpg" imageAlt="Patio" renderImage={imagen} />);
    const img = screen.getByAltText('Patio');
    expect(img).toHaveAttribute('data-framework-img');
    expect(img).toHaveAttribute('src', '/p.jpg');
    expect(img.className).toBe('absolute inset-0 -z-20 h-full w-full object-cover');
    expect(img).toHaveAttribute('data-sizes', '100vw');
    expect(img).toHaveAttribute('data-fit', 'cover');
    expect(img).toHaveAttribute('data-priority', 'no');
    expect(img.parentElement).toBe(container.querySelector('section'));
  });

  it('imageSizes pisa el sizes por defecto', () => {
    render(<PromoBanner title="t" imageSrc="/p.jpg" imageAlt="P" imageSizes="50vw" renderImage={imagen} />);
    expect(screen.getByAltText('P')).toHaveAttribute('data-sizes', '50vw');
  });
});
