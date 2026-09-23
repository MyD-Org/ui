import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renderiza eyebrow, título y acento en itálica', () => {
    render(<Hero eyebrow="Nueva colección 2026" title="La luz que hace" accent="hogar" imageSrc="/hero.jpg" />);
    expect(screen.getByText('Nueva colección 2026')).toBeInTheDocument();
    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo).toHaveTextContent('La luz que hace');
    expect(titulo.querySelector('em')?.textContent).toBe('hogar');
  });

  it('renderiza imagen con alt y CTAs como links', () => {
    render(
      <Hero
        eyebrow="e"
        title="t"
        imageSrc="/hero.jpg"
        imageAlt="Living cálido"
        ctas={[{ label: 'Ver catálogo →', href: '/catalogo' }, { label: 'Línea decorativa', href: '/deco' }]}
        usps={[{ label: 'Envíos a todo el país' }]}
      />,
    );
    expect(screen.getByAltText('Living cálido')).toHaveAttribute('src', '/hero.jpg');
    expect(screen.getByRole('link', { name: 'Ver catálogo →' })).toHaveAttribute('href', '/catalogo');
    expect(screen.getByRole('link', { name: 'Línea decorativa' })).toHaveAttribute('href', '/deco');
    expect(screen.getByText('Envíos a todo el país')).toBeInTheDocument();
  });

  it('un USP con href es un link; si es externo abre en otra pestaña', () => {
    render(
      <Hero
        title="t"
        imageSrc="/h.jpg"
        usps={[{ label: 'Stock en tiempo real' }, { label: 'Asesoramiento por WhatsApp', href: 'https://wa.me/5490000000000' }]}
      />,
    );
    expect(screen.queryByRole('link', { name: 'Stock en tiempo real' })).toBeNull();
    const wsp = screen.getByRole('link', { name: 'Asesoramiento por WhatsApp' });
    expect(wsp).toHaveAttribute('href', 'https://wa.me/5490000000000');
    expect(wsp).toHaveAttribute('target', '_blank');
    expect(wsp).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('cada texto, botón y USP se puede mostrar solo en mobile o solo en desktop', () => {
    render(
      <Hero
        eyebrow="Eyebrow"
        eyebrowVisibleOn="desktop"
        title="Título"
        titleVisibleOn="mobile"
        lead="Bajada"
        imageSrc="/h.jpg"
        ctas={[{ label: 'Ver catálogo', href: '/catalogo', visibleOn: 'mobile' }]}
        usps={[{ label: 'Envíos', visibleOn: 'desktop' }]}
      />,
    );
    expect(screen.getByText('Eyebrow').className).toContain('max-md:hidden');
    expect(screen.getByRole('heading', { level: 1 }).className.split(' ')).toContain('md:hidden');
    expect(screen.getByText('Bajada').closest('p')?.className).not.toMatch(/(^|\s)(max-)?md:hidden/);
    expect(screen.getByRole('link', { name: 'Ver catálogo' }).className.split(' ')).toContain('md:hidden');
    expect(screen.getByText('Envíos').className).toContain('max-md:hidden');
  });

  it('usa el frame editorial redondeado', () => {
    const { container } = render(<Hero eyebrow="e" title="t" imageSrc="/h.jpg" />);
    expect(container.querySelector('section')?.className).toContain('rounded-[28px]');
  });

  it('acepta el acento en el medio del título', () => {
    render(<Hero title="Todo lo que *su proyecto* necesita" imageSrc="/h.jpg" />);
    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo).toHaveTextContent('Todo lo que su proyecto necesita');
    expect(titulo.querySelector('em')?.textContent).toBe('su proyecto');
  });

  it('sin eyebrow no deja la línea decorativa vacía', () => {
    const { container } = render(<Hero title="t" imageSrc="/h.jpg" />);
    expect(container.querySelector('span[class*="before:content"]')).toBeNull();
  });

  it('usa título y bajada de mobile debajo de md', () => {
    render(<Hero title="Largo" titleMobile="Corto" lead="Bajada larga" leadMobile="Bajada corta" imageSrc="/h.jpg" />);
    expect(screen.getByText('Corto').className).toBe('md:hidden');
    expect(screen.getByText('Largo').className).toBe('hidden md:inline');
    expect(screen.getByText('Bajada corta').className).toBe('md:hidden');
  });

  it('sin título no deja un h1 vacío', () => {
    render(<Hero imageSrc="/h.jpg" lead="Solo bajada" />);
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('el velo de contraste va pegado a la columna de texto', () => {
    render(<Hero title="t" imageSrc="/x.jpg" />);
    const columna = screen.getByRole('heading').parentElement;
    expect(columna?.className).toContain('before:-right-24');
    expect(columna?.className).toContain('self-stretch');
  });

  it('con media, pinta el fondo propio en lugar de la foto', () => {
    const { container } = render(
      <Hero title="t" imageSrc="/h.jpg" media={<div data-testid="escena" />} />,
    );
    expect(screen.getByTestId('escena')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
  });
});
