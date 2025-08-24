'use client';

import { useState, useEffect } from 'react';
import { CancellationStep, DownsellVariant, CancellationReason } from '@/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { mockUser } from '@/lib/mockUser';

import FoundJobStep from './FoundJobStep';
import FoundJobStepReview from './FoundJobStep-review';
import FoundJobStepVisa from './FoundJobStep-visa';
import VisaNoHelp from './Visa-NoHelp';
import VisaHelp from './Visa-Help';
import DownsellStillLooking from './DownsellStillLooking';
import OfferAccepted from './OfferAccepted';
import OfferDeclined from './OfferDeclined';
import OfferDeclinedReason from './OfferDeclined-reason';
import PageEnd from './PageEnd';

export default function CancellationFlow() {
  const router = useRouter();
  // Determine active user email: query param > localStorage > mockUser
  const [activeEmail, setActiveEmail] = useState<string>(mockUser.email);
  useEffect(() => {
    // On mount: parse query param
    try {
      const params = new URLSearchParams(window.location.search);
      const qp = params.get('email');
      let chosen = qp || (typeof window !== 'undefined' ? localStorage.getItem('mm_selected_user_email') : null) || mockUser.email;
      setActiveEmail(chosen);
      if (typeof window !== 'undefined') localStorage.setItem('mm_selected_user_email', chosen);
    } catch {}
  }, []);
  const [step, setStep] = useState<CancellationStep>('initial');
  const [downsellVariant, setDownsellVariant] = useState<DownsellVariant | null>(null);
  const [reason, setReason] = useState<CancellationReason>({ foundJob: false });
  const [freeFormReason, setFreeFormReason] = useState<string>('');
  const [acceptedDownsell, setAcceptedDownsell] = useState<boolean>(false);
  const [review, setReview] = useState('');
  const [foundJobAnswers, setFoundJobAnswers] = useState<Record<string, string | null>>();
  // Stores visa step details once completed
  const [visaDetails, setVisaDetails] = useState<{ providesLawyer: boolean; visaType: string } | null>(null);
  const [cancellationLogged, setCancellationLogged] = useState(false);
  // const FORCE_VARIANT: DownsellVariant = 'B';
  const [subscriptionPriceCents, setSubscriptionPriceCents] = useState<number | null>(null);

  // Always (re)compute deterministic variant for current user email on mount / email change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
    const seed = activeEmail.toLowerCase();
        const v = await deterministicVariant(seed);
        if (cancelled) return;
        setDownsellVariant(v);
        console.log('[CancelFlow] Deterministic variant set:', v, 'seed:', seed);
      } catch (e) {
        if (!cancelled) {
          setDownsellVariant('A');
          console.warn('[CancelFlow] Variant error; default A', e);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [activeEmail]);

  // ---------------------------------------------------------------------------
  // Forcing Variant B (Testing ONLY):
  // To temporarily force all sessions into Variant B for local testing, you can
  // uncomment the block below. Remember to re-comment / remove before commit to
  // avoid skewing real experiment data.
  //
  // const FORCE_VARIANT: DownsellVariant | null = 'B';
  // useEffect(() => {
  //   if (FORCE_VARIANT) {
  //     setDownsellVariant(FORCE_VARIANT);
  //     if (typeof window !== 'undefined') {
  //       window.localStorage.setItem('mm_downsell_variant', FORCE_VARIANT);
  //     }
  //     console.log('[CancelFlow] Forced variant set to', FORCE_VARIANT);
  //   }
  // }, [FORCE_VARIANT]);
  // ---------------------------------------------------------------------------

  // Fetch subscription price (for dynamic $10 off display) once
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
    const res = await fetch(`/api/subscription-status?email=${encodeURIComponent(activeEmail)}`);
        const json = await res.json();
        if (!cancelled && res.ok && typeof json.monthly_price === 'number') {
          setSubscriptionPriceCents(json.monthly_price);
        }
      } catch (e) {
        console.warn('[CancelFlow] Failed to fetch subscription price', e);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [activeEmail]);

  // Helpers: deterministic hashing (SHA-256 first byte)
  const deterministicVariant = async (seed: string): Promise<DownsellVariant> => {
    const SALT = process.env.NEXT_PUBLIC_AB_VARIANT_SALT || 'mm_downsell_v1_salt';
    const data = new TextEncoder().encode(`${SALT}|${seed}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const first = new Uint8Array(hash)[0];
    return first < 128 ? 'A' : 'B';
  };
  const getStableUserId = async (): Promise<string | null> => null; // TODO integrate auth

  const handleClose = () => router.push('/');
  const handleFoundJobResponse = (found: boolean) => {
    setReason(prev => ({ ...prev, foundJob: found }));
    if (found) {
      setStep('foundJob');
    } else {
      // If user has NOT found a job: show downsell ONLY for variant B; variant A goes straight to offerDeclined.
      if (downsellVariant === 'A') {
        setStep('offerDeclined');
      } else {
        setStep('downsell');
      }
    }
  };

  return (
    <div className="min-h-screen z-10 flex items-start md:items-center justify-center bg-[#e5e7eb] px-3 sm:px-4 py-4 sm:py-8">
  <div className="relative w-full max-w-5xl rounded-none md:rounded-2xl bg-white shadow-none md:shadow-xl border-0 md:border md:border-gray-200 md:mx-auto md:my-0">

        <div>
          {step === 'initial' && (
            <>
              {/* Unified header (no step counter on first page) */}
              <div className="flex items-center border-b border-gray-200 px-4 sm:px-6 py-4">
                <div className="flex-1">
                  <div className="text-left md:text-center text-[15px] font-medium text-gray-800">Subscription Cancellation</div>
                </div>
                <button
                  onClick={handleClose}
                  className="ml-2 inline-flex items-center justify-center rounded p-1 text-gray-400 transition hover:text-gray-600"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Body */}
              <div className="flex flex-col md:flex-row gap-6 p-4 sm:p-5">
                {/* Image (mobile first) */}
                <div className="relative w-full md:hidden h-44 sm:h-56 overflow-hidden rounded-xl">
                  <Image
                    src="/empire-state-compressed.jpg"
                    alt="Empire State Building"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                {/* Left column / textual content */}
                <div className="flex flex-col flex-[1.7] py-1 md:pt-2">
                  <div className="space-y-4">
                    <h2 className="font-semibold leading-tight text-gray-900 text-[clamp(24px,2.4vw,34px)]">
                      Hey mate,<br />
                      <span className="font-semibold">Quick one before you go.</span>
                    </h2>
                    <p className="italic font-medium text-gray-900 text-[clamp(18px,2vw,26px)]">
                      Have you found a job yet?
                    </p>
                    <p className="text-gray-600 leading-6 text-[clamp(14px,1vw,16px)] max-w-[62ch]">
                      Whatever your answer, we just want to help you take the next step.<br />
                      With visa support, or by hearing how we can do better.
                    </p>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    <button
                      disabled={!downsellVariant}
                      onClick={() => handleFoundJobResponse(true)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-center text-[15px] md:text-[clamp(14px,1vw,16px)] font-medium text-gray-900 transition hover:border-gray-300 hover:bg-gray-50"
                    >
                      Yes, I&apos;ve found a job
                    </button>
                    <button
                      disabled={!downsellVariant}
                      onClick={() => handleFoundJobResponse(false)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-center text-[15px] md:text-[clamp(14px,1vw,16px)] font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                    >
                      Not yet – I&apos;m still looking
                    </button>
                  </div>
                </div>
                {/* Right column (image desktop) */}
                <div className="relative hidden md:flex flex-1 overflow-hidden rounded-xl">
                  <Image
                    src="/empire-state-compressed.jpg"
                    alt="Empire State Building"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1280px) 40vw, 50vw"
                  />
                </div>
              </div>
              {/* Mobile bottom gradient spacer (simulate safe area & separation) */}
              <div className="md:hidden h-4" />
            </>
          )}

          {step === 'downsell' && downsellVariant === 'B' && (
            <DownsellStillLooking
              originalPriceCents={subscriptionPriceCents || 2500}
              onBack={() => setStep('initial')}
              onClose={handleClose}
              onAccept={() => setStep('offerAccepted')}
              onDecline={() => setStep('offerDeclined')}
            />
          )}

          {step === 'foundJob' && (
            <FoundJobStep
              onBack={() => setStep('initial')}
              onContinue={(answers?: Record<string, string | null>) => {
                setFoundJobAnswers(answers);
                setStep('review');
              }}
            />
          )}

          {step === 'review' && (
            <FoundJobStepReview
              onBack={() => setStep('foundJob')}
              onContinue={r => {
                setReview(r);
                // Always route to visa step after review regardless of Yes/No, copy will adapt.
                setStep('visa');
              }}
            />
          )}

          {step === 'visa' && (
            <FoundJobStepVisa
              foundJobAnswer={foundJobAnswers?.mmFound as 'Yes' | 'No' | undefined}
              onBack={() => setStep('review')}
              onComplete={details => {
                setVisaDetails(details);
                // Persist cancellation immediately for found-job path (visa branch) if not already logged
                if (!cancellationLogged) {
      const conciseReason = `found_job: yes`;
                  (async () => {
                    try {
                      // Ensure CSRF token
                      let csrfToken: string | null = null;
                      try {
                        const r = await fetch('/api/csrf');
                        if (r.ok) {
                          const j = await r.json();
                          csrfToken = j.csrfToken;
                        }
                      } catch {}
                      const resp = await fetch('/api/cancellations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}) },
                        body: JSON.stringify({
                          email: activeEmail,
                          downsell_variant: (downsellVariant || 'A'),
                          reason: conciseReason,
        accepted_downsell: false,
        visa_type: details.visaType || null,
        visa_help: !details.providesLawyer, // user needs help if company does NOT provide lawyer
        found_job_with_mm: foundJobAnswers?.mmFound === 'Yes' ? true : (foundJobAnswers?.mmFound === 'No' ? false : null),
        review_feedback: review || null
                        })
                      });
                      const respJson = await resp.json().catch(()=>({}));
                      console.log('[CancelFlow] Cancellation API response', resp.status, respJson);
                      setCancellationLogged(true);
                      console.log('[CancelFlow] Cancellation persisted (visa path).');
                    } catch (e) {
                      console.warn('[CancelFlow] Failed to persist cancellation (visa path)', e);
                    }
                  })();
                }
                // Inverted: if user selects "No" (no company lawyer), route to visaHelp (we'll help them)
                // If "Yes" (company provides a lawyer), route to visaNoHelp (no extra help needed)
                if (!details.providesLawyer) {
                  setStep('visaHelp');
                } else {
                  setStep('visaNoHelp');
                }
              }}
            />
          )}

          {step === 'visaNoHelp' && (
            <VisaNoHelp
              onFinish={() => router.push('/')}
              onClose={handleClose}
            />
          )}
          {step === 'visaHelp' && (
            <VisaHelp
              onFinish={() => router.push('/')}
              onClose={handleClose}
            />
          )}
          {step === 'offerAccepted' && (
            <OfferAccepted
              originalPriceCents={subscriptionPriceCents || 2500}
              onFinish={() => router.push('/')}
              onClose={handleClose}
              onBack={() => setStep(downsellVariant === 'B' ? 'downsell' : 'offerDeclined')}
              // Mark accepted downsell if variant B path leads here
              // (If variant B and they reached offerAccepted, treat as accepted)
              {...(downsellVariant === 'B' ? { } : {})}
            />
          )}
          {step === 'offerDeclined' && (
            <OfferDeclined
              showDiscount={downsellVariant === 'B'}
              originalPriceCents={subscriptionPriceCents || 2500}
              onBack={() => setStep('initial')}
              onClose={handleClose}
              onAccept={() => setStep('offerAccepted')}
              onContinue={(answers) => {
                setFoundJobAnswers(answers);
                setStep('offerDeclinedReason');
              }}
            />
          )}
          {step === 'offerDeclinedReason' && (
            <OfferDeclinedReason
              showDiscount={downsellVariant === 'B'}
              originalPriceCents={subscriptionPriceCents || 2500}
              onBack={() => setStep('offerDeclined')}
              onClose={handleClose}
              onAccept={() => setStep('offerAccepted')}
              onComplete={(reasonText) => {
                setReview(reasonText);
                setFreeFormReason(reasonText);
                setStep('pageEnd');
              }}
            />
          )}
          {step === 'pageEnd' && (
            <PageEnd
              userEmail={activeEmail}
              reasonText={freeFormReason}
              downsellVariant={downsellVariant || 'A'}
              acceptedDownsell={acceptedDownsell}
              onBack={() => setStep('offerDeclinedReason')}
              onClose={handleClose}
              onFinish={() => router.push('/')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Stubs
const checkExistingVariant = async (): Promise<DownsellVariant | null> => null;
const persistDownsellVariant = async (_: DownsellVariant): Promise<void> => {};
