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
    const [isEditing, setIsEditing] = useState(false);

    const formatCurrency = (val: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val);
    };

    useEffect(() => {
      // Formatar valor inicial apenas se não estiver editando
      if (!isEditing && value !== undefined && value !== null) {
        const formatted = formatCurrency(value);
        setDisplayValue(formatted);
      }
    }, [value, isEditing]);

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
      setIsEditing(true);
      
      // Se estiver vazio, permite
      if (inputValue === '' || inputValue === 'R$' || inputValue.trim() === '') {
        setDisplayValue('');
        onValueChange(0);
        return;
      }

      // Remove formatação para calcular
      const numericValue = parseCurrency(inputValue);
      
      // Atualiza o valor numérico
      onValueChange(numericValue);
      
      // Durante a edição, mostra apenas o número formatado (sem R$)
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
      setIsEditing(true);
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
      setIsEditing(false);
      // Ao perder o foco, formata com R$
      const numericValue = value || 0;
      setDisplayValue(formatCurrency(numericValue));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Valida ao pressionar Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur(); // Força o blur que vai formatar
        // Opcional: avança para o próximo campo
        const form = e.currentTarget.form;
        if (form) {
          const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
          const currentIndex = inputs.indexOf(e.currentTarget);
          const nextInput = inputs[currentIndex + 1] as HTMLElement;
          if (nextInput) {
            nextInput.focus();
          }
        }
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

