# Guia de Uso - Análise Financeira Decola Eventos

## 📋 Como Usar o Sistema

### 1. Iniciar o Servidor

```bash
cd rohas-analytics
npm run dev
```

O sistema estará disponível em: **http://localhost:3001**

### 2. Carregar Arquivos Excel

**Opção 1: Carregar Arquivos Padrão (Recomendado)**
1. Acesse a aba **"Carregar Dados"**
2. Clique no botão **"Carregar Arquivos Padrão (Pasta Data)"**
3. O sistema irá automaticamente processar todos os arquivos Excel da pasta `data/`
4. Todos os arquivos de faturamento de 2010 a 2024 serão carregados automaticamente

**Opção 2: Carregar Arquivos Manualmente**
1. Acesse a aba **"Carregar Dados"**
2. Clique em **"Arquivos Excel"** e selecione os arquivos de faturamento
3. Você pode selecionar múltiplos arquivos de uma vez
4. Clique em **"Carregar e Analisar"**
5. O sistema irá processar todos os arquivos e extrair os dados financeiros

**Nota:** Os arquivos Excel já estão incluídos na pasta `data/` do projeto. Use o botão "Carregar Arquivos Padrão" para uma análise completa e rápida.

### 3. Configurar Parâmetros de Análise

Na seção **"Parâmetros de Análise"**, configure:

- **Valor do Imóvel**: R$ 3.000.000,00 (padrão)
- **Investimentos Atuais**: R$ 1.000.000,00 (padrão)
- **% Crypto**: 0.6 (60% padrão)
- **% Imobiliário**: 0.4 (40% padrão)

Após configurar, clique em **"Recalcular Análise"** para atualizar os resultados.

### 4. Visualizar Análise Financeira

Na aba **"Análise Financeira"**, você verá:

- **Estatísticas Principais**:
  - Receita Total
  - Receita Média Anual
  - Receita Média Mensal
  - Tendência de Crescimento
  - Último Ano
  - Projeção Próximo Ano

- **Gráficos**:
  - Evolução da Receita Anual (linha)
  - Taxa de Crescimento Anual (barras)

### 5. Análise de Decisão

Na aba **"Análise de Decisão"**, você verá:

#### Recomendação Principal
Baseada nos dados carregados e parâmetros configurados, o sistema fornece uma recomendação:
- **Comprar via Consórcio**: Se o negócio gera receita líquida significativamente maior
- **Vender e Investir**: Se a renda passiva é maior ou similar ao saldo líquido

#### Comparação de Cenários

**Cenário 1: Comprar via Consórcio**
- Valor do Imóvel
- Prestação Mensal
- Custo Total (10 anos)
- Valor do Negócio
- Posição Líquida

**Cenário 2: Vender e Investir**
- Investimentos Atuais
- Valor de Venda do Negócio
- Capital Total
- Renda Passiva Mensal
- Renda Passiva Anual
- Análise de Risco

#### Cenários de Investimento
O sistema calcula 4 cenários diferentes:
1. **Conservador** (4% ao ano)
2. **Moderado** (6% ao ano)
3. **Arrojado** (8% ao ano)
4. **Misto** (12% Crypto + 8% Imobiliário)

Cada cenário mostra:
- Renda Mensal
- Renda Anual
- Valor Total após 5 anos
- Valor Total após 10 anos

## 📊 Entendendo os Resultados

### Receita Média Mensal
Este é o valor médio que sua empresa gera por mês. Compare com:
- Prestação mensal do consórcio
- Renda passiva mensal estimada

### Tendência de Crescimento
Mostra se sua empresa está crescendo ou diminuindo. Baseado nos últimos 3 anos.

### Projeção Próximo Ano
Estimativa de receita para o próximo ano baseada na tendência atual.

### Análise de Decisão
O sistema compara:
- **Saldo Líquido Mensal** (se comprar) = Receita Mensal - Prestação Consórcio
- **Renda Passiva Mensal** (se vender) = Capital Total × Taxa de Retorno / 12

A recomendação é baseada em qual valor é maior e considera:
- Fator estresse e cansaço
- Risco Brasil
- Diversificação de investimentos
- Liberdade financeira

## ⚠️ Considerações Importantes

1. **Risco Brasil**: O sistema considera que investimentos em crypto (60%) são menos afetados pela economia brasileira, enquanto títulos imobiliários (40%) oferecem proteção contra inflação.

2. **Valor do Negócio**: O sistema calcula o valor do negócio como:
   - Para compra: 3 anos de receita projetada
   - Para venda: 2 anos de receita projetada

3. **Consórcio**: O sistema calcula com juros de 12% ao ano por 10 anos. Você pode ajustar esses valores no código se necessário.

4. **Renda Passiva**: O sistema usa uma taxa conservadora de 6% ao ano para o cenário de venda, mas mostra múltiplos cenários.

## 🔧 Solução de Problemas

### Arquivos Excel não carregam
- Verifique se os arquivos são .xlsx ou .xls
- Certifique-se de que os arquivos têm colunas de Data e Receita/Valor
- O sistema tenta detectar automaticamente diferentes formatos de colunas

### Dados não aparecem
- Verifique se os arquivos contêm dados válidos
- O sistema precisa de pelo menos uma linha com Data e Receita válidas
- Verifique o console do navegador para erros

### Resultados não fazem sentido
- Verifique se os parâmetros estão configurados corretamente
- Certifique-se de que os dados foram carregados corretamente
- Clique em "Recalcular Análise" após alterar parâmetros

## 📞 Próximos Passos

Após analisar os resultados:

1. **Se a recomendação for Comprar**:
   - Analise se você tem energia para continuar como empresário
   - Considere o estresse vs receita líquida
   - Verifique se o fluxo de caixa suporta as prestações

2. **Se a recomendação for Vender**:
   - Calcule quanto tempo levaria para ter renda passiva suficiente
   - Considere trabalhar na área sem ser empresário
   - Avalie a tranquilidade financeira vs crescimento empresarial

3. **Em qualquer caso**:
   - Consulte um contador/advogado antes de tomar decisões
   - Analise o mercado imobiliário local
   - Considere o momento econômico
   - Pese fatores pessoais (estresse, família, objetivos)

## 💡 Dicas

- Use os gráficos para visualizar tendências
- Compare diferentes cenários de investimento
- Ajuste os parâmetros para ver diferentes resultados
- Exporte os dados se necessário (funcionalidade futura)

