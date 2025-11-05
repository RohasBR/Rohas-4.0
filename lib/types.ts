export interface FinancialRecord {
  date: string;
  revenue: number;
  year: number;
  month: number;
}

export interface YearlySummary {
  year: number;
  totalRevenue: number;
  averageMonthlyRevenue: number;
  growthRate?: number;
  months: number;
}

export interface FinancialAnalysis {
  totalRevenue: number;
  averageYearlyRevenue: number;
  averageMonthlyRevenue: number;
  yearlySummaries: YearlySummary[];
  growthTrend: number;
  projectedRevenue: number;
  lastYearRevenue: number;
}

export interface InvestmentScenario {
  scenario: string;
  initialInvestment: number;
  monthlyPassiveIncome: number;
  yearlyPassiveIncome: number;
  totalValueAfter5Years: number;
  totalValueAfter10Years: number;
}

export interface ConsorcioAnalysis {
  propertyValue: number;
  monthlyPayment: number;
  totalPayments: number;
  durationMonths: number;
  totalCost: number;
  opportunityCost: number;
}

export interface DecisionAnalysis {
  buyScenario: {
    propertyValue: number;
    consorcioCost: number;
    monthlyPayment: number;
    totalCost: number;
    businessValue: number;
    netPosition: number;
  };
  sellScenario: {
    currentInvestments: number;
    businessSaleValue: number;
    totalCapital: number;
    passiveIncomeMonthly: number;
    passiveIncomeYearly: number;
    riskAssessment: string;
  };
  recommendation: string;
  reasoning: string[];
}

