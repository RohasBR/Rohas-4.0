'use client';

import { forwardRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onValueChange: (value: number) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
      // Formatar valor inicial
      if (value !== undefined && value !== null) {
        const formatted = formatCurrency(value);
        setDisplayValue(formatted);
      }
    }, [value]);

    const formatCurrency = (val: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val);
    };

    const parseCurrency = (str: string): number => {
      // Remove tudo exceto números, vírgula e ponto
      const cleaned = str.replace(/[^\d,.-]/g, '');
      // Substitui vírgula por ponto
      const normalized = cleaned.replace(',', '.');
      // Remove pontos extras (mantém apenas o último)
      const parts = normalized.split('.');
      let result = parts[0];
      if (parts.length > 1) {
        result += '.' + parts.slice(1).join('');
      }
      return parseFloat(result) || 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Se estiver vazio, permite
      if (inputValue === '' || inputValue === 'R$') {
        setDisplayValue('');
        onValueChange(0);
        return;
      }

      // Remove formatação para calcular
      const numericValue = parseCurrency(inputValue);
      
      // Atualiza o valor numérico
      onValueChange(numericValue);
      
      // Formata para exibição (sem R$ durante a edição)
      if (numericValue > 0) {
        setDisplayValue(numericValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }));
      } else {
        setDisplayValue('');
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Ao focar, mostra apenas o número formatado (sem R$, mas com separadores)
      const numericValue = value || 0;
      if (numericValue > 0) {
        setDisplayValue(numericValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }));
      } else {
        setDisplayValue('');
      }
      // Seleciona o texto após um pequeno delay para permitir o clique
      setTimeout(() => e.target.select(), 0);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Ao perder o foco, formata com R$
      const numericValue = value || 0;
      setDisplayValue(formatCurrency(numericValue));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Valida ao pressionar Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur(); // Força o blur que vai formatar
      }
      // Valida ao pressionar Tab
      if (e.key === 'Tab') {
        e.currentTarget.blur(); // Força o blur antes de mudar de campo
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(className)}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

