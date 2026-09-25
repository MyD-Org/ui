import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
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

  it('placement="sheet" ancla el contenido abajo a todo el ancho', () => {
    render(<Dialog open onOpenChange={() => {}} title="Filtros" placement="sheet" />);
    const content = screen.getByRole('dialog');
    expect(content).toHaveAttribute('data-placement', 'sheet');
    for (const c of ['inset-x-0', 'bottom-0', 'w-full', 'max-w-none', 'rounded-t-lg', 'rounded-b-none', 'max-h-[92dvh]']) {
      expect(content.className).toContain(c);
    }
    expect(content.className).not.toContain('-translate-x-1/2');
  });

  it('sin placement se comporta como hoy: centrado y con size', () => {
    render(<Dialog open onOpenChange={() => {}} title="Detalle" size="lg" />);
    const content = screen.getByRole('dialog');
    expect(content).toHaveAttribute('data-placement', 'center');
    expect(content.className).toContain('max-w-3xl');
    expect(content.className).toContain('-translate-x-1/2');
  });

  it('en sheet, size no aplica max-w-*', () => {
    render(<Dialog open onOpenChange={() => {}} title="Filtros" placement="sheet" size="sm" />);
    expect(screen.getByRole('dialog').className).not.toContain('max-w-sm');
  });

  it('el footer del sheet respeta el safe-area inferior y queda fuera del área desplazable', () => {
    render(
      <Dialog open onOpenChange={() => {}} title="Filtros" placement="sheet" footer={<button>Ver 24 productos</button>}>
        <p>cuerpo</p>
      </Dialog>,
    );
    const footer = screen.getByRole('button', { name: 'Ver 24 productos' }).parentElement as HTMLElement;
    expect(footer.className).toContain('pb-[max(0.75rem,env(safe-area-inset-bottom))]');
    expect(screen.getByText('cuerpo').parentElement?.contains(footer)).toBe(false);
  });

  it('Escape cierra y el foco vuelve al disparador', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Filtros</button>
          <Dialog open={open} onOpenChange={setOpen} title="Filtros" placement="sheet" />
        </>
      );
    }
    render(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Filtros' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('[Escape]');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
  describe('placement="sheet": arrastrar para cerrar', () => {
    // Un gesto con el dedo: arranca en `desde`, baja `px` en 10 pasos y suelta.
    function arrastrar(desde: Element, px: number) {
      const t = (y: number) => {
        const toque = { clientX: 100, clientY: y };
        return { touches: [toque], changedTouches: [toque] };
      };
      fireEvent.touchStart(desde, t(100));
      for (let i = 1; i <= 10; i++) fireEvent.touchMove(desde, t(100 + (px * i) / 10));
      fireEvent.touchEnd(desde, { touches: [], changedTouches: [{ clientX: 100, clientY: 100 + px }] });
    }

    it('lleva una manija arriba; centrado o con dragToClose={false}, no', () => {
      const { rerender } = render(<Dialog open onOpenChange={() => {}} title="Filtros" placement="sheet" />);
      expect(screen.getByRole('dialog').querySelector('[data-sheet-handle]')).not.toBeNull();
      rerender(<Dialog open onOpenChange={() => {}} title="Filtros" placement="sheet" dragToClose={false} />);
      expect(screen.getByRole('dialog').querySelector('[data-sheet-handle]')).toBeNull();
      rerender(<Dialog open onOpenChange={() => {}} title="Filtros" />);
      expect(screen.getByRole('dialog').querySelector('[data-sheet-handle]')).toBeNull();
    });

    it('bajarla desde el encabezado la cierra', async () => {
      const onOpenChange = vi.fn();
      render(<Dialog open onOpenChange={onOpenChange} title="Filtros" placement="sheet"><p>cuerpo</p></Dialog>);
      arrastrar(screen.getByText('Filtros'), 300);
      await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    });

    it('un arrastre corto y lento vuelve a su lugar sin cerrar', async () => {
      const onOpenChange = vi.fn();
      render(<Dialog open onOpenChange={onOpenChange} title="Filtros" placement="sheet" />);
      const t = (y: number) => {
        const toque = { clientX: 100, clientY: y };
        return { touches: [toque], changedTouches: [toque] };
      };
      const titulo = screen.getByText('Filtros');
      fireEvent.touchStart(titulo, { ...t(100), timeStamp: 0 });
      fireEvent.touchMove(titulo, { ...t(110), timeStamp: 100 });
      fireEvent.touchMove(titulo, { ...t(120), timeStamp: 200 });
      fireEvent.touchEnd(titulo, { touches: [], changedTouches: [{ clientX: 100, clientY: 120 }] });
      await new Promise((r) => setTimeout(r, 300));
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('sobre un control touch-none (slider) el dedo no mueve la hoja', async () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog open onOpenChange={onOpenChange} title="Filtros" placement="sheet">
          <div className="touch-none">slider</div>
        </Dialog>,
      );
      arrastrar(screen.getByText('slider'), 300);
      await new Promise((r) => setTimeout(r, 300));
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('con dragToClose={false} arrastrar no cierra', async () => {
      const onOpenChange = vi.fn();
      render(<Dialog open onOpenChange={onOpenChange} title="Filtros" placement="sheet" dragToClose={false} />);
      arrastrar(screen.getByText('Filtros'), 300);
      await new Promise((r) => setTimeout(r, 300));
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });
});
