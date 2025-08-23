'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const BRAND = '#0B1220'; // brand dark
const ACTIVE_PILL = '#8952fc';
const CONTINUE_READY = '#d92d20';

interface FoundJobStepProps {
  onBack: () => void;
  onClose?: () => void;
  onContinue?: (answers: Record<string, string | null>) => void;
}

const FoundJobStep: React.FC<FoundJobStepProps> = ({ onBack, onClose, onContinue }) => {
  const [answers, setAnswers] = useState<Record<string, string | null>>({
    mmFound: null,
    rolesApplied: null,
    companiesEmailed: null,
    companiesInterviewed: null,
  });

  const canContinue =
    answers.mmFound &&
    answers.rolesApplied &&
    answers.companiesEmailed &&
    answers.companiesInterviewed;

  return (
    <div className="flex flex-col">
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
          <div className="text-center text-[15px] font-medium text-gray-800">
            Subscription Cancellation
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-7 rounded-full" style={{ backgroundColor: BRAND }} />
            <span className="h-2 w-7 rounded-full bg-gray-300" />
            <span className="h-2 w-7 rounded-full bg-gray-300" />
            <span className="ml-2 text-[13px] text-gray-600">Step 1 of 3</span>
          </div>
        </div>
        {/* Removed local close button for deduplication */}
        <div style={{ width: 40 }} />
      </div>

  <div className="grid items-start gap-5 px-5 py-5 md:grid-cols-[1.55fr_1fr] md:gap-7 xl:grid-cols-[1.7fr_1fr] xl:gap-7">
        {/* LEFT column fills height and pushes action bar to bottom */}
        <div className="flex flex-col">
          <div className="space-y-5">
            <h1 className="mb-2 text-[clamp(24px,3vw,34px)] font-semibold leading-snug text-gray-900">
              Congrats on the new role! <span role="img" aria-label="party">🎉</span>
            </h1>
            <p className="text-[15px] text-gray-600">
              We&apos;d love to know a bit more about your journey.
            </p>
            <div className="space-y-5">
              <Field label="Did you find this job with MigrateMate?*">
                <TwoUp>
                  <Pill
                    selected={answers.mmFound === 'Yes'}
                    onClick={() => setAnswers(a => ({ ...a, mmFound: 'Yes' }))}
                  >
                    Yes
                  </Pill>
                  <Pill
                    selected={answers.mmFound === 'No'}
                    onClick={() => setAnswers(a => ({ ...a, mmFound: 'No' }))}
                  >
                    No
                  </Pill>
                </TwoUp>
              </Field>

              <Field>
                <span className="text-[15px] font-medium text-gray-800">
                  How many roles did you <span className="underline underline-offset-2">apply</span> for through Migrate Mate?*
                </span>
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
              </Field>

              <Field>
                <span className="text-[15px] font-medium text-gray-800">
                  How many companies did you <span className="underline underline-offset-2">email</span> directly?*
                </span>
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
              </Field>

              <Field>
                <span className="text-[15px] font-medium text-gray-800">
                  How many different companies did you <span className="underline underline-offset-2">interview</span> with?*
                </span>
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
              </Field>
            </div>
          </div>

      <button
        onClick={() => canContinue && onContinue?.(answers)}
        disabled={!canContinue}
        className={[
          'mt-5 w-full rounded-lg px-6 py-3.5 text-center text-[15px] font-medium transition',
          canContinue ? 'text-white' : 'cursor-not-allowed bg-gray-100 text-gray-400',
        ].join(' ')}
        style={{ backgroundColor: canContinue ? CONTINUE_READY : undefined }}
      >
        Continue
      </button>
        </div>

        {/* RIGHT image column (unchanged) */}
        <div className="md:pl-2 flex self-stretch">
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

/* ---------- UI helpers ---------- */
function Field({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="mb-2 block text-[15px] font-medium text-gray-800">{label}</label>}
      {children}
    </div>
  );
}
function TwoUp({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}
function FourUp({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">{children}</div>;
}

/** Pills now turn purple (#8952fc) when selected, and darken on hover otherwise. */
function Pill({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const base =
    'h-11 w-full rounded-md border text-[15px] transition text-center';
  const bg = selected ? ACTIVE_PILL : 'rgb(243 244 246)';
  const color = selected ? '#fff' : '#1f2937';
  return (
    <button
      onClick={onClick}
      className={base + ' border transition-colors'}
      style={{
        backgroundColor: bg,
        borderColor: selected ? ACTIVE_PILL : '#e5e7eb',
        color,
      }}
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

export default FoundJobStep;
