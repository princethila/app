import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';




export async function GET() {
  // 1. FORCE THE PATH: process.cwd() is the root of your project on Vercel
  const DATA_ROOT = path.join(process.cwd(),'public', 'data', 'raw_judgements');

  try {
    // Check if the directory exists before reading
    try {
      await fs.access(DATA_ROOT);
    } catch {
      return NextResponse.json({ error: `Directory not found at ${DATA_ROOT}` }, { status: 404 });
    }

    // 2. Get Courts
    const allCourts = await fs.readdir(DATA_ROOT);
    const courts = allCourts.filter(f => !f.startsWith('.')); // Ignore .DS_Store
    if (!courts || courts.length === 0) {
      return NextResponse.json({ error: 'no courts found' }, { status: 404 });
    }
    const court = courts[Math.floor(Math.random() * courts.length)];

    // 3. Get Years
    const courtPath = path.join(DATA_ROOT, court);
    const allYears = await fs.readdir(courtPath);
    const years = allYears.filter(f => !f.startsWith('.'));
    if (!years || years.length === 0) {
      return NextResponse.json({ error: 'no years found' }, { status: 404 });
    }
    const year = years[Math.floor(Math.random() * years.length)];

    // 4. Get Files
    const yearPath = path.join(courtPath, year);
    const allFiles = await fs.readdir(yearPath);
    const files = allFiles.filter(f => f.endsWith('.json'));
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'no JSON files found' }, { status: 404 });
    }

    const idx = Math.floor(Math.random() * files.length);
    const chosen = files[idx];

    // 5. Read Content
    const filePath = path.join(yearPath, chosen);
    const raw = await fs.readFile(filePath, 'utf-8');
    
    let content;
    try {
      content = JSON.parse(raw);
    } catch (e) {
      content = { raw_text: raw }; // Fallback if not valid JSON
    }

    // For debugging in Vercel Logs
    console.log(`Successfully served: ${court}/${year}/${chosen}`);

    return NextResponse.json({
      fileName: chosen,
      relPath: `${court}/${year}/${chosen}`,
      content,
    });

  } catch (err) {
    console.error('CRITICAL_API_ERROR:', err);
    return NextResponse.json({ 
      error: (err as Error).message,
      path_attempted: DATA_ROOT 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  const { data, error } = await supabase
    .from('evaluations')
    .insert([
      { 
        user_name: body.userName, 
        file_name: body.fileName, 
        ratings: body.ratings, 
        comment: body.comment,
        session_id: body.sessionId 
      }
    ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}