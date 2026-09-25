import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileDropZone } from './FileDropZone';

const getInput = (container: HTMLElement) => container.querySelector('input[type="file"]') as HTMLInputElement;

describe('FileDropZone', () => {
  it('muestra los textos por defecto en español formal', () => {
    render(<FileDropZone file={null} onChange={() => {}} />);
    const zone = screen.getByRole('button');
    expect(zone).toHaveAccessibleName('Arrastre su archivo aquí o selecciónelo desde su equipo');
    expect(screen.queryByText(/Arrastrá|seleccioná|tu computadora/)).toBeNull();
  });

  it('acepta textos propios', () => {
    render(
      <FileDropZone
        file={null}
        onChange={() => {}}
        title="Adjunte el comprobante"
        orLabel="o bien"
        browseLabel="búsquelo en su dispositivo"
      />,
    );
    expect(screen.getByRole('button')).toHaveAccessibleName('Adjunte el comprobante o bien búsquelo en su dispositivo');
  });

  it('omite el conector con orLabel vacío', () => {
    render(<FileDropZone file={null} onChange={() => {}} orLabel="" browseLabel="Seleccione un archivo" />);
    expect(screen.getByText('Seleccione un archivo').parentElement).toHaveTextContent(/^Seleccione un archivo$/);
  });

  it('con archivo muestra su nombre como nombre accesible', () => {
    const file = new File(['x'], 'comprobante.pdf', { type: 'application/pdf' });
    render(<FileDropZone file={file} onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveAccessibleName('comprobante.pdf');
  });

  it('es enfocable y abre el selector con Enter y con Espacio', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileDropZone file={null} onChange={() => {}} />);
    const click = vi.spyOn(getInput(container), 'click');
    await user.tab();
    const zone = screen.getByRole('button');
    expect(zone).toHaveFocus();
    expect(zone).toHaveClass('focus-visible:ring-2', 'focus-visible:ring-ring');
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
    await user.keyboard(' ');
    expect(click).toHaveBeenCalledTimes(2);
  });

  it('abre el selector con click', async () => {
    const { container } = render(<FileDropZone file={null} onChange={() => {}} />);
    const click = vi.spyOn(getInput(container), 'click');
    await userEvent.click(screen.getByRole('button'));
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('asocia hint y error con aria-describedby', () => {
    render(<FileDropZone file={null} onChange={() => {}} hint="PDF o imagen, hasta 5 MB" error="El archivo supera 5 MB." />);
    const zone = screen.getByRole('button');
    expect(zone).toHaveAccessibleDescription('PDF o imagen, hasta 5 MB El archivo supera 5 MB.');
    expect(zone).toHaveAttribute('aria-invalid', 'true');
    expect(zone).toHaveClass('border-danger');
  });

  it('sin hint ni error no pone aria-describedby', () => {
    render(<FileDropZone file={null} onChange={() => {}} />);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
  });

  it('entrega el archivo elegido y el soltado', () => {
    const onChange = vi.fn();
    const { container } = render(<FileDropZone file={null} onChange={onChange} />);
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    fireEvent.change(getInput(container), { target: { files: [file] } });
    expect(onChange).toHaveBeenLastCalledWith(file);
    const other = new File(['y'], 'b.png', { type: 'image/png' });
    fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [other] } });
    expect(onChange).toHaveBeenLastCalledWith(other);
  });

  it('deshabilitada no es enfocable ni abre el selector', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<FileDropZone file={null} onChange={onChange} disabled />);
    const click = vi.spyOn(getInput(container), 'click');
    const zone = screen.getByRole('button');
    expect(zone).toHaveAttribute('aria-disabled', 'true');
    expect(zone).toHaveAttribute('tabindex', '-1');
    await user.click(zone);
    fireEvent.keyDown(zone, { key: 'Enter' });
    fireEvent.drop(zone, { dataTransfer: { files: [new File(['x'], 'a.png')] } });
    expect(click).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('size="sm": una fila compacta con el ícono al costado', () => {
    render(<FileDropZone file={null} onChange={() => {}} size="sm" />);
    const zona = screen.getByRole('button');
    expect(zona.className).toContain('py-2.5');
    expect(zona.className).not.toContain('py-8');
  });
});
