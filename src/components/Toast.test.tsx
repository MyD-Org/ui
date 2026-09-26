import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';

function Demo() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Listo', description: 'Guardado' })}>
      Tostar
    </button>
  );
}

describe('Toast', () => {
  it('useToast falla si no está dentro del provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Demo />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });

  it('renderiza un toast al disparar toast()', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Tostar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Listo');
    expect(screen.getByText('Guardado')).toBeInTheDocument();
  });

  it('cierra el toast al clickear el botón Cerrar (espera la salida animada)', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider defaultDurationMs={0}>
        <Demo />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Tostar' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    // No sale de una: primero pasa a data-state="closed" (dispara el fade+slide
    // de salida) y recién después de esa animación se lo saca del DOM.
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'closed');
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });

  it('con reduced motion cierra al toque, sin esperar', async () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true });
    vi.stubGlobal('matchMedia', matchMedia);
    const user = userEvent.setup();
    render(
      <ToastProvider defaultDurationMs={0}>
        <Demo />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Tostar' }));
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
