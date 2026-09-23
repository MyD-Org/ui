import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CtaBanner } from './CtaBanner';

describe('CtaBanner', () => {
  it('renderiza título, texto y el link del CTA', () => {
    render(
      <CtaBanner
        icon={<svg data-testid="ic" />}
        title="¿Necesitás asesoramiento técnico?"
        text="Escribinos por WhatsApp y te ayudamos a elegir el producto correcto."
        cta={{ label: 'Consultar ahora', href: 'https://wa.me/5492235903025' }}
      />,
    );
    expect(screen.getByText('¿Necesitás asesoramiento técnico?')).toBeInTheDocument();
    expect(screen.getByText('Escribinos por WhatsApp y te ayudamos a elegir el producto correcto.')).toBeInTheDocument();
    expect(screen.getByTestId('ic')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Consultar ahora' });
    expect(link).toHaveAttribute('href', 'https://wa.me/5492235903025');
  });

  it('usa la superficie primary de banner editorial', () => {
    render(
      <CtaBanner
        icon={null}
        title="Título"
        text="Texto"
        cta={{ label: 'Ir', href: '/contacto' }}
      />,
    );
    const section = screen.getByText('Título').closest('section');
    expect(section?.className).toContain('bg-primary');
    expect(section?.className).toContain('rounded-[28px]');
  });

  it('sin título ni texto no deja párrafos vacíos', () => {
    const { container } = render(<CtaBanner icon={null} cta={{ label: 'Consultar', href: '/c' }} />);
    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});
