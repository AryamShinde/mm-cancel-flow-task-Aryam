"use client";

import Image from 'next/image';
import React from 'react';

interface VisaHelpProps {
  onFinish: () => void;
  onClose: () => void;
}

// Completion screen shown when user DOES have / will have a lawyer (providesLawyer = true)
const VisaHelp: React.FC<VisaHelpProps> = ({ onFinish }) => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3.5">
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
        <div style={{ width: 40 }} />
      </div>
      {/* Body */}
      <div className="grid items-start gap-5 px-5 py-5 md:grid-cols-[1.55fr_1fr] md:gap-7 xl:grid-cols-[1.7fr_1fr] xl:gap-7">
        <div className="flex flex-col">
          <div className="space-y-5">
            <h2 className="text-[clamp(20px,2.3vw,33px)] font-semibold leading-tight tracking-normal text-gray-800 mb-1">
              Your cancellation’s all sorted, mate,<br />
              no more charges.
            </h2>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-200">
                  <Image
                    src="/mihailo-profile.jpeg"
                    alt="Mihailo Bozic"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="leading-tight">
                  <div className="text-[15px] font-medium text-gray-900">Mihailo Bozic</div>
                  <div className="text-[13px] text-gray-600">&lt;mihailo@migratemate.co&gt;</div>
                </div>
              </div>
              <div className="space-y-4 text-[18px] leading-relaxed text-gray-800">
                <p className="font-semibold text-gray-900">I’ll be reaching out soon to help with the visa side of things.</p>
                <p className="text-gray-700">We’ve got your back, whether it’s questions, paperwork, or just figuring out your options.</p>
                <p className="text-gray-700">Keep an eye on your inbox, I’ll be in touch <span className="underline underline-offset-2">shortly</span>.</p>
              </div>
            </div>
          </div>
          <button
            onClick={onFinish}
            className="mt-6 w-full rounded-lg bg-[#8952fc] px-6 py-3.5 text-center text-[15px] font-medium text-white shadow-sm transition hover:bg-[#7740eb]"
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

export default VisaHelp;