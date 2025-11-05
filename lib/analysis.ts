import { FinancialAnalysis, FinancialRecord, YearlySummary, InvestmentScenario, ConsorcioAnalysis, DecisionAnalysis } from './types';

export function calculateFinancialAnalysis(records: FinancialRecord[]): FinancialAnalysis {
  if (records.length === 0) {
    return {
      totalRevenue: 0,
      averageYearlyRevenue: 0,
      averageMonthlyRevenue: 0,
      yearlySummaries: [],
      growthTrend: 0,
      projectedRevenue: 0,
      lastYearRevenue: 0,
    };
  }
  
  const totalRevenue = records.reduce((sum, r) => sum + r.revenue, 0);
  const years = new Set(records.map(r => r.year));
  const averageYearlyRevenue = totalRevenue / years.size;
  const averageMonthlyRevenue = totalRevenue / records.length;
  
  // Calcular tendência de crescimento (últimos 3 anos)
  const yearlySummaries: YearlySummary[] = [];
  const yearlyData = new Map<number, number>();
  
  records.forEach(r => {
    const existing = yearlyData.get(r.year) || 0;
    yearlyData.set(r.year, existing + r.revenue);
  });
  
  const sortedYears = Array.from(yearlyData.keys()).sort((a, b) => a - b);
  let previousRevenue = 0;
  
  sortedYears.forEach(year => {
    const revenue = yearlyData.get(year) || 0;
    const growthRate = previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue) * 100 : undefined;
    
    yearlySummaries.push({
      year,
      totalRevenue: revenue,
      averageMonthlyRevenue: revenue / 12,
      growthRate,
      months: 12,
    });
    
    previousRevenue = revenue;
  });
  
  // Calcular tendência de crescimento (últimos 3 anos)
  const last3Years = yearlySummaries.slice(-3);
  let growthTrend = 0;
  if (last3Years.length >= 2) {
    const growthRates = last3Years
      .slice(1)
      .map((y, i) => y.growthRate || 0)
      .filter(r => r !== undefined);
    
    if (growthRates.length > 0) {
      growthTrend = growthRates.reduce((sum, r) => sum + r, 0) / growthRates.length;
    }
  }
  
  // Projeção para próximo ano
  const lastYearRevenue = yearlySummaries[yearlySummaries.length - 1]?.totalRevenue || 0;
  const projectedRevenue = lastYearRevenue * (1 + growthTrend / 100);
  
  return {
    totalRevenue,
    averageYearlyRevenue,
    averageMonthlyRevenue,
    yearlySummaries,
    growthTrend,
    projectedRevenue,
    lastYearRevenue,
  };
}

export function calculateInvestmentScenarios(
  totalCapital: number,
  cryptoPercentage: number = 0.6,
  realEstatePercentage: number = 0.4
): InvestmentScenario[] {
  const scenarios: InvestmentScenario[] = [];
  
  // Cenário Conservador (4% ao ano)
  scenarios.push({
    scenario: 'Conservador (4% ao ano)',
    initialInvestment: totalCapital,
    monthlyPassiveIncome: (totalCapital * 0.04) / 12,
    yearlyPassiveIncome: totalCapital * 0.04,
    totalValueAfter5Years: totalCapital * Math.pow(1.04, 5),
    totalValueAfter10Years: totalCapital * Math.pow(1.04, 10),
  });
  
  // Cenário Moderado (6% ao ano)
  scenarios.push({
    scenario: 'Moderado (6% ao ano)',
    initialInvestment: totalCapital,
    monthlyPassiveIncome: (totalCapital * 0.06) / 12,
    yearlyPassiveIncome: totalCapital * 0.06,
    totalValueAfter5Years: totalCapital * Math.pow(1.06, 5),
    totalValueAfter10Years: totalCapital * Math.pow(1.06, 10),
  });
  
  // Cenário Arrojado (8% ao ano)
  scenarios.push({
    scenario: 'Arrojado (8% ao ano)',
    initialInvestment: totalCapital,
    monthlyPassiveIncome: (totalCapital * 0.08) / 12,
    yearlyPassiveIncome: totalCapital * 0.08,
    totalValueAfter5Years: totalCapital * Math.pow(1.08, 5),
    totalValueAfter10Years: totalCapital * Math.pow(1.08, 10),
  });
  
  // Cenário Misto (Crypto + Imobiliário)
  const cryptoReturn = 0.12; // 12% ao ano (conservador para crypto)
  const realEstateReturn = 0.08; // 8% ao ano (títulos imobiliários)
  const mixedReturn = (cryptoPercentage * cryptoReturn) + (realEstatePercentage * realEstateReturn);
  
  scenarios.push({
    scenario: `Misto (${(cryptoReturn * 100).toFixed(0)}% Crypto + ${(realEstateReturn * 100).toFixed(0)}% Imobiliário)`,
    initialInvestment: totalCapital,
    monthlyPassiveIncome: (totalCapital * mixedReturn) / 12,
    yearlyPassiveIncome: totalCapital * mixedReturn,
    totalValueAfter5Years: totalCapital * Math.pow(1 + mixedReturn, 5),
    totalValueAfter10Years: totalCapital * Math.pow(1 + mixedReturn, 10),
  });
  
  return scenarios;
}

export function calculateConsorcioAnalysis(
  propertyValue: number,
  durationYears: number = 10,
  interestRate: number = 0.12 // 12% ao ano
): ConsorcioAnalysis {
  const durationMonths = durationYears * 12;
  const monthlyInterestRate = interestRate / 12;
  
  // Cálculo de prestação com juros compostos
  const monthlyPayment = propertyValue * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, durationMonths)) /
    (Math.pow(1 + monthlyInterestRate, durationMonths) - 1);
  
  const totalPayments = monthlyPayment * durationMonths;
  const totalCost = totalPayments;
  const opportunityCost = totalCost - propertyValue;
  
  return {
    propertyValue,
    monthlyPayment,
    totalPayments,
    durationMonths,
    totalCost,
    opportunityCost,
  };
}

export function calculateDecisionAnalysis(
  analysis: FinancialAnalysis,
  propertyValue: number,
  currentInvestments: number,
  consorcioDurationYears: number = 10,
  consorcioInterestRate: number = 0.12
): DecisionAnalysis {
  const consorcioAnalysis = calculateConsorcioAnalysis(propertyValue, consorcioDurationYears, consorcioInterestRate);
  
  // Cenário 1: Comprar via consórcio
  const businessValue = analysis.projectedRevenue * 3; // 3 anos de receita projetada como valor do negócio
  const buyScenario = {
    propertyValue,
    consorcioCost: consorcioAnalysis.totalCost,
    monthlyPayment: consorcioAnalysis.monthlyPayment,
    totalCost: consorcioAnalysis.totalCost,
    businessValue,
    netPosition: currentInvestments + businessValue - consorcioAnalysis.totalCost,
  };
  
  // Cenário 2: Vender e investir
  const businessSaleValue = analysis.projectedRevenue * 2; // 2 anos de receita como valor de venda
  const totalCapital = currentInvestments + businessSaleValue;
  const conservativeReturn = 0.06; // 6% ao ano (conservador)
  
  const sellScenario = {
    currentInvestments,
    businessSaleValue,
    totalCapital,
    passiveIncomeMonthly: (totalCapital * conservativeReturn) / 12,
    passiveIncomeYearly: totalCapital * conservativeReturn,
    riskAssessment: 'Moderado - Risco Brasil considerado, mas diversificação em crypto e imobiliário reduz exposição',
  };
  
  // Análise e recomendação
  const reasoning: string[] = [];
  let recommendation = '';
  
  // Comparar fluxo de caixa
  const monthlyBusinessIncome = analysis.averageMonthlyRevenue;
  const consorcioMonthlyPayment = consorcioAnalysis.monthlyPayment;
  const netBusinessIncome = monthlyBusinessIncome - consorcioMonthlyPayment;
  
  reasoning.push(`Receita média mensal do negócio: R$ ${monthlyBusinessIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  reasoning.push(`Prestação mensal do consórcio: R$ ${consorcioMonthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  reasoning.push(`Saldo líquido mensal (se comprar): R$ ${netBusinessIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  reasoning.push(`Renda passiva mensal (se vender): R$ ${sellScenario.passiveIncomeMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
  
  if (netBusinessIncome > sellScenario.passiveIncomeMonthly * 1.5) {
    recommendation = 'Comprar via Consórcio';
    reasoning.push('O negócio gera receita líquida significativamente maior que a renda passiva');
    reasoning.push('O fluxo de caixa positivo permite cobrir as prestações e ainda gerar lucro');
  } else if (netBusinessIncome > sellScenario.passiveIncomeMonthly) {
    recommendation = 'Comprar via Consórcio (com ressalvas)';
    reasoning.push('O negócio gera receita líquida maior, mas a diferença não é tão significativa');
    reasoning.push('Considere o fator estresse e cansaço mencionado');
    reasoning.push('A renda passiva oferece mais tranquilidade e menos trabalho');
  } else {
    recommendation = 'Vender e Investir';
    reasoning.push('A renda passiva é maior ou similar ao saldo líquido do negócio');
    reasoning.push('Menos estresse e trabalho operacional');
    reasoning.push('Diversificação reduz riscos do Risco Brasil');
    reasoning.push('Liberdade para trabalhar na área sem ser empresário');
  }
  
  // Análise de risco Brasil
  reasoning.push('');
  reasoning.push('ANÁLISE DE RISCO BRASIL:');
  reasoning.push('- Investimentos em crypto (60%) são menos afetados pela economia brasileira');
  reasoning.push('- Títulos imobiliários (40%) oferecem proteção contra inflação');
  reasoning.push('- Real pode desvalorizar, mas investimentos diversificados mitigam o risco');
  
  // Análise de capital necessário
  reasoning.push('');
  reasoning.push('CAPITAL NECESSÁRIO:');
  reasoning.push(`Para comprar o imóvel (R$ ${propertyValue.toLocaleString('pt-BR')}):`);
  reasoning.push(`- Total via consórcio: R$ ${consorcioAnalysis.totalCost.toLocaleString('pt-BR')}`);
  reasoning.push(`- Capital atual disponível: R$ ${currentInvestments.toLocaleString('pt-BR')}`);
  
  if (currentInvestments >= propertyValue * 0.3) {
    reasoning.push('✓ Você tem capital suficiente para entrada/consórcio');
  } else {
    reasoning.push('⚠ Pode ser necessário usar parte do capital para entrada');
  }
  
  return {
    buyScenario,
    sellScenario,
    recommendation,
    reasoning,
  };
}

