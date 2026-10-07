import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { RadioGroup, type RadioOption } from './RadioGroup';

const OPCIONES: RadioOption[] = [
  { value: 'casa', label: 'Av. Siempre Viva 742', description: 'Springfield, Buenos Aires' },
  { value: 'oficina', label: 'Calle Falsa 123', description: 'Córdoba, Córdoba' },
  { value: 'local', label: 'Retirar en el local', disabled: true },
];

describe('RadioGroup', () => {
  it('expone un radiogroup nombrado por la leyenda y un radio por opción', () => {
    render(<RadioGroup legend="Dónde recibir" name="entrega" options={OPCIONES} />);
    const grupo = screen.getByRole('radiogroup', { name: 'Dónde recibir' });
    expect(within(grupo).getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByRole('radio', { name: /Av\. Siempre Viva 742/ })).toBeInTheDocument();
  });

  it('comparte el name entre todos los radios', () => {
    render(<RadioGroup legend="x" name="entrega" options={OPCIONES} />);
    for (const r of screen.getAllByRole('radio')) expect(r).toHaveAttribute('name', 'entrega');
  });

  it('vincula la descripción al radio con aria-describedby', () => {
    render(<RadioGroup legend="x" options={OPCIONES} />);
    const radio = screen.getByRole('radio', { name: /Av\. Siempre Viva 742/ });
    expect(radio).toHaveAccessibleDescription('Springfield, Buenos Aires');
  });

  it('marca la opción vigente (controlado) y llama onValueChange al elegir otra', async () => {
    const onValueChange = vi.fn();
    render(<RadioGroup legend="x" options={OPCIONES} value="casa" onValueChange={onValueChange} />);
    expect(screen.getByRole('radio', { name: /Av\. Siempre Viva/ })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: /Calle Falsa/ }));
    expect(onValueChange).toHaveBeenCalledWith('oficina');
    // controlado: sin cambiar la prop, sigue marcada la misma
    expect(screen.getByRole('radio', { name: /Av\. Siempre Viva/ })).toBeChecked();
  });

  it('funciona sin control (defaultValue) y cambia al hacer click en el texto', async () => {
    render(<RadioGroup legend="x" options={OPCIONES} defaultValue="casa" />);
    await userEvent.click(screen.getByText('Calle Falsa 123'));
    expect(screen.getByRole('radio', { name: /Calle Falsa/ })).toBeChecked();
  });

  it('navega con flechas, salta las deshabilitadas y llama onValueChange', async () => {
    function Controlado() {
      const [v, setV] = useState('casa');
      return <RadioGroup legend="x" options={OPCIONES} value={v} onValueChange={setV} />;
    }
    render(<Controlado />);
    screen.getByRole('radio', { name: /Av\. Siempre Viva/ }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: /Calle Falsa/ })).toBeChecked();
    await userEvent.keyboard('{ArrowDown}');
    // la tercera está deshabilitada: vuelve a la primera
    expect(screen.getByRole('radio', { name: /Av\. Siempre Viva/ })).toBeChecked();
  });

  it('no dispara con una opción deshabilitada ni con el grupo deshabilitado', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<RadioGroup legend="x" options={OPCIONES} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: /Retirar en el local/ }));
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(<RadioGroup legend="x" options={OPCIONES} disabled onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText('Calle Falsa 123'));
    expect(onValueChange).not.toHaveBeenCalled();
    for (const r of screen.getAllByRole('radio')) expect(r).toBeDisabled();
  });

  it('muestra el badge de la opción', () => {
    render(
      <RadioGroup
        legend="x"
        options={[{ value: 'a', label: 'Casa', badge: { label: 'Predeterminada', tone: 'success' } }]}
      />,
    );
    expect(screen.getByText('Predeterminada')).toBeInTheDocument();
  });

  it('la acción final es un botón aparte: no cambia la selección y recibe su click', async () => {
    const onEdit = vi.fn();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        legend="x"
        value="casa"
        onValueChange={onValueChange}
        options={[
          { value: 'casa', label: 'Casa' },
          { value: 'oficina', label: 'Oficina', action: { label: 'Editar', ariaLabel: 'Editar Oficina', onClick: onEdit } },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Editar Oficina' }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
    // el nombre accesible del radio no incluye el texto de la acción
    expect(screen.getByRole('radio', { name: 'Oficina' })).toBeInTheDocument();
  });

  it('oculta la leyenda visualmente con hideLegend pero la conserva accesible', () => {
    render(<RadioGroup legend="Dónde recibir" hideLegend options={OPCIONES} />);
    expect(screen.getByText('Dónde recibir')).toHaveClass('sr-only');
    expect(screen.getByRole('radiogroup', { name: 'Dónde recibir' })).toBeInTheDocument();
  });

  it('el radio recibe el foco visible vía ring en la fila', () => {
    render(<RadioGroup legend="x" options={OPCIONES} />);
    const fila = screen.getByRole('radio', { name: /Calle Falsa/ }).closest('[data-slot="radio-row"]');
    expect(fila?.className).toMatch(/focus-visible/);
  });

  it('muestra el contenido sólo de la opción elegida, dentro de su fila', async () => {
    const user = userEvent.setup();
    function Medios() {
      const [v, setV] = useState('credito');
      return (
        <RadioGroup
          legend="Cómo pagar"
          value={v}
          onValueChange={setV}
          options={[
            { value: 'credito', label: 'Tarjeta de crédito', content: <p>Formulario de crédito</p> },
            { value: 'cuenta', label: 'Cuenta', content: <p>Ir a la cuenta</p> },
            { value: 'efectivo', label: 'Efectivo' },
          ]}
        />
      );
    }
    render(<Medios />);
    const fila = screen.getByRole('radio', { name: /crédito/ }).closest('[data-slot="radio-row"]') as HTMLElement;
    expect(within(fila).getByText('Formulario de crédito')).toBeInTheDocument();
    expect(screen.queryByText('Ir a la cuenta')).not.toBeInTheDocument();

    await user.click(screen.getByText('Cuenta'));
    expect(screen.queryByText('Formulario de crédito')).not.toBeInTheDocument();
    expect(screen.getByText('Ir a la cuenta')).toBeInTheDocument();

    await user.click(screen.getByText('Efectivo'));
    expect(document.querySelector('[data-slot="radio-content"]')).toBeNull();
  });
});
