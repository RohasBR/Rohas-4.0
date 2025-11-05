'use client';

import { useState } from 'react';
import { FinancialStats } from '@/components/financial-stats';
import { RevenueChart, GrowthChart } from '@/components/revenue-chart';
import { DecisionAnalysisComponent } from '@/components/decision-analysis';
import { AnaliseCompraImovel } from '@/components/analise-compra-imovel';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialRecord, FinancialAnalysis, InvestmentScenario, DecisionAnalysis } from '@/lib/types';
import { calculateFinancialAnalysis, calculateInvestmentScenarios, calculateDecisionAnalysis } from '@/lib/analysis';

export default function Home() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [investmentScenarios, setInvestmentScenarios] = useState<InvestmentScenario[]>([]);
  const [decisionAnalysis, setDecisionAnalysis] = useState<DecisionAnalysis | null>(null);
  
  // Parâmetros de análise (valores fixos)
  const propertyValue = 3000000; // 3M
  const currentInvestments = 1000000; // 1M
  const cryptoPercentage = 0.6; // 60%
  const realEstatePercentage = 0.4; // 40%

  const handleFilesLoaded = (loadedRecords: FinancialRecord[]) => {
    setRecords(loadedRecords);
    const financialAnalysis = calculateFinancialAnalysis(loadedRecords);
    setAnalysis(financialAnalysis);
    
    // Calcular cenários de investimento
    const scenarios = calculateInvestmentScenarios(
      currentInvestments,
      cryptoPercentage,
      realEstatePercentage
    );
    setInvestmentScenarios(scenarios);
    
    // Calcular análise de decisão
    const decision = calculateDecisionAnalysis(
      financialAnalysis,
      propertyValue,
      currentInvestments
    );
    setDecisionAnalysis(decision);
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Análise Financeira - Decola Eventos</h1>
          <p className="text-muted-foreground">
            Análise completa para tomada de decisão sobre compra do imóvel via consórcio ou venda e investimento
          </p>
        </div>


        {/* Tabs */}
        <Tabs defaultValue="compra-imovel" className="space-y-4">
          <TabsList>
            <TabsTrigger value="compra-imovel">
              Análise de Compra
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={!analysis}>
              Análise Financeira
            </TabsTrigger>
            <TabsTrigger value="decision" disabled={!decisionAnalysis}>
              Análise de Decisão
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compra-imovel" className="space-y-4">
            <AnaliseCompraImovel />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            {analysis ? (
              <>
                <FinancialStats analysis={analysis} />
                <RevenueChart yearlySummaries={analysis.yearlySummaries} />
                <GrowthChart yearlySummaries={analysis.yearlySummaries} />
              </>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Carregue os arquivos Excel primeiro para ver a análise
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="decision" className="space-y-4">
            {decisionAnalysis ? (
              <DecisionAnalysisComponent
                analysis={decisionAnalysis}
                investmentScenarios={investmentScenarios}
              />
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Carregue os arquivos Excel primeiro para ver a análise de decisão
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
