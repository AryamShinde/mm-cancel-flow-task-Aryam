"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface OfferDeclinedReasonProps {
  showDiscount?: boolean; // only variant B
  onBack: () => void;
  onClose: () => void;
  onAccept: () => void; // accept discount after seeing reason screen
  onComplete: (reason: string) => void; // proceed to visa / completion
}

const BRAND = '#bebedaff';

type ReasonKey = 'price' | 'helpful' | 'relevance' | 'notMove' | 'other';

const REASONS: { key: ReasonKey; label: string }[] = [
  { key: 'price', label: 'Too expensive' },
  { key: 'helpful', label: 'Platform not helpful' },
  { key: 'relevance', label: 'Not enough relevant jobs' },
  { key: 'notMove', label: 'Decided not to move' },
  { key: 'other', label: 'Other' },
];

const OfferDeclinedReason: React.FC<OfferDeclinedReasonProps> = ({ showDiscount, onBack, onClose, onAccept, onComplete }) => {
  const [selected, setSelected] = useState<ReasonKey | null>(null);
  const [detail, setDetail] = useState('');
  const [attempted, setAttempted] = useState(false);

  // Back behavior: if a reason chosen, clear it, else go to previous step
  const handleBack = () => {
    if (selected) {
      setSelected(null);
      setDetail('');
      setAttempted(false);
    } else {
      onBack();
    }
  };

  const needsTextArea = selected && selected !== 'price';
  const needsPrice = selected === 'price';
  const minChars = 25;
  const detailValid = needsPrice ? detail.trim().length > 0 : needsTextArea ? detail.trim().length >= minChars : !!selected;
  const showValidation = attempted && !detailValid;

  const reasonPrompt: Record<ReasonKey, string> = {
    price: 'What would be the maximum you would be willing to pay?*',
    helpful: 'What can we change to make the platform more helpful?*',
    relevance: 'In which way can we make the jobs more relevant?*',
    notMove: 'What changed for you to decide not to move?*',
    other: 'What would have helped you the most?*',
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <button
          onClick={handleBack}
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
            <span className="h-2 w-7 rounded-full bg-green-500" />
            <span className="h-2 w-7 rounded-full bg-green-500" />
            <span className="h-2 w-7 rounded-full" style={{ backgroundColor: BRAND }} />
            <span className="ml-2 text-[13px] text-gray-600">Step 3 of 3</span>
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
          <div className="space-y-5">
            <h1 className="font-semibold leading-tight text-gray-900 text-[clamp(26px,3vw,40px)]">
              What’s the main
              <br />reason?
            </h1>
            <p className="text-[14px] text-gray-700">Please take a minute to let us know why:</p>
            {/* Reason list OR detail form */}
            {!selected && (
              <div className="space-y-3 pt-1">
                {REASONS.map(r => (
                  <button
                    key={r.key}
                    onClick={() => setSelected(r.key)}
                    className="flex w-full items-center justify-start gap-3 rounded-lg border border-gray-200 px-4 py-3 text-left text-[14px] font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    <span className="inline-block h-4 w-4 rounded-full border border-gray-400" />
                    {r.label}
                  </button>
                ))}
                {showValidation && (
                  <p className="text-[13px] font-medium text-red-600 leading-relaxed">
                    Please select a reason to continue*
                  </p>
                )}
              </div>
            )}

            {selected && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full border border-gray-600 text-gray-700">
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                  </div>
                  <div className="text-[15px] font-medium text-gray-900">
                    {REASONS.find(r => r.key === selected)?.label}
                  </div>
                </div>
                <div className="text-[14px] font-medium text-gray-800">
                  {reasonPrompt[selected]}
                </div>
                {needsPrice && (
                  <div>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={detail}
                        onChange={e => setDetail(e.target.value.replace(/[^0-9.]/g,''))}
                        className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-3 text-gray-900 focus:border-[#8952fc] focus:ring-1 focus:ring-[#8952fc] outline-none"
                        placeholder="0"
                      />
                    </div>
                    {showValidation && !detailValid && (
                      <p className="mt-2 text-[12px] font-medium text-red-600">Please enter an amount.</p>
                    )}
                  </div>
                )}
                {needsTextArea && (
                  <div>
                    {showValidation && !detailValid && (
                      <p className="text-[13px] font-medium text-red-600 leading-relaxed mb-2">
                        Please enter at least {minChars} characters so we can understand your feedback*
                      </p>
                    )}
                    <textarea
                      value={detail}
                      onChange={e => setDetail(e.target.value)}
                      rows={5}
                      className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-[#8952fc] focus:ring-1 focus:ring-[#8952fc] outline-none"
                      placeholder="Type your feedback here..."
                    />
                    <div className="mt-1 text-right text-[11px] text-gray-500">Min {minChars} characters ({detail.trim().length}/{minChars})</div>
                  </div>
                )}
              </div>
            )}
            <hr className="border-gray-200" />
            {showDiscount && (
              <button
                onClick={onAccept}
                className="w-full rounded-md bg-green-500 px-6 py-3 text-[15px] font-medium text-white shadow-sm transition hover:bg-green-600"
              >
                Get $10 off | $15 <span className="line-through text-gray-200 ml-1">$25</span>
              </button>
            )}
            <button
              onClick={() => {
                if (!selected) {
                  setAttempted(true);
                  return;
                }
                if (!detailValid) {
                  setAttempted(true);
                  return;
                }
                const label = REASONS.find(r => r.key === selected)?.label || selected;
                const payload = detail ? `${label}: ${detail.trim()}` : label;
                onComplete(payload);
              }}
              className={[
                'w-full rounded-lg px-6 py-3.5 text-center text-[15px] font-medium transition',
                detailValid ? 'text-white' : 'bg-gray-100 text-gray-400',
              ].join(' ')}
              style={{ backgroundColor: detailValid ? '#d92d20' : undefined }}
            >
              Complete cancellation
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

export default OfferDeclinedReason;
