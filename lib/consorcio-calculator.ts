export interface ConsorcioParams {
  valorImovel: number;
  valorCarta: number;
  lanceInicial: number;
  prazoAnos: number;
  taxaAdministrativaAnual: number;
}

export interface ConsorcioResult {
  valorFinanciado: number;
  taxaAdministrativaTotal: number;
  valorTotal: number;
  parcelaMensal: number;
  parcelas: number;
  taxaJurosEfetiva: number;
}

export function calculateConsorcio(params: ConsorcioParams): ConsorcioResult {
  const { valorImovel, valorCarta, lanceInicial, prazoAnos, taxaAdministrativaAnual } = params;
  
  // Valor que precisa ser financiado
  const valorFinanciado = valorCarta - lanceInicial;
  
  // Número de parcelas
  const parcelas = prazoAnos * 12;
  
  // Taxa administrativa total (pode ser calculada sobre o valor financiado ou valor da carta)
  // Geralmente é calculada sobre o valor da carta
  const taxaAdministrativaTotal = (valorCarta * taxaAdministrativaAnual * prazoAnos) / 100;
  
  // Valor total a pagar (sem considerar rendimentos do fundo)
  const valorTotal = lanceInicial + valorFinanciado + taxaAdministrativaTotal;
  
  // Parcela mensal básica (sem considerar juros do fundo)
  const parcelaMensal = valorFinanciado / parcelas;
  
  // Taxa administrativa mensal
  const taxaAdmMensal = (valorCarta * taxaAdministrativaAnual) / (100 * 12);
  
  // Parcela total mensal
  const parcelaTotalMensal = parcelaMensal + taxaAdmMensal;
  
  // Calcular taxa de juros efetiva aproximada
  // Considerando que o valor total pago é maior que o valor financiado
  const valorTotalPago = lanceInicial + (parcelaTotalMensal * parcelas);
  const taxaEfetiva = ((valorTotalPago - valorCarta) / valorCarta) * 100 / prazoAnos;
  
  return {
    valorFinanciado,
    taxaAdministrativaTotal,
    valorTotal,
    parcelaMensal: parcelaTotalMensal,
    parcelas,
    taxaJurosEfetiva: taxaEfetiva,
  };
}

export function calculateRiskAnalysis(
  valorImovel: number,
  valorProposta: number,
  caixa: number,
  titulosImobiliarios: number,
  crypto: number,
  consorcioResult: ConsorcioResult,
  lanceInicial: number,
  aluguelAtual: number = 0,
  receitaSobreloja: number = 0
) {
  const capitalTotal = caixa + titulosImobiliarios + crypto;
  const diferencaImovel = valorImovel - valorProposta;
  const capitalDisponivel = caixa + crypto; // Títulos não quer mexer
  
  // Análise de risco
  const risco = {
    nivel: 'MÉDIO',
    descricao: '',
    pontos: [] as string[],
  };
  
  // Verificar capital disponível vs necessidade
  const necessidadeCapital = lanceInicial + diferencaImovel;
  const porcentagemCapital = (capitalDisponivel / necessidadeCapital) * 100;
  
  if (porcentagemCapital >= 100) {
    risco.nivel = 'BAIXO';
    risco.descricao = 'Capital suficiente para transação';
    risco.pontos.push('✓ Capital disponível cobre o lance inicial e diferença do imóvel');
  } else if (porcentagemCapital >= 70) {
    risco.nivel = 'MÉDIO';
    risco.descricao = 'Capital suficiente, mas margem apertada';
    risco.pontos.push('⚠ Capital disponível cobre a maior parte do necessário');
    risco.pontos.push('⚠ Considere manter reserva de emergência');
  } else {
    risco.nivel = 'ALTO';
    risco.descricao = 'Capital insuficiente para transação completa';
    risco.pontos.push('✗ Capital disponível não cobre o necessário');
    risco.pontos.push('⚠ Pode ser necessário usar parte dos títulos imobiliários');
  }
  
  // Calcular economia/receita líquida mensal com a compra
  const economiaAluguel = aluguelAtual; // Economia por não pagar aluguel
  const receitaLiquidaMensal = economiaAluguel + receitaSobreloja; // R$ 11.500/mês
  const saldoMensal = receitaLiquidaMensal - consorcioResult.parcelaMensal;
  
  // Verificar parcela vs receita (assumindo receita média do negócio)
  const receitaMensalEstimada = 50000; // Valor estimado, pode ser ajustado
  const porcentagemParcela = (consorcioResult.parcelaMensal / receitaMensalEstimada) * 100;
  
  // Análise considerando economia de aluguel e receita da sobreloja
  if (saldoMensal > 0) {
    risco.pontos.push(`✓ Economia líquida mensal: R$ ${saldoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    risco.pontos.push(`  - Economia de aluguel: R$ ${aluguelAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    risco.pontos.push(`  - Receita sobreloja: R$ ${receitaSobreloja.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    risco.pontos.push(`  - Parcela consórcio: R$ ${consorcioResult.parcelaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
    if (risco.nivel === 'ALTO') {
      risco.nivel = 'MÉDIO';
    } else if (risco.nivel === 'MÉDIO') {
      risco.nivel = 'BAIXO';
    }
  } else {
    risco.pontos.push(`⚠ Déficit mensal: R$ ${Math.abs(saldoMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    risco.pontos.push(`  - Economia de aluguel: R$ ${aluguelAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    risco.pontos.push(`  - Receita sobreloja: R$ ${receitaSobreloja.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    risco.pontos.push(`  - Parcela consórcio: R$ ${consorcioResult.parcelaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
    if (Math.abs(saldoMensal) > receitaMensalEstimada * 0.3) {
      risco.nivel = risco.nivel === 'BAIXO' ? 'MÉDIO' : 'ALTO';
    }
  }
  
  if (porcentagemParcela > 50) {
    risco.pontos.push('⚠ Parcela mensal representa mais de 50% da receita estimada do negócio');
  } else if (porcentagemParcela > 30) {
    risco.pontos.push('⚠ Parcela mensal representa entre 30-50% da receita estimada do negócio');
  } else {
    risco.pontos.push('✓ Parcela mensal em nível confortável em relação à receita do negócio');
  }
  
  // Análise de liquidez
  if (crypto > capitalDisponivel * 0.5) {
    risco.pontos.push('⚠ Maior parte do capital está em crypto (alta volatilidade)');
  }
  
  if (titulosImobiliarios > capitalTotal * 0.4) {
    risco.pontos.push('✓ Boa diversificação com títulos imobiliários');
  }
  
  return {
    risco,
    necessidadeCapital,
    capitalDisponivel,
    porcentagemCapital,
    porcentagemParcela,
    economiaAluguel,
    receitaSobreloja,
    receitaLiquidaMensal,
    saldoMensal,
  };
}

