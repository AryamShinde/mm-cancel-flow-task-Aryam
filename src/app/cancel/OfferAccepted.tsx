"use client";

import React from 'react';
import Image from 'next/image';

interface OfferAcceptedProps {
  originalPriceCents: number;
  onFinish: () => void;
  onClose: () => void;
  onBack: () => void; // optional back to downsell if desired
}

const OfferAccepted: React.FC<OfferAcceptedProps> = ({ originalPriceCents, onFinish, onClose, onBack }) => {
  const discounted = Math.max(originalPriceCents - 1000, 0);
  const fmt = (c: number) => `$${(c/100).toFixed(c % 100 === 0 ? 0 : 2)}`;
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
        <div className="text-center text-[15px] font-medium text-gray-800">Subscription continued</div>
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
      {/* Body */}
      <div className="grid items-start gap-5 px-5 py-5 md:grid-cols-[1.55fr_1fr] md:gap-7 xl:grid-cols-[1.7fr_1fr] xl:gap-7">
        <div className="flex flex-col">
          <div className="space-y-6">
            <h2 className="text-[clamp(24px,2.5vw,40px)] font-semibold leading-tight text-gray-900">
              Great choice, mate!
            </h2>
            <p className="text-[clamp(18px,1.6vw,26px)] font-semibold leading-snug text-gray-900">
              You&apos;re still on the path to your dream
              <br />role. <span className="text-[#8952fc]">Let&apos;s make it happen together!</span>
            </p>
            <div className="text-[13px] leading-relaxed text-gray-800 space-y-1">
              <p>You&apos;ve got <span className="font-medium">XX days</span> left on your current plan.</p>
              <p>Starting from <span className="font-medium">XX date</span>, your monthly payment will be <span className="font-medium">{fmt(discounted)}</span> (standard {fmt(originalPriceCents)}).</p>
            </div>
            <div className="text-[11px] italic text-gray-500 pt-2">
              You can cancel anytime before then.
            </div>
          </div>
          <button
            onClick={onFinish}
            className="mt-6 w-full rounded-lg bg-[#8952fc] px-6 py-3.5 text-center text-[15px] font-medium text-white shadow-sm transition hover:bg-[#7740eb]"
          >
            Land your dream role
          </button>
        </div>
        <div className="md:pl-2 self-stretch flex">
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

export default OfferAccepted;