'use client';

import { useState } from 'react';
import { ExcelUploader } from '@/components/excel-uploader';
import { FinancialStats } from '@/components/financial-stats';
import { RevenueChart, GrowthChart } from '@/components/revenue-chart';
import { DecisionAnalysisComponent } from '@/components/decision-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FinancialRecord, FinancialAnalysis, InvestmentScenario, DecisionAnalysis } from '@/lib/types';
import { calculateFinancialAnalysis, calculateInvestmentScenarios, calculateDecisionAnalysis } from '@/lib/analysis';
import { Calculator, TrendingUp } from 'lucide-react';

export default function Home() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [investmentScenarios, setInvestmentScenarios] = useState<InvestmentScenario[]>([]);
  const [decisionAnalysis, setDecisionAnalysis] = useState<DecisionAnalysis | null>(null);
  
  // Parâmetros de análise
  const [propertyValue, setPropertyValue] = useState(3000000); // 3M
  const [currentInvestments, setCurrentInvestments] = useState(1000000); // 1M
  const [cryptoPercentage, setCryptoPercentage] = useState(0.6); // 60%
  const [realEstatePercentage, setRealEstatePercentage] = useState(0.4); // 40%

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

  const handleRecalculate = () => {
    if (records.length > 0 && analysis) {
      const scenarios = calculateInvestmentScenarios(
        currentInvestments,
        cryptoPercentage,
        realEstatePercentage
      );
      setInvestmentScenarios(scenarios);
      
      const decision = calculateDecisionAnalysis(
        analysis,
        propertyValue,
        currentInvestments
      );
      setDecisionAnalysis(decision);
    }
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

        {/* Parâmetros de Análise */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Parâmetros de Análise
            </CardTitle>
            <CardDescription>
              Configure os valores para análise personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property-value">Valor do Imóvel (R$)</Label>
                <Input
                  id="property-value"
                  type="number"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  placeholder="3000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="investments">Investimentos Atuais (R$)</Label>
                <Input
                  id="investments"
                  type="number"
                  value={currentInvestments}
                  onChange={(e) => setCurrentInvestments(Number(e.target.value))}
                  placeholder="1000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crypto">% Crypto (0-1)</Label>
                <Input
                  id="crypto"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={cryptoPercentage}
                  onChange={(e) => setCryptoPercentage(Number(e.target.value))}
                  placeholder="0.6"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="real-estate">% Imobiliário (0-1)</Label>
                <Input
                  id="real-estate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={realEstatePercentage}
                  onChange={(e) => setRealEstatePercentage(Number(e.target.value))}
                  placeholder="0.4"
                />
              </div>
            </div>
            <Button onClick={handleRecalculate} className="mt-4">
              <TrendingUp className="mr-2 h-4 w-4" />
              Recalcular Análise
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload">Carregar Dados</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!analysis}>
              Análise Financeira
            </TabsTrigger>
            <TabsTrigger value="decision" disabled={!decisionAnalysis}>
              Análise de Decisão
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <ExcelUploader onFilesLoaded={handleFilesLoaded} />
            {records.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Dados Carregados</CardTitle>
                  <CardDescription>
                    {records.length} registros financeiros carregados com sucesso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Período: {new Date(records[0]?.date).toLocaleDateString('pt-BR')} até{' '}
                    {new Date(records[records.length - 1]?.date).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            )}
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
