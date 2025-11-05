'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DecisionAnalysis, InvestmentScenario } from '@/lib/types';
import { TrendingUp, TrendingDown, Home, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DecisionAnalysisProps {
  analysis: DecisionAnalysis;
  investmentScenarios: InvestmentScenario[];
}

export function DecisionAnalysisComponent({ analysis, investmentScenarios }: DecisionAnalysisProps) {
  const isRecommendationBuy = analysis.recommendation.includes('Comprar');

  return (
    <div className="space-y-6">
      {/* Recomendação Principal */}
      <Card className={isRecommendationBuy ? 'border-blue-500' : 'border-green-500'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Recomendação</CardTitle>
            {isRecommendationBuy ? (
              <Badge variant="default" className="bg-blue-500">
                <Home className="mr-2 h-4 w-4" />
                Comprar
              </Badge>
            ) : (
              <Badge variant="default" className="bg-green-500">
                <DollarSign className="mr-2 h-4 w-4" />
                Vender e Investir
              </Badge>
            )}
          </div>
          <CardDescription className="text-lg font-semibold mt-2">
            {analysis.recommendation}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start gap-2">
                {reason.startsWith('✓') ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : reason.startsWith('⚠') ? (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                )}
                <p className="text-sm leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparação de Cenários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cenário 1: Comprar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Cenário 1: Comprar via Consórcio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor do Imóvel:</span>
                <span className="font-semibold">
                  R$ {analysis.buyScenario.propertyValue.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Prestação Mensal:</span>
                <span className="font-semibold">
                  R$ {analysis.buyScenario.monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Custo Total (10 anos):</span>
                <span className="font-semibold text-red-600">
                  R$ {analysis.buyScenario.consorcioCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor do Negócio:</span>
                <span className="font-semibold">
                  R$ {analysis.buyScenario.businessValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Posição Líquida:</span>
                <span className={`font-bold ${analysis.buyScenario.netPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {analysis.buyScenario.netPosition.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cenário 2: Vender */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cenário 2: Vender e Investir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Investimentos Atuais:</span>
                <span className="font-semibold">
                  R$ {analysis.sellScenario.currentInvestments.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor de Venda do Negócio:</span>
                <span className="font-semibold">
                  R$ {analysis.sellScenario.businessSaleValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Capital Total:</span>
                <span className="font-bold text-green-600">
                  R$ {analysis.sellScenario.totalCapital.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Renda Passiva Mensal:</span>
                <span className="font-semibold text-green-600">
                  R$ {analysis.sellScenario.passiveIncomeMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Renda Passiva Anual:</span>
                <span className="font-semibold text-green-600">
                  R$ {analysis.sellScenario.passiveIncomeYearly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-md bg-muted">
              <p className="text-xs text-muted-foreground">
                <strong>Risco:</strong> {analysis.sellScenario.riskAssessment}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cenários de Investimento */}
      <Card>
        <CardHeader>
          <CardTitle>Cenários de Investimento (Renda Passiva)</CardTitle>
          <CardDescription>
            Projeções de renda passiva com diferentes estratégias de investimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investmentScenarios.map((scenario, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                <h4 className="font-semibold">{scenario.scenario}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Renda Mensal</p>
                    <p className="font-semibold">
                      R$ {scenario.monthlyPassiveIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Renda Anual</p>
                    <p className="font-semibold">
                      R$ {scenario.yearlyPassiveIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">5 Anos</p>
                    <p className="font-semibold">
                      R$ {scenario.totalValueAfter5Years.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">10 Anos</p>
                    <p className="font-semibold">
                      R$ {scenario.totalValueAfter10Years.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

