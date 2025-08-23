'use client';

import { useState, useEffect } from 'react';
import { CancellationStep, DownsellVariant, CancellationReason } from '@/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const [step, setStep] = useState<CancellationStep>('initial');
  const [downsellVariant, setDownsellVariant] = useState<DownsellVariant | null>(null);
  const [reason, setReason] = useState<CancellationReason>({ foundJob: false });
  const [review, setReview] = useState('');
  const [foundJobAnswers, setFoundJobAnswers] = useState<Record<string, string | null>>();
  // Stores visa step details once completed
  const [visaDetails, setVisaDetails] = useState<{ providesLawyer: boolean; visaType: string } | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const existing = await checkExistingVariant();
        if (existing) return setDownsellVariant(existing);
        const a = new Uint8Array(1);
        crypto.getRandomValues(a);
        const v: DownsellVariant = a[0] < 128 ? 'A' : 'B';
        setDownsellVariant(v);
        await persistDownsellVariant(v);
      } catch {
        setDownsellVariant('A');
      }
    };
    if (!downsellVariant) run();
  }, [downsellVariant]);

  const handleClose = () => router.push('/');
  const handleFoundJobResponse = (found: boolean) => {
    setReason(prev => ({ ...prev, foundJob: found }));
    // If user has NOT found a job, show downsell first. Otherwise go to detailed job questions.
    setStep(found ? 'foundJob' : 'downsell');
  };

  return (
    <div className="min-h-screen z-10 flex items-center justify-center bg-[#e5e7eb] px-4 py-8">
  <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-xl border border-gray-200">

        <div>
          {step === 'initial' && (
            <>
              {/* Unified header (no step counter on first page) */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div style={{ width: 40 }} />
                <div className="text-center text-[15px] font-medium text-gray-800">Subscription Cancellation</div>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center justify-center rounded p-1 text-gray-400 transition hover:text-gray-600"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Body */}
              <div className="flex gap-6 p-5">
                {/* Left column */}
                <div className="flex flex-col flex-[1.7] py-1">
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
                      onClick={() => handleFoundJobResponse(true)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-center text-[clamp(14px,1vw,16px)] font-medium text-gray-900 transition hover:border-gray-300 hover:bg-gray-50"
                    >
                      Yes, I&apos;ve found a job
                    </button>
                    <button
                      onClick={() => handleFoundJobResponse(false)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-center text-[clamp(14px,1vw,16px)] font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                    >
                      Not yet – I&apos;m still looking
                    </button>
                  </div>
                </div>
                {/* Right column (image) */}
                <div className="relative flex flex-1 overflow-hidden rounded-xl">
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
            </>
          )}

          {step === 'downsell' && (
            <DownsellStillLooking
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
              onFinish={() => router.push('/')}
              onClose={handleClose}
              onBack={() => setStep('downsell')}
            />
          )}
          {step === 'offerDeclined' && (
            <OfferDeclined
              onBack={() => setStep('downsell')}
              onClose={handleClose}
              onAccept={() => setStep('offerAccepted')}
              onContinue={(answers) => {
                setFoundJobAnswers(answers); // reuse storage if useful later
                setStep('offerDeclinedReason');
              }}
            />
          )}
          {step === 'offerDeclinedReason' && (
            <OfferDeclinedReason
              onBack={() => setStep('offerDeclined')}
              onClose={handleClose}
              onAccept={() => setStep('offerAccepted')}
              onComplete={(reasonText) => {
                setReview(reasonText);
                setStep('pageEnd');
              }}
            />
          )}
          {step === 'pageEnd' && (
            <PageEnd
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
