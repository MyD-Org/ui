import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';
import { Input } from './Input';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  render: (args) => (
    <Field {...args}>
      <Input placeholder="Soporte" />
    </Field>
  ),
};
export default meta;
type Story = StoryObj<typeof Field>;

export const WithLabel: Story = { args: { label: 'Nombre' } };
export const WithHint: Story = { args: { label: 'Email', hint: 'Te mandamos un código' } };
export const WithError: Story = { args: { label: 'Email', error: 'Requerido' } };
