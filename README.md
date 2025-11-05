# Análise Financeira - Decola Eventos

Sistema completo de análise financeira para tomada de decisão empresarial. Desenvolvido para ajudar na decisão entre comprar um imóvel via consórcio ou vender o negócio e investir em renda passiva.

## 🚀 Funcionalidades

- **Upload de Arquivos Excel**: Carregamento e análise de múltiplos arquivos Excel de faturamento
- **Análise Financeira Completa**: 
  - Receita total e média
  - Tendências de crescimento
  - Projeções futuras
  - Gráficos interativos
- **Análise de Decisão**: 
  - Comparação entre comprar via consórcio vs vender e investir
  - Cenários de investimento (conservador, moderado, arrojado)
  - Análise de risco Brasil
  - Recomendação personalizada
- **Dashboard Interativo**: Visualização de estatísticas e gráficos em tempo real

## 🛠️ Tecnologias

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Shadcn UI** - Componentes de interface
- **Recharts** - Gráficos e visualizações
- **XLSX** - Leitura de arquivos Excel
- **Tailwind CSS** - Estilização

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

## 🎯 Uso

1. **Carregar Dados**: Na aba "Carregar Dados", selecione os arquivos Excel de faturamento
2. **Configurar Parâmetros**: Ajuste os valores de:
   - Valor do imóvel
   - Investimentos atuais
   - Percentual de Crypto e Imobiliário
3. **Análise Financeira**: Veja estatísticas, gráficos e tendências na aba "Análise Financeira"
4. **Análise de Decisão**: Receba recomendações baseadas nos dados na aba "Análise de Decisão"

## 📊 Parâmetros Padrão

- **Valor do Imóvel**: R$ 3.000.000,00
- **Investimentos Atuais**: R$ 1.000.000,00
  - 60% em Crypto
  - 40% em Títulos Imobiliários
- **Consórcio**: 10 anos com juros de 12% ao ano

## 🔧 Porta

O projeto está configurado para usar uma porta diferente para evitar conflitos. Verifique a porta no console ao executar `npm run dev`.

## 📝 Notas

- Os arquivos Excel devem conter colunas de Data e Receita/Valor
- O sistema detecta automaticamente diferentes formatos de colunas
- As análises são calculadas em tempo real baseadas nos dados carregados

## 👤 Autor

Rohas - Decola Eventos
