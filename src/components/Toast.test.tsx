import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('cierra el toast al clickear el botón Cerrar', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider defaultDurationMs={0}>
        <Demo />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Tostar' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
