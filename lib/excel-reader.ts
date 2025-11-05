import * as XLSX from 'xlsx';
import { FinancialRecord, YearlySummary } from './types';

export async function readExcelFile(file: File): Promise<FinancialRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let workbook;
        try {
          workbook = XLSX.read(data, { type: 'binary' });
        } catch (readError: any) {
          if (readError.message && readError.message.includes('password-protected')) {
            throw new Error(`Arquivo ${file.name} está protegido por senha. Remova a senha para processar.`);
          }
          throw readError;
        }
        const records: FinancialRecord[] = [];
        
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          
          jsonData.forEach((row: any) => {
            // Tentar diferentes formatos de colunas comuns
            const dateStr = row.Data || row.Date || row['Data'] || row['DATE'] || row.data || row.date ||
                           row.DATA || row.DT || row.dt || row['DT'] || row['DT_VENDA'] || row['DT_VENDA'] ||
                           row['Data Venda'] || row['Data de Venda'] || row['Data da Venda'];
            
            const revenueStr = row.Receita || row.Revenue || row['Receita'] || row['REVENUE'] || 
                              row.Valor || row.Value || row['Valor'] || row['VALUE'] ||
                              row.receita || row.revenue || row.valor || row.value ||
                              row['VL_RECEITA'] || row['VL_RECEITA'] || row['VL_TOTAL'] || row['VL_TOTAL'] ||
                              row['Valor Total'] || row['Valor da Venda'] || row['Total'] || row['TOTAL'];
            
            if (dateStr && revenueStr) {
              // Tentar diferentes formatos de data
              let date: Date | null = null;
              
              // Tentar como string de data
              date = new Date(dateStr);
              
              // Se falhar, tentar como número (Excel date serial)
              if (isNaN(date.getTime())) {
                const excelDate = parseFloat(dateStr);
                if (!isNaN(excelDate) && excelDate > 0) {
                  // Excel date serial number (dias desde 1900-01-01)
                  const epoch = new Date(1899, 11, 30);
                  const days = excelDate;
                  date = new Date(epoch.getTime() + days * 86400000);
                }
              }
              
              if (date && !isNaN(date.getTime())) {
                // Limpar e converter valor
                let revenueValue = String(revenueStr).replace(/[^\d.,-]/g, '');
                revenueValue = revenueValue.replace(',', '.');
                const revenue = parseFloat(revenueValue);
                
                if (!isNaN(revenue) && revenue > 0) {
                  records.push({
                    date: date.toISOString(),
                    revenue,
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                  });
                }
              }
            }
          });
        });
        
        resolve(records);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}

export async function readMultipleExcelFiles(files: File[]): Promise<FinancialRecord[]> {
  const allRecords: FinancialRecord[] = [];
  
  for (const file of files) {
    try {
      const records = await readExcelFile(file);
      allRecords.push(...records);
    } catch (error) {
      console.error(`Error reading file ${file.name}:`, error);
    }
  }
  
  return allRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function aggregateYearlyData(records: FinancialRecord[]): YearlySummary[] {
  const yearlyData = new Map<number, { total: number; count: number }>();
  
  records.forEach((record) => {
    const existing = yearlyData.get(record.year) || { total: 0, count: 0 };
    yearlyData.set(record.year, {
      total: existing.total + record.revenue,
      count: existing.count + 1,
    });
  });
  
  const summaries: YearlySummary[] = [];
  let previousYearRevenue = 0;
  
  Array.from(yearlyData.entries())
    .sort((a, b) => a[0] - b[0])
    .forEach(([year, data]) => {
      const averageMonthly = data.count > 0 ? data.total / data.count : 0;
      const growthRate = previousYearRevenue > 0 
        ? ((data.total - previousYearRevenue) / previousYearRevenue) * 100 
        : undefined;
      
      summaries.push({
        year,
        totalRevenue: data.total,
        averageMonthlyRevenue: averageMonthly,
        growthRate,
        months: data.count,
      });
      
      previousYearRevenue = data.total;
    });
  
  return summaries;
}

