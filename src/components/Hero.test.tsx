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
});
