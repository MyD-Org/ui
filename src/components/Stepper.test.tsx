import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Stepper, type StepItem } from './Stepper';

const retiro: StepItem[] = [
  { label: 'Pedido recibido', state: 'done' },
  { label: 'Pago confirmado', state: 'done' },
  { label: 'Preparando', state: 'current' },
  { label: 'Retirado', state: 'pending' },
];

describe('Stepper', () => {
  it('es un <ol> con el nombre por defecto "Seguimiento del pedido"', () => {
    render(<Stepper steps={retiro} />);
    const list = screen.getByRole('list', { name: 'Seguimiento del pedido' });
    expect(list.tagName).toBe('OL');
  });

  it('ariaLabel sobreescribe el nombre', () => {
    render(<Stepper steps={retiro} ariaLabel="Seguimiento del pedido PED-1" />);
    expect(screen.getByRole('list', { name: 'Seguimiento del pedido PED-1' })).toBeInTheDocument();
  });

  it('un listitem por paso y exactamente uno con aria-current="step"', () => {
    render(<Stepper steps={retiro} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(4);
    const actuales = items.filter((li) => li.getAttribute('aria-current') === 'step');
    expect(actuales).toHaveLength(1);
    expect(actuales[0]).toHaveTextContent('Preparando');
  });

  it('el estado de cada paso se anuncia con texto oculto', () => {
    render(<Stepper steps={retiro} />);
    const [recibido, , preparando, retirado] = screen.getAllByRole('listitem');
    expect(recibido).toHaveTextContent('Pedido recibido, completado');
    expect(preparando).toHaveTextContent('Preparando, en curso');
    expect(retirado).toHaveTextContent('Retirado, pendiente');
    expect(within(recibido).getByText(', completado')).toHaveClass('sr-only');
  });

  it('stateLabels reemplaza los textos ocultos', () => {
    render(<Stepper steps={retiro} stateLabels={{ done: 'listo', current: 'ahora' }} />);
    const [recibido, , preparando, retirado] = screen.getAllByRole('listitem');
    expect(recibido).toHaveTextContent('Pedido recibido, listo');
    expect(preparando).toHaveTextContent('Preparando, ahora');
    expect(retirado).toHaveTextContent('Retirado, pendiente');
  });

  it('los pasos done llevan tilde (svg aria-hidden) y tono success; current en primary; pending en muted', () => {
    render(<Stepper steps={retiro} />);
    const [recibido, , preparando, retirado] = screen.getAllByRole('listitem');
    expect(recibido.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(preparando.querySelector('svg')).toBeNull();
    expect(within(recibido).getByText('Pedido recibido').className).toContain('text-success');
    expect(within(preparando).getByText('Preparando').className).toContain('text-primary');
    expect(within(retirado).getByText('Retirado').className).toContain('text-muted');
  });

  it('el punto y los conectores quedan ocultos para lectores de pantalla', () => {
    render(<Stepper steps={retiro} />);
    for (const li of screen.getAllByRole('listitem')) {
      const marcador = li.firstElementChild as HTMLElement;
      expect(marcador).toHaveAttribute('aria-hidden', 'true');
      expect(marcador.querySelectorAll('[data-connector]').length).toBe(2);
    }
  });

  it('conector hacia un paso done en success; el resto en border', () => {
    render(<Stepper steps={retiro} />);
    const [recibido, pago, preparando] = screen.getAllByRole('listitem');
    const der = (li: HTMLElement) => li.querySelectorAll('[data-connector]')[1] as HTMLElement;
    expect(der(recibido).className).toContain('bg-success');
    expect(der(pago).className).toContain('bg-success');
    expect(der(preparando).className).toContain('bg-border');
  });

  it('cinco pasos done → ningún aria-current', () => {
    const envio: StepItem[] = ['Pedido recibido', 'Pago confirmado', 'Preparando', 'En camino', 'Entregado'].map((label) => ({
      label,
      state: 'done',
    }));
    render(<Stepper steps={envio} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items.some((li) => li.hasAttribute('aria-current'))).toBe(false);
  });

  it('size sm usa text-xs; md (default) text-sm', () => {
    const { rerender } = render(<Stepper steps={retiro} size="sm" />);
    expect(screen.getByText('Preparando').className).toContain('text-xs');
    rerender(<Stepper steps={retiro} />);
    expect(screen.getByText('Preparando').className).toContain('text-sm');
  });

  it('orientation vertical → data-orientation en el <ol> y columna', () => {
    const { rerender } = render(<Stepper steps={retiro} orientation="vertical" />);
    const ol = screen.getByRole('list');
    expect(ol).toHaveAttribute('data-orientation', 'vertical');
    expect(ol.className).toContain('flex-col');
    rerender(<Stepper steps={retiro} />);
    expect(screen.getByRole('list')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('className del consumidor va en el <ol>', () => {
    render(<Stepper steps={retiro} className="mt-4" />);
    expect(screen.getByRole('list').className).toContain('mt-4');
  });
});
