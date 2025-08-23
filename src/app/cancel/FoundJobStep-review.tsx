'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const BRAND = '#0B1220';   // current step / buttons
const STEP_DONE  = '#22c55e';   // green
const STEP_TODO  = '#E5E7EB';   // light gray
const MIN_CHARS  = 25;

interface FoundJobStepReviewProps {
  onBack: () => void;
  onContinue: (review: string) => void;
}

const FoundJobStepReview: React.FC<FoundJobStepReviewProps> = ({ onBack, onContinue }) => {
  const [review, setReview] = useState('');
  const isValid = review.trim().length >= MIN_CHARS;

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
            <span className="h-2 w-7 rounded-full" style={{ backgroundColor: STEP_DONE }} />
            <span className="h-2 w-7 rounded-full" style={{ backgroundColor: BRAND }} />
            <span className="h-2 w-7 rounded-full" style={{ backgroundColor: STEP_TODO }} />
            <span className="ml-2 text-[13px] text-gray-600">Step 2 of 3</span>
          </div>
        </div>
        <div style={{ width: 40 }} /> {/* Spacer for symmetry */}
  </div>
  <div className="grid items-start gap-5 px-5 py-5 md:grid-cols-[1.55fr_1fr] md:gap-7 xl:grid-cols-[1.7fr_1fr] xl:gap-7">
        {/* Left column */}
        <div className="flex flex-col">
          <div className="space-y-5">
            <h2 className="font-semibold text-gray-900 text-[clamp(24px,2.8vw,38px)] leading-tight mb-1.5">
              What’s one thing you wish we could’ve helped you with?
            </h2>
            <div className="text-gray-700 text-[clamp(15px,1.1vw,18px)] mb-3.5">
              We’re always looking to improve, your thoughts can help us make Migrate Mate more useful for others.*
            </div>
            <div>
              <textarea
              className="w-full rounded-lg border border-gray-300 bg-white p-3.5 text-gray-900 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#8952fc] min-h-[140px]"
              placeholder="Type your feedback here..."
              value={review}
              onChange={e => setReview(e.target.value)}
              minLength={MIN_CHARS}
              maxLength={500}
            />
              <div className="text-right text-xs text-gray-500 mt-1">
                Min 25 characters ({review.length}/25)
              </div>
            </div>
            <button
              className={`mt-5 w-full rounded-lg font-semibold py-3 text-lg shadow-sm transition-colors duration-150 ${isValid ? 'bg-[#0B1220] text-white hover:bg-[#22263a]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              disabled={!isValid}
              onClick={() => isValid && onContinue(review)}
            >
              Continue
            </button>
          </div>
        </div>
        {/* Right column (image) */}
  <div className="md:pl-2 self-stretch flex">
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm min-h-[240px]">
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

export default FoundJobStepReview;
