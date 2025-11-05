import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'data');
    const files = await readdir(dataDir);
    
    const excelFiles = files
      .filter(file => file.endsWith('.xlsx') || file.endsWith('.xls'))
      .map(file => ({
        name: file,
        path: join(dataDir, file),
      }));
    
    return NextResponse.json({ files: excelFiles });
  } catch (error) {
    console.error('Error reading data directory:', error);
    return NextResponse.json({ files: [] }, { status: 500 });
  }
}

