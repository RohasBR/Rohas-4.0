import { NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import * as XLSX from 'xlsx';
import { readExcelWithPassword } from '@/lib/excel-password-reader';

export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'data');
    const files = await readdir(dataDir);
    
    const excelFiles = files.filter(file => 
      file.endsWith('.xlsx') || file.endsWith('.xls')
    );
    
    const allRecords: any[] = [];
    
    for (const fileName of excelFiles) {
      try {
        const filePath = join(dataDir, fileName);
        
        // Tentar primeiro com ExcelJS (suporta senha)
        try {
          const records = await readExcelWithPassword(filePath);
          allRecords.push(...records);
          console.log(`Processado com senha: ${fileName} - ${records.length} registros`);
        } catch (excelJSError: any) {
          // Se falhar, tentar com XLSX (sem senha)
          console.log(`Tentando abrir ${fileName} sem senha...`);
          try {
            const fileBuffer = await readFile(filePath);
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            
            workbook.SheetNames.forEach((sheetName) => {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
              
              jsonData.forEach((row: any) => {
                // Tentar diferentes formatos de colunas comuns
                const dateStr = row.Data || row.Date || row['Data'] || row['DATE'] || row.data || row.date ||
                               row.DATA || row.DT || row.dt || row['DT'] || row['DT_VENDA'] ||
                               row['Data Venda'] || row['Data de Venda'] || row['Data da Venda'];
                
                const revenueStr = row.Receita || row.Revenue || row['Receita'] || row['REVENUE'] || 
                                  row.Valor || row.Value || row['Valor'] || row['VALUE'] ||
                                  row.receita || row.revenue || row.valor || row.value ||
                                  row['VL_RECEITA'] || row['VL_TOTAL'] ||
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
                      allRecords.push({
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
            console.log(`Processado sem senha: ${fileName}`);
          } catch (xlsxError: any) {
            console.error(`Erro ao processar ${fileName}:`, xlsxError.message);
          }
        }
      } catch (error: any) {
        console.error(`Error processing file ${fileName}:`, error);
      }
    }
    
    // Ordenar por data
    allRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return NextResponse.json({ 
      records: allRecords,
      filesProcessed: excelFiles.length,
      totalRecords: allRecords.length,
      message: allRecords.length === 0 
        ? 'Nenhum dado encontrado. Verifique se os arquivos não estão protegidos por senha.'
        : undefined
    });
  } catch (error) {
    console.error('Error processing data files:', error);
    return NextResponse.json(
      { error: 'Erro ao processar arquivos', records: [] },
      { status: 500 }
    );
  }
}

