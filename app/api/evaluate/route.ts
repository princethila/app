import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';


const DATA_ROOT = path.join(process.cwd(), '../data/raw_judgements'); 

export async function GET() {
//   console.log("--- DEBUG START ---");
//   console.log("Current Directory:", process.cwd());

  try {
    const courts = await fs.readdir(DATA_ROOT);
    if (!courts || courts.length === 0) {
      return NextResponse.json({ error: 'no courts found' }, { status: 404 });
    }

    const court = courts[Math.floor(Math.random() * courts.length)];

    const years = await fs.readdir(path.join(DATA_ROOT, court));
    if (!years || years.length === 0) {
      return NextResponse.json({ error: 'no years found for court' }, { status: 404 });
    }

    const year = years[Math.floor(Math.random() * years.length)];

    const files = await fs.readdir(path.join(DATA_ROOT, court, year));
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'no files found for court/year' }, { status: 404 });
    }

    const idx = Math.floor(Math.random() * files.length);
    const chosen = files[idx];

    const filePath = path.join(DATA_ROOT, court, year, chosen);
    const raw = await fs.readFile(filePath, 'utf-8');
    let content: any;
    try {
      content = JSON.parse(raw);
    } catch (e) {
      content = raw;
    }

    console.log(`Fetched file: ${filePath}`);

    return NextResponse.json({
      fileName: chosen,
      relPath: `${court}/${year}/${chosen}`,
      content,
    });
  } catch (err) {
    console.error('GET /api/evaluate error', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
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