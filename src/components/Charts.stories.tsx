import type { Meta, StoryObj } from '@storybook/react-vite';
import { KpiCard } from './KpiCard';
import { LineChart } from './LineChart';
import { AreaChart } from './AreaChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { DonutChart } from './DonutChart';
import { Card } from './Card';

const meta: Meta = { title: 'Charts/Overview' };
export default meta;

const ventasPorMes = [
  { mes: 'Ene', ventas: 125000, costos: 78000 },
  { mes: 'Feb', ventas: 148000, costos: 91000 },
  { mes: 'Mar', ventas: 132500, costos: 80500 },
  { mes: 'Abr', ventas: 171200, costos: 97300 },
  { mes: 'May', ventas: 158900, costos: 92100 },
  { mes: 'Jun', ventas: 190400, costos: 104800 },
];

const presupuestosPorEstado = [
  { estado: 'aceptado', total: 14 },
  { estado: 'enviado', total: 9 },
  { estado: 'borrador', total: 5 },
  { estado: 'rechazado', total: 3 },
];

export const Kpi: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 220px)', gap: 12 }}>
      <KpiCard label="Ventas del mes" value={190400} prefix="$" hint="junio 2026" />
      <KpiCard label="Presupuestos aceptados" value={14} tone="success" unit="de 31" />
      <KpiCard label="Stock crítico" value={7} tone="danger" unit="ítems" hint="bajo mínimo" />
    </div>
  ),
};

export const Linea: StoryObj = {
  render: () => <LineChart data={ventasPorMes} xKey="mes" series={['ventas', 'costos']} width={560} height={280} />,
};

export const Area: StoryObj = {
  render: () => (
    <AreaChart data={ventasPorMes} xKey="mes" series={[{ key: 'ventas', label: 'Ventas' }, { key: 'costos', label: 'Costos' }]} stacked width={560} height={280} />
  ),
};

export const Barras: StoryObj = {
  render: () => <BarChart data={ventasPorMes} xKey="mes" series={['ventas', 'costos']} width={560} height={280} />,
};

export const BarrasHorizontales: StoryObj = {
  render: () => <BarChart data={presupuestosPorEstado} xKey="estado" series={['total']} horizontal showLegend={false} width={480} height={240} />,
};

export const Torta: StoryObj = {
  render: () => <PieChart data={presupuestosPorEstado} labelKey="estado" valueKey="total" width={420} height={260} />,
};

export const Donut: StoryObj = {
  render: () => <DonutChart data={presupuestosPorEstado} labelKey="estado" valueKey="total" showTotal width={420} height={260} />,
};

export const SinDatos: StoryObj = {
  render: () => <LineChart xKey="mes" series={['ventas']} width={420} height={200} />,
};

export const DashboardGrid: StoryObj = {
  name: 'Dashboard (composición)',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, maxWidth: 960 }}>
      <KpiCard label="Ventas del mes" value={190400} prefix="$" />
      <KpiCard label="Presupuestos aceptados" value={14} tone="success" />
      <KpiCard label="Stock crítico" value={7} tone="danger" unit="ítems" />
      <div style={{ gridColumn: 'span 2' }}>
        <Card>
          <LineChart data={ventasPorMes} xKey="mes" series={['ventas', 'costos']} height={240} />
        </Card>
      </div>
      <Card>
        <DonutChart data={presupuestosPorEstado} labelKey="estado" valueKey="total" showTotal height={240} />
      </Card>
    </div>
  ),
};
