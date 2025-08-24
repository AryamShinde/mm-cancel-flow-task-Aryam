import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/users -> returns list of user emails (dev/testing only)
export async function GET() {
  if (!supabaseAdmin) return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  try {
    const { data, error } = await supabaseAdmin.from('users').select('email').order('email');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ users: data?.map(u => u.email) || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 });
  }
}
