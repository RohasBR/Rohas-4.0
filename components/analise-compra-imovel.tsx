'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/currency-input';
import { calculateConsorcio, calculateRiskAnalysis, ConsorcioParams, ConsorcioResult } from '@/lib/consorcio-calculator';
import { AlertTriangle, CheckCircle2, TrendingUp, Home, DollarSign } from 'lucide-react';

interface AnaliseCompraImovelProps {
  onCalculate?: (data: any) => void;
}

export function AnaliseCompraImovel({ onCalculate }: AnaliseCompraImovelProps) {
  // Dados de entrada
  const [valorImovel, setValorImovel] = useState(3200000);
  const [valorProposta, setValorProposta] = useState(2500000);
  const [caixa, setCaixa] = useState(0);
  const [titulosImobiliarios, setTitulosImobiliarios] = useState(500000);
  const [crypto, setCrypto] = useState(700000);
  
  // Dados de aluguel e receita
  const [aluguelAtual, setAluguelAtual] = useState(7000);
  const [receitaSobreloja, setReceitaSobreloja] = useState(4500);
  
  // Dados do consórcio
  const [valorCarta, setValorCarta] = useState(2000000);
  const [lanceInicial, setLanceInicial] = useState(500000);
  const [prazoAnos, setPrazoAnos] = useState(15);
  const [taxaAdministrativa, setTaxaAdministrativa] = useState(1.2); // Taxa anual padrão
  
  // Resultados
  const [consorcioResult, setConsorcioResult] = useState<ConsorcioResult | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);
  
  // Cenários de prazo
  const prazos = [10, 15, 20];
  
  useEffect(() => {
    calculate();
  }, [valorImovel, valorProposta, caixa, titulosImobiliarios, crypto, aluguelAtual, receitaSobreloja, valorCarta, lanceInicial, prazoAnos, taxaAdministrativa]);
  
  const calculate = () => {
    const params: ConsorcioParams = {
      valorImovel,
      valorCarta,
      lanceInicial,
      prazoAnos,
      taxaAdministrativaAnual: taxaAdministrativa,
    };
    
    const result = calculateConsorcio(params);
    setConsorcioResult(result);
    
    const risk = calculateRiskAnalysis(
      valorImovel,
      valorProposta,
      caixa,
      titulosImobiliarios,
      crypto,
      result,
      lanceInicial,
      aluguelAtual,
      receitaSobreloja
    );
    setRiskAnalysis(risk);
    
    if (onCalculate) {
      onCalculate({
        params,
        result,
        risk,
      });
    }
  };
  
  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'BAIXO':
        return 'bg-green-500';
      case 'MÉDIO':
        return 'bg-yellow-500';
      case 'ALTO':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };
  
  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Tabela de Entrada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Análise de Compra de Imóvel
          </CardTitle>
          <CardDescription>
            Tabela editável para análise de risco e viabilidade financeira
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Informações do Imóvel */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informações do Imóvel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor-imovel">Valor Pedido pelo Proprietário</Label>
                  <CurrencyInput
                    id="valor-imovel"
                    value={valorImovel}
                    onValueChange={(value) => setValorImovel(value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor-proposta">Valor da Proposta</Label>
                  <CurrencyInput
                    id="valor-proposta"
                    value={valorProposta}
                    onValueChange={(value) => setValorProposta(value)}
                  />
                </div>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Diferença:</strong> {formatCurrency(valorImovel - valorProposta)}
                  {valorProposta < valorImovel && (
                    <span className="text-orange-600 ml-2">
                      (Economia de {formatCurrency(valorImovel - valorProposta)})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Capital Disponível */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Capital Disponível</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caixa">Caixa Disponível</Label>
                  <CurrencyInput
                    id="caixa"
                    value={caixa}
                    onValueChange={(value) => setCaixa(value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titulos">Títulos Imobiliários</Label>
                  <CurrencyInput
                    id="titulos"
                    value={titulosImobiliarios}
                    onValueChange={(value) => setTitulosImobiliarios(value)}
                    className="bg-yellow-50"
                  />
                  <p className="text-xs text-muted-foreground">Não pretende mexer</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crypto">Crypto</Label>
                  <CurrencyInput
                    id="crypto"
                    value={crypto}
                    onValueChange={(value) => setCrypto(value)}
                  />
                </div>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Capital Total:</strong> {formatCurrency(caixa + titulosImobiliarios + crypto)}
                </p>
                <p className="text-sm">
                  <strong>Capital Disponível (sem títulos):</strong> {formatCurrency(caixa + crypto)}
                </p>
              </div>
            </div>

            {/* Dados do Consórcio */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados do Consórcio</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor-carta">Valor da Carta</Label>
                  <CurrencyInput
                    id="valor-carta"
                    value={valorCarta}
                    onValueChange={(value) => setValorCarta(value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lance-inicial">Lance Inicial</Label>
                  <CurrencyInput
                    id="lance-inicial"
                    value={lanceInicial}
                    onValueChange={(value) => setLanceInicial(value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazo">Prazo (anos)</Label>
                  <Select value={prazoAnos.toString()} onValueChange={(v) => setPrazoAnos(Number(v))}>
                    <SelectTrigger id="prazo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prazos.map((p) => (
                        <SelectItem key={p} value={p.toString()}>
                          {p} anos
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxa-adm">Taxa Administrativa Anual (%)</Label>
                  <Input
                    id="taxa-adm"
                    type="number"
                    step="0.1"
                    value={taxaAdministrativa}
                    onChange={(e) => setTaxaAdministrativa(Number(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.blur();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {consorcioResult && riskAnalysis && (
        <>
          {/* Análise de Risco */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Análise de Risco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={`${getRiskColor(riskAnalysis.risco.nivel)} text-white`}>
                    Risco: {riskAnalysis.risco.nivel}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {riskAnalysis.risco.descricao}
                  </span>
                </div>
                <div className="space-y-2">
                  {riskAnalysis.risco.pontos.map((ponto: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      {ponto.startsWith('✓') && <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />}
                      {ponto.startsWith('⚠') && <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />}
                      {ponto.startsWith('✗') && <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />}
                      <span>{ponto}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados do Consórcio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resultados do Consórcio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Valor Financiado</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(consorcioResult.valorFinanciado)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Taxa Administrativa Total ({prazoAnos} anos)</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(consorcioResult.taxaAdministrativaTotal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lance Inicial</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(lanceInicial)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Valor Total a Pagar</TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      {formatCurrency(consorcioResult.valorTotal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Parcela Mensal</TableCell>
                    <TableCell className="text-right font-bold text-lg text-green-600">
                      {formatCurrency(consorcioResult.parcelaMensal)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Número de Parcelas</TableCell>
                    <TableCell className="text-right font-semibold">
                      {consorcioResult.parcelas} parcelas
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Taxa Efetiva Anual (aprox.)</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatNumber(consorcioResult.taxaJurosEfetiva)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Necessidade de Capital (Lance + Diferença):</span>
                  <span className="font-semibold">
                    {formatCurrency(riskAnalysis.necessidadeCapital)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Capital Disponível:</span>
                  <span className="font-semibold">
                    {formatCurrency(riskAnalysis.capitalDisponivel)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cobertura do Capital:</span>
                  <span className={`font-bold ${riskAnalysis.porcentagemCapital >= 100 ? 'text-green-600' : riskAnalysis.porcentagemCapital >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {formatNumber(riskAnalysis.porcentagemCapital)}%
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Capital Restante após Transação:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(riskAnalysis.capitalDisponivel - riskAnalysis.necessidadeCapital)}
                    </span>
                  </div>
                </div>
                {riskAnalysis.saldoMensal !== undefined && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Saldo Mensal Líquido:</span>
                      <span className={`font-bold ${riskAnalysis.saldoMensal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(riskAnalysis.saldoMensal)}/mês
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Receita líquida (aluguel + sobreloja) - Parcela do consórcio
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

