import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renderiza y acepta tipeo multilínea', async () => {
    render(<Textarea placeholder="personalidad" />);
    const el = screen.getByPlaceholderText('personalidad');
    await userEvent.type(el, 'sos un asistente');
    expect(el).toHaveValue('sos un asistente');
  });
});
