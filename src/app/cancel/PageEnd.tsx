"use client";

import React, { useRef } from 'react';
import Image from 'next/image';

interface PageEndProps {
  onBack: () => void; // allow user to go back to reason edit if desired
  onClose: () => void;
  onFinish: () => void; // return to jobs / home
  userEmail: string; // needed to mark subscription as pending cancellation
  reasonText: string;
  downsellVariant: 'A' | 'B';
  acceptedDownsell: boolean;
}

const PageEnd: React.FC<PageEndProps> = ({ onBack, onClose, onFinish, userEmail, reasonText, downsellVariant, acceptedDownsell }) => {
  const hasPostedRef = useRef(false);
  React.useEffect(() => {
    if (hasPostedRef.current) return; // Guard against StrictMode double-invoke
    hasPostedRef.current = true;
    let aborted = false;
    const mark = async () => {
      try {
        // Acquire CSRF token (cached in ref/localStorage if desired)
        let csrfToken: string | null = null;
        try {
          const r = await fetch('/api/csrf');
          if (r.ok) {
            const j = await r.json();
            csrfToken = j.csrfToken;
          }
  } catch {}
  const res = await fetch('/api/cancellations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          ...(csrfToken ? { headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken } } : {}),
          body: JSON.stringify({
            email: userEmail,
            downsell_variant: downsellVariant,
            reason: reasonText || null,
            accepted_downsell: acceptedDownsell,
            visa_type: null,
            visa_help: null,
            found_job_with_mm: null,
            review_feedback: reasonText || null
          })
        });
  const json = await res.json().catch(()=>({}));
  console.log('[PageEnd] cancellations POST response', res.status, json);
        if (!aborted) {
          if (!res.ok) {
            console.warn('[Cancel] Failed to persist cancellation:', json.error);
          } else {
            console.log('[Cancel] Cancellation persisted');
          }
        }
      } catch (e) {
        if (!aborted) console.warn('[Cancel] Error marking pending cancellation', e);
      }
    };
    mark();
    return () => { aborted = true; };
  }, [userEmail]);
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-[15px] text-gray-600 hover:text-gray-900"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-4">
          <div className="text-center text-[15px] font-medium text-gray-800">Subscription Cancelled</div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-7 rounded-full bg-green-500" />
            <span className="h-2 w-7 rounded-full bg-green-500" />
            <span className="h-2 w-7 rounded-full bg-green-500" />
            <span className="ml-2 text-[13px] text-gray-600">Completed</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center rounded p-1 text-gray-400 transition hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid items-start gap-6 px-6 py-6 md:grid-cols-[1.55fr_1fr] md:gap-7 xl:grid-cols-[1.7fr_1fr] xl:gap-8">
        {/* LEFT */}
        <div className="flex flex-col">
          <div className="space-y-6">
            <h2 className="text-[clamp(28px,3vw,42px)] font-semibold leading-tight tracking-tight text-gray-800">
              Sorry to see you go, mate.
            </h2>
            <p className="text-[clamp(18px,1.8vw,26px)] font-semibold leading-snug text-gray-800">
              Thanks for being with us, and you’re
              <br />always welcome back.
            </p>
            <div className="text-[14px] leading-relaxed text-gray-700 space-y-3 max-w-[60ch]">
              <p>Your subscription is set to end on <span className="font-medium">XX date</span>.<br />You’ll still have full access until then. No further charges after that.</p>
              <p>Changed your mind? You can reactivate anytime before your end date.</p>
            </div>
            <hr className="border-gray-200" />
            <button type="button"
              onClick={onFinish}
              className="w-full rounded-lg bg-[#9d77ff] px-6 py-3.5 text-center text-[15px] font-medium text-white shadow-sm transition hover:bg-[#875efb]"
            >
              Back to Jobs
            </button>
          </div>
        </div>
  {/* RIGHT image (hidden on mobile) */}
  <div className="hidden md:flex md:pl-2 self-stretch">
          <div className="relative w-full h-full overflow-hidden rounded-xl border border-gray-200 shadow-sm min-h-[260px]">
            <Image
              src="/empire-state-compressed.jpg"
              alt="Empire State Building"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEnd;
