"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface OfferDeclinedProps {
  onBack: () => void;
  onClose: () => void;
  onContinue: (answers: Record<string, string | null>) => void; // proceed
  onAccept: () => void; // user reconsiders and accepts discount
}

const BRAND = '#bebedaff';
const ACTIVE_PILL = '#8952fc';
const CONTINUE_READY = '#d92d20';

const OfferDeclined: React.FC<OfferDeclinedProps> = ({ onBack, onClose, onContinue, onAccept }) => {
  const [answers, setAnswers] = useState<Record<string, string | null>>({
    rolesApplied: null,
    companiesEmailed: null,
    companiesInterviewed: null,
  });

  const canContinue =
    answers.rolesApplied && answers.companiesEmailed && answers.companiesInterviewed;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
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
          <div className="text-center text-[15px] font-medium text-gray-800">Subscription Cancellation</div>
          <div className="flex items-center gap-2">
            {/* Completed step */}
            <span className="h-2 w-7 rounded-full bg-green-500" />
            {/* Current step */}
            <span className="h-2 w-7 rounded-full" style={{ backgroundColor: BRAND }} />
            {/* Upcoming step */}
            <span className="h-2 w-7 rounded-full border border-gray-300 bg-white" />
            <span className="ml-2 text-[13px] text-gray-600">Step 2 of 3</span>
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

      <div className="grid items-start gap-5 px-5 py-5 md:grid-cols-[1.55fr_1fr] md:gap-7 xl:grid-cols-[1.7fr_1fr] xl:gap-7">
        {/* LEFT */}
        <div className="flex flex-col">
          <div className="space-y-6">
            <h1 className="font-semibold leading-tight text-gray-900 text-[clamp(28px,3.2vw,38px)]">
              Help us understand how you were using Migrate Mate.
            </h1>

            <div className="space-y-6">
              <Metric
                label={<span>How many roles did you <Underline>apply</Underline> for through Migrate Mate?</span>}
              >
                <FourUp>
                  {['0', '1 – 5', '6 – 20', '20+'].map(v => (
                    <Pill
                      key={v}
                      selected={answers.rolesApplied === v}
                      onClick={() => setAnswers(a => ({ ...a, rolesApplied: v }))}
                    >
                      {v}
                    </Pill>
                  ))}
                </FourUp>
              </Metric>

              <Metric
                label={<span>How many companies did you <Underline>email</Underline> directly?</span>}
              >
                <FourUp>
                  {['0', '1–5', '6–20', '20+'].map(v => (
                    <Pill
                      key={v}
                      selected={answers.companiesEmailed === v}
                      onClick={() => setAnswers(a => ({ ...a, companiesEmailed: v }))}
                    >
                      {v}
                    </Pill>
                  ))}
                </FourUp>
              </Metric>

              <Metric
                label={<span>How many different companies did you <Underline>interview</Underline> with?</span>}
              >
                <FourUp>
                  {['0', '1–2', '3–5', '5+'].map(v => (
                    <Pill
                      key={v}
                      selected={answers.companiesInterviewed === v}
                      onClick={() => setAnswers(a => ({ ...a, companiesInterviewed: v }))}
                    >
                      {v}
                    </Pill>
                  ))}
                </FourUp>
              </Metric>
            </div>

            <hr className="border-gray-200" />

            {/* Re-offer discount */}
            <button
              onClick={onAccept}
              className="w-full rounded-md bg-green-500 px-6 py-3 text-[15px] font-medium text-white shadow-sm transition hover:bg-green-600"
            >
              Get 50% off | $12.50 <span className="line-through text-gray-200 ml-1">$25</span>
            </button>

            <button
              onClick={() => canContinue && onContinue(answers)}
              disabled={!canContinue}
              className={[
                'w-full rounded-lg px-6 py-3.5 text-center text-[15px] font-medium transition',
                canContinue ? 'text-white' : 'cursor-not-allowed bg-gray-100 text-gray-400',
              ].join(' ')}
              style={{ backgroundColor: canContinue ? CONTINUE_READY : undefined }}
            >
              Continue
            </button>
          </div>
        </div>
  {/* RIGHT image (hidden on mobile) */}
  <div className="hidden md:flex md:pl-2 self-stretch">
          <div className="relative w-full h-full overflow-hidden rounded-xl border border-gray-200 shadow-sm min-h-[240px]">
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

/* ----- UI helpers (scoped) ----- */
function Metric({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[15px] font-medium text-gray-800">{label}</div>
      {children}
    </div>
  );
}
function Underline({ children }: { children: React.ReactNode }) {
  return <span className="underline underline-offset-2">{children}</span>;
}
function FourUp({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">{children}</div>;
}
function Pill({ selected, onClick, children }: { selected?: boolean; onClick?: () => void; children: React.ReactNode }) {
  const bg = selected ? ACTIVE_PILL : 'rgb(243 244 246)';
  const color = selected ? '#fff' : '#1f2937';
  return (
    <button
      onClick={onClick}
      className="h-11 w-full rounded-md border text-[15px] text-center transition-colors"
      style={{ backgroundColor: bg, borderColor: selected ? ACTIVE_PILL : '#e5e7eb', color }}
      onMouseEnter={e => {
        if (!selected) {
          (e.currentTarget.style.backgroundColor as any) = '#a074ff';
          (e.currentTarget.style.borderColor as any) = '#a074ff';
          (e.currentTarget.style.color as any) = '#ffffff';
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          (e.currentTarget.style.backgroundColor as any) = bg;
          (e.currentTarget.style.borderColor as any) = '#e5e7eb';
          (e.currentTarget.style.color as any) = color;
        }
      }}
    >
      {children}
    </button>
  );
}

export default OfferDeclined;
