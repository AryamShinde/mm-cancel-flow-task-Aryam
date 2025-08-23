"use client";

import Image from 'next/image';
import React from 'react';

interface VisaNoHelpProps {
  onFinish: () => void;
  onClose: () => void;
}

const VisaNoHelp: React.FC<VisaNoHelpProps> = ({ onFinish, onClose }) => {
  return (
    <div className="flex flex-col">
      {/* Header matches previous steps (center cluster with title + progress bars) */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
        {/* left spacer to balance layout since no Back button at completion */}
        <div style={{ width: 40 }} />
        <div className="flex items-center gap-4">
          <div className="text-center text-[15px] font-medium text-gray-800">Subscription Cancelled</div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-7 rounded-full bg-green-500" />
            <span className="h-2 w-7 rounded-full bg-green-500" />
            <span className="h-2 w-7 rounded-full bg-green-500" />
            <span className="ml-2 text-[13px] text-gray-600">Completed</span>
          </div>
        </div>
        {/* right spacer */}
        <div style={{ width: 40 }} />
      </div>
      {/* Body layout mirrors grid used in other steps so image displays reliably */}
      <div className="grid items-start gap-5 px-5 py-5 md:grid-cols-[1.55fr_1fr] md:gap-7 xl:grid-cols-[1.7fr_1fr] xl:gap-7">
        <div className="flex flex-col">
          <div className="space-y-4">
            <h2 className="text-[clamp(24px,2.8vw,38px)] font-semibold leading-tight text-gray-900 mb-1.5">
              All done, your cancellation&apos;s been processed.
            </h2>
            <p className="text-gray-700 text-[15px] leading-relaxed max-w-[60ch]">
              We&apos;re stoked to hear you&apos;ve landed a job and sorted your visa. Big congrats from the team. 🙌
            </p>
          </div>
          <button
            onClick={onFinish}
            className="mt-5 w-full rounded-lg bg-[#8952fc] px-6 py-3.5 text-center text-[15px] font-medium text-white shadow-sm transition hover:bg-[#7740eb]"
          >
            Finish
          </button>
        </div>
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

export default VisaNoHelp;
