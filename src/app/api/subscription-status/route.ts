import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/subscription-status?email=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'supabase admin not configured' }, { status: 500 });
  }
  try {
    // Find user by email
    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)
      .maybeSingle();
    if (userErr) return NextResponse.json({ error: userErr.message }, { status: 500 });
    if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 });

    // Get latest subscription
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('status, monthly_price')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });
    if (!sub) return NextResponse.json({ status: 'none' });

    return NextResponse.json({ status: sub.status, monthly_price: sub.monthly_price });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
