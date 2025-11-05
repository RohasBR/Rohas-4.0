'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileX, FileCheck, FolderOpen } from 'lucide-react';
import { readMultipleExcelFiles } from '@/lib/excel-reader';
import { FinancialRecord } from '@/lib/types';

interface ExcelUploaderProps {
  onFilesLoaded: (records: FinancialRecord[]) => void;
}

export function ExcelUploader({ onFilesLoaded }: ExcelUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    setError(null);
  };

  const handleLoad = async () => {
    if (files.length === 0) {
      setError('Por favor, selecione pelo menos um arquivo Excel');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const records = await readMultipleExcelFiles(files);
      if (records.length === 0) {
        setError('Nenhum dado válido encontrado nos arquivos. Verifique se os arquivos contêm colunas de Data e Receita.');
      } else {
        onFilesLoaded(records);
      }
    } catch (err) {
      setError('Erro ao ler arquivos. Verifique se são arquivos Excel válidos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadDefaultFiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/process-data');
      const data = await response.json();
      
      if (!response.ok || !data.records || data.records.length === 0) {
        setError('Nenhum dado válido encontrado nos arquivos padrão. Verifique se os arquivos estão na pasta data.');
        return;
      }
      
      onFilesLoaded(data.records);
    } catch (err) {
      setError('Erro ao carregar arquivos padrão. Verifique se os arquivos estão na pasta data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carregar Arquivos Excel</CardTitle>
        <CardDescription>
          Selecione os arquivos de faturamento da Decola Eventos para análise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="excel-files">Arquivos Excel</Label>
          <Input
            id="excel-files"
            type="file"
            accept=".xlsx,.xls"
            multiple
            onChange={handleFileSelect}
            ref={fileInputRef}
            disabled={isLoading}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Arquivos selecionados:</p>
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm"
                >
                  <FileCheck className="h-4 w-4 text-green-600" />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex gap-2">
            <Button onClick={handleLoad} disabled={isLoading || files.length === 0}>
              <Upload className="mr-2 h-4 w-4" />
              {isLoading ? 'Carregando...' : 'Carregar e Analisar'}
            </Button>
            {files.length > 0 && (
              <Button variant="outline" onClick={handleClear} disabled={isLoading}>
                <FileX className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLoadDefaultFiles} 
            disabled={isLoading}
            className="w-full"
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            {isLoading ? 'Carregando...' : 'Carregar Arquivos Padrão (Pasta Data)'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

