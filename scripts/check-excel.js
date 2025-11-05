const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.xlsx') || f.endsWith('.xls'));

console.log(`Found ${files.length} Excel files\n`);

if (files.length > 0) {
  const firstFile = files[0];
  console.log(`Checking file: ${firstFile}\n`);
  
  const filePath = path.join(dataDir, firstFile);
  const workbook = XLSX.readFile(filePath);
  
  console.log('Sheet names:', workbook.SheetNames);
  console.log('\nFirst sheet structure:');
  
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(firstSheet, { raw: false });
  
  console.log(`Total rows: ${data.length}`);
  if (data.length > 0) {
    console.log('\nFirst row keys:', Object.keys(data[0]));
    console.log('\nFirst 3 rows:');
    data.slice(0, 3).forEach((row, i) => {
      console.log(`\nRow ${i + 1}:`);
      Object.entries(row).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
    });
  }
}

