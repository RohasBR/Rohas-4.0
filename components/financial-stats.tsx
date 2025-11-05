'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FinancialAnalysis } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface FinancialStatsProps {
  analysis: FinancialAnalysis;
}

export function FinancialStats({ analysis }: FinancialStatsProps) {
  if (!analysis || analysis.yearlySummaries.length === 0) {
    return null;
  }

  const lastYear = analysis.yearlySummaries[analysis.yearlySummaries.length - 1];
  const previousYear = analysis.yearlySummaries.length > 1 
    ? analysis.yearlySummaries[analysis.yearlySummaries.length - 2]
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {analysis.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {analysis.yearlySummaries.length} anos de dados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Média Anual</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {analysis.averageYearlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            Média por ano
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Média Mensal</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {analysis.averageMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            Média por mês
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tendência de Crescimento</CardTitle>
          {analysis.growthTrend >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${analysis.growthTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analysis.growthTrend >= 0 ? '+' : ''}{analysis.growthTrend.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Média dos últimos 3 anos
          </p>
        </CardContent>
      </Card>

      {lastYear && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Ano ({lastYear.year})</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {lastYear.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              {lastYear.growthRate !== undefined && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={lastYear.growthRate >= 0 ? 'default' : 'destructive'}>
                    {lastYear.growthRate >= 0 ? '+' : ''}{lastYear.growthRate.toFixed(2)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs ano anterior</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projeção Próximo Ano</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {analysis.projectedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Baseado na tendência atual
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

