import ExcelJS from 'exceljs';
import { FinancialRecord } from './types';

const EXCEL_PASSWORD = '853211';

export async function readExcelWithPassword(
  filePath: string,
  password: string = EXCEL_PASSWORD
): Promise<FinancialRecord[]> {
  const records: FinancialRecord[] = [];
  
  try {
    const workbook = new ExcelJS.Workbook();
    
    // Tentar abrir com senha
    try {
      await workbook.xlsx.readFile(filePath, { password });
    } catch (error: any) {
      // Se falhar, tentar sem senha
      try {
        await workbook.xlsx.readFile(filePath);
      } catch (noPasswordError) {
        throw new Error(`Não foi possível abrir o arquivo: ${filePath}`);
      }
    }
    
    // Processar cada planilha
    workbook.worksheets.forEach((worksheet) => {
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Pular cabeçalho
        
        const rowData: any = {};
        row.eachCell((cell, colNumber) => {
          const header = worksheet.getRow(1).getCell(colNumber).value?.toString() || '';
          rowData[header] = cell.value;
        });
        
        // Tentar diferentes formatos de colunas
        const dateStr = rowData.Data || rowData.Date || rowData['Data'] || rowData['DATE'] || 
                       rowData.data || rowData.date || rowData.DATA || rowData.DT || 
                       rowData.dt || rowData['DT'] || rowData['DT_VENDA'] ||
                       rowData['Data Venda'] || rowData['Data de Venda'] || rowData['Data da Venda'];
        
        const revenueStr = rowData.Receita || rowData.Revenue || rowData['Receita'] || 
                          rowData['REVENUE'] || rowData.Valor || rowData.Value || 
                          rowData['Valor'] || rowData['VALUE'] || rowData.receita || 
                          rowData.revenue || rowData.valor || rowData.value ||
                          rowData['VL_RECEITA'] || rowData['VL_TOTAL'] ||
                          rowData['Valor Total'] || rowData['Valor da Venda'] || 
                          rowData['Total'] || rowData['TOTAL'];
        
        if (dateStr && revenueStr) {
          let date: Date | null = null;
          
          // Tentar diferentes formatos de data
          if (dateStr instanceof Date) {
            date = dateStr;
          } else if (typeof dateStr === 'number') {
            // Excel date serial number
            const epoch = new Date(1899, 11, 30);
            date = new Date(epoch.getTime() + dateStr * 86400000);
          } else {
            date = new Date(dateStr);
          }
          
          if (date && !isNaN(date.getTime())) {
            // Converter valor
            let revenueValue = String(revenueStr);
            
            // Se for um número diretamente
            if (typeof revenueStr === 'number') {
              revenueValue = revenueStr.toString();
            } else {
              // Limpar string
              revenueValue = revenueValue.replace(/[^\d.,-]/g, '');
              revenueValue = revenueValue.replace(',', '.');
            }
            
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
  } catch (error) {
    console.error(`Error reading Excel file ${filePath}:`, error);
    throw error;
  }
  
  return records;
}

