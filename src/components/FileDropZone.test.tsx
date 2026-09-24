import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileDropZone } from './FileDropZone';
import { Field } from './Field';

const fileInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

describe('FileDropZone', () => {
  it('muestra el texto por defecto en usted', () => {
    render(<FileDropZone file={null} onChange={() => {}} />);
    const zone = screen.getByRole('button');
    expect(zone).toHaveTextContent('Arrastre su archivo aquí');
    expect(zone).toHaveTextContent('o selecciónelo desde su equipo');
  });

  it('acepta textos propios (title, selectPrefix, selectLabel)', () => {
    render(
      <FileDropZone
        file={null}
        onChange={() => {}}
        title="Suelte el comprobante"
        selectPrefix="y si no,"
        selectLabel="búsquelo en su dispositivo"
      />,
    );
    const zone = screen.getByRole('button');
    expect(zone).toHaveTextContent('Suelte el comprobante');
    expect(zone).toHaveTextContent('y si no, búsquelo en su dispositivo');
  });

  it('con archivo muestra su nombre en lugar de las instrucciones', () => {
    const file = new File(['x'], 'recibo.pdf', { type: 'application/pdf' });
    render(<FileDropZone file={file} onChange={() => {}} />);
    const zone = screen.getByRole('button');
    expect(zone).toHaveTextContent('recibo.pdf');
    expect(zone).not.toHaveTextContent('Arrastre su archivo aquí');
  });

  it('es enfocable y el hint lo describe', () => {
    render(<FileDropZone file={null} onChange={() => {}} hint="PDF o imagen, hasta 10 MB" />);
    const zone = screen.getByRole('button');
    expect(zone).toHaveAttribute('tabindex', '0');
    expect(zone).toHaveAccessibleDescription('PDF o imagen, hasta 10 MB');
  });

  it('el nombre accesible no repite el hint', () => {
    render(<FileDropZone file={null} onChange={() => {}} hint="PDF o imagen, hasta 10 MB" />);
    expect(screen.getByRole('button')).toHaveAccessibleName(
      'Arrastre su archivo aquí o selecciónelo desde su equipo',
    );
  });

  it('sin hint no apunta aria-describedby a nada', () => {
    render(<FileDropZone file={null} onChange={() => {}} />);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
  });

  it.each(['{Enter}', ' '])('abre el selector con el teclado (%s)', async (key) => {
    const { container } = render(<FileDropZone file={null} onChange={() => {}} />);
    const click = vi.spyOn(fileInput(container), 'click');
    screen.getByRole('button').focus();
    await userEvent.keyboard(key);
    expect(click).toHaveBeenCalledOnce();
  });

  it('abre el selector con un clic, una sola vez', async () => {
    const { container } = render(<FileDropZone file={null} onChange={() => {}} />);
    const click = vi.spyOn(fileInput(container), 'click');
    await userEvent.click(screen.getByRole('button'));
    expect(click).toHaveBeenCalledOnce();
  });

  it('el input no queda en el orden de tabulación', () => {
    const { container } = render(<FileDropZone file={null} onChange={() => {}} />);
    expect(fileInput(container)).toHaveAttribute('tabindex', '-1');
  });

  it('elegir un archivo llama a onChange', async () => {
    const onChange = vi.fn();
    const { container } = render(<FileDropZone file={null} onChange={onChange} />);
    const file = new File(['x'], 'recibo.pdf', { type: 'application/pdf' });
    await userEvent.upload(fileInput(container), file);
    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('soltar un archivo llama a onChange', () => {
    const onChange = vi.fn();
    render(<FileDropZone file={null} onChange={onChange} />);
    const file = new File(['x'], 'recibo.pdf', { type: 'application/pdf' });
    fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [file] } });
    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('dentro de Field recibe id, aria-invalid y el error se suma a la descripción', () => {
    render(
      <Field label="Comprobante" error="Adjunte el comprobante">
        <FileDropZone file={null} onChange={() => {}} hint="PDF, hasta 20 MB" />
      </Field>,
    );
    const zone = screen.getByRole('button');
    expect(zone).toHaveAttribute('id');
    expect(zone).toHaveAttribute('aria-invalid', 'true');
    expect(zone).toHaveAccessibleDescription('Adjunte el comprobante PDF, hasta 20 MB');
  });
});
