"use client";

import React from 'react';
import Image from 'next/image';

const BRAND = '#bebedaff';

interface DownsellStillLookingProps {
  onBack: () => void;
  onClose: () => void;
  onAccept: () => void; // user takes discount, abort cancellation
  onDecline: () => void; // continue cancellation
}

const DownsellStillLooking: React.FC<DownsellStillLookingProps> = ({ onBack, onClose, onAccept, onDecline }) => {
  return (
    <div className="flex flex-col">
      {/* Header (matches step header style) */}
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
            <span className="h-2 w-7 rounded-full" style={{ backgroundColor: BRAND }} />
            <span className="h-2 w-7 rounded-full bg-gray-300" />
            <span className="h-2 w-7 rounded-full bg-gray-300" />
            <span className="ml-2 text-[13px] text-gray-600">Step 1 of 3</span>
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
              We built this to help you land the job, this makes it a little easier.
            </h1>
            <p className="text-gray-700 text-[20px] leading-relaxed">
              We&apos;ve been there and we&apos;re here to help you.
            </p>

            {/* Offer card: flat $10 off */}
            <div className="rounded-xl border border-[#c9b5ff] bg-[#f3ebff] p-6 shadow-sm">
              <div className="text-center mb-4">
                <p className="text-[29px] font-medium text-gray-900">
                  Here&apos;s <span className="font-semibold underline underline-offset-2">$10 off</span> until you find a job.
                </p>
                <div className="mt-2 flex items-center justify-center gap-4">
                  <span className="text-[27px] font-semibold text-[#4f46e5]">$15<span className="text-[27px] font-normal text-gray-600">/month</span></span>
                  <span className="text-gray-400 line-through text-[20px]">$25/month</span>
                </div>
              </div>
              <button
                onClick={onAccept}
                className="w-full rounded-md bg-green-500 px-6 py-3 text-[18px] font-medium text-white shadow-sm transition hover:bg-green-600"
              >
                Get $10 off
              </button>
              <div className="mt-2 text-center text-[11px] text-gray-600 italic">
                Discount applies from your next billing date.
              </div>
            </div>

            {/* Decline */}
            <button
              onClick={onDecline}
              className="w-full rounded-lg border border-gray-200 bg-white px-5 py-3 text-center text-[15px] font-medium text-gray-700 transition hover:bg-gray-50"
            >
              No thanks
            </button>
          </div>
        </div>
  {/* RIGHT image (hidden on mobile) */}
  <div className="hidden self-stretch md:flex md:pl-2">
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

export default DownsellStillLooking;