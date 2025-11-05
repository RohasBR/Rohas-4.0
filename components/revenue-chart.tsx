'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { YearlySummary } from '@/lib/types';

interface RevenueChartProps {
  yearlySummaries: YearlySummary[];
}

export function RevenueChart({ yearlySummaries }: RevenueChartProps) {
  if (yearlySummaries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução da Receita</CardTitle>
          <CardDescription>Nenhum dado disponível</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartData = yearlySummaries.map(summary => ({
    ano: summary.year,
    receita: summary.totalRevenue,
    crescimento: summary.growthRate || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução da Receita Anual</CardTitle>
        <CardDescription>Receita total e taxa de crescimento por ano</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ano" />
            <YAxis 
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [
                `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                'Receita'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="receita" 
              stroke="#2563eb" 
              strokeWidth={2}
              name="Receita Total"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function GrowthChart({ yearlySummaries }: RevenueChartProps) {
  if (yearlySummaries.length === 0) {
    return null;
  }

  const chartData = yearlySummaries
    .filter(s => s.growthRate !== undefined)
    .map(summary => ({
      ano: summary.year,
      crescimento: summary.growthRate || 0,
    }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de Crescimento Anual</CardTitle>
        <CardDescription>Percentual de crescimento ano a ano</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ano" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value: number) => [
                `${value.toFixed(2)}%`,
                'Crescimento'
              ]}
            />
            <Legend />
            <Bar 
              dataKey="crescimento" 
              fill="#10b981"
              name="Taxa de Crescimento (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

