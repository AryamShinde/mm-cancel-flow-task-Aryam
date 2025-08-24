import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sanitizeReason, sanitizeVisaType, sanitizeReviewFeedback } from '@/lib/validation';

// POST /api/cancellations
// Body: { email, downsell_variant, reason, accepted_downsell, visa_type?, visa_help?, found_job_with_mm?, review_feedback? }
// Persists cancellation & updates subscription to pending_cancellation if active.
export async function POST(request: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'supabase admin not configured' }, { status: 500 });
  try {
    const body = await request.json().catch(() => ({}));
  const { email, downsell_variant, reason, accepted_downsell, visa_type, visa_help, found_job_with_mm, review_feedback } = body as {
      email?: string;
      downsell_variant?: 'A' | 'B';
      reason?: string | null;
      accepted_downsell?: boolean;
      visa_type?: string | null;
      visa_help?: boolean | null;
      found_job_with_mm?: boolean | null;
      review_feedback?: string | null;
    };
  // Email comes from authenticated context (mock here); basic presence check only.
  const safeEmail = (email || '').trim().toLowerCase();
  if (!safeEmail) return NextResponse.json({ error: 'email required' }, { status: 400 });
    if (downsell_variant !== 'A' && downsell_variant !== 'B') return NextResponse.json({ error: 'invalid downsell_variant' }, { status: 400 });
  const safeReason = sanitizeReason(reason ?? null);
  const safeVisaType = sanitizeVisaType(visa_type ?? null);
  const safeReview = sanitizeReviewFeedback(review_feedback ?? null);

    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('id')
  .eq('email', safeEmail)
      .limit(1)
      .maybeSingle();
    if (userErr) return NextResponse.json({ error: userErr.message }, { status: 500 });
    if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 });

    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('id,status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });
    if (!sub) return NextResponse.json({ error: 'no subscription' }, { status: 404 });

  const { error: insertErr } = await supabaseAdmin
      .from('cancellations')
      .insert({
  user_id: user.id,
  subscription_id: sub.id,
  downsell_variant,
  reason: safeReason,
  accepted_downsell: !!accepted_downsell,
  visa_type: safeVisaType,
  visa_help: typeof visa_help === 'boolean' ? visa_help : null,
  found_job_with_mm: typeof found_job_with_mm === 'boolean' ? found_job_with_mm : null,
  review_feedback: safeReview
      });
    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

    if (sub.status === 'active') {
      const { error: updateErr } = await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'pending_cancellation', updated_at: new Date().toISOString() })
        .eq('id', sub.id);
      if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
