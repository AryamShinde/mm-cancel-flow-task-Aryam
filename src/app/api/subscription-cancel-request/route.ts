import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/subscription-cancel-request { email }
// Marks the latest active/pending subscription as pending_cancellation (idempotent)
export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'supabase admin not configured' }, { status: 500 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const email: string | undefined = body.email;
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

    // Find user
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
      .select('id, status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });
    if (!sub) return NextResponse.json({ error: 'no subscription' }, { status: 404 });

    if (sub.status === 'pending_cancellation' || sub.status === 'cancelled') {
      return NextResponse.json({ status: sub.status, already: true });
    }

    // Update status to pending_cancellation
    const { error: updateErr } = await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'pending_cancellation', updated_at: new Date().toISOString() })
      .eq('id', sub.id);
    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

    return NextResponse.json({ status: 'pending_cancellation' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
