import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { hrefFor: (n: number) => `/catalogo?pagina=${n}` },
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Intermedia: Story = { args: { page: 5, totalPages: 492 } };
export const Inicio: Story = { args: { page: 1, totalPages: 492 } };
export const CercaDelInicio: Story = { args: { page: 2, totalPages: 492 } };
export const Final: Story = { args: { page: 492, totalPages: 492 } };
export const PocasPaginas: Story = { args: { page: 2, totalPages: 3 } };

export const ConBotones: Story = {
  render: () => {
    const [page, setPage] = useState(3);
    return <Pagination page={page} totalPages={20} onPageChange={setPage} labels={{ ariaLabel: 'Paginación del catálogo' }} />;
  },
};
