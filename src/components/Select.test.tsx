import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Select } from './Select';

const options = [
  { label: 'Sonnet', value: 'claude-sonnet-4-6' },
  { label: 'Haiku', value: 'claude-haiku-4-5' },
];

describe('Select', () => {
  it('renderiza las opciones provistas', () => {
    render(<Select options={options} defaultValue="claude-haiku-4-5" aria-label="modelo" />);
    expect(screen.getByRole('option', { name: 'Sonnet' })).toBeInTheDocument();
    expect((screen.getByLabelText('modelo') as HTMLSelectElement).value).toBe('claude-haiku-4-5');
  });
});
