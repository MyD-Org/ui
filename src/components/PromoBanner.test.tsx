import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PromoBanner } from './PromoBanner';

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
});
