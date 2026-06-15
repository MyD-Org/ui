import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from './Dialog';

describe('Dialog', () => {
  it('no renderiza contenido cuando open=false', () => {
    render(<Dialog open={false} onOpenChange={() => {}} title="Detalle" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renderiza title y description cuando open=true', () => {
    render(
      <Dialog open onOpenChange={() => {}} title="Detalle" description="Más info">
        <p>cuerpo</p>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Detalle')).toBeInTheDocument();
    expect(screen.getByText('Más info')).toBeInTheDocument();
    expect(screen.getByText('cuerpo')).toBeInTheDocument();
  });

  it('llama onOpenChange(false) al clickear el botón Cerrar', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Dialog open onOpenChange={onOpenChange} title="Detalle" />);
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renderiza el footer cuando se pasa', () => {
    render(<Dialog open onOpenChange={() => {}} title="Detalle" footer={<button>Aceptar</button>} />);
    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeInTheDocument();
  });
});
