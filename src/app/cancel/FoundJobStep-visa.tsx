'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

const BRAND = '#0B1220';   // current step / buttons
const STEP_DONE  = '#22c55e';   // green
const STEP_TODO  = '#E5E7EB';   // light gray

interface FoundJobStepVisaProps {
  onBack: () => void;
  onComplete: (details: { providesLawyer: boolean; visaType: string }) => void;
  /** 'Yes' if user indicated they already found a job, 'No' if not */
  foundJobAnswer?: 'Yes' | 'No';
}

const FoundJobStepVisa: React.FC<FoundJobStepVisaProps> = ({ onBack, onComplete, foundJobAnswer }) => {
  const [providesLawyer, setProvidesLawyer] = useState<boolean | null>(null);
  const [visaType, setVisaType] = useState('');
  const [visaQuery, setVisaQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const VISA_OPTIONS = useMemo(
    () => [
      'F-1 CPT | Students',
      'F-1 OPT | Students',
      'TN | Canada/Mexico',
      'H-1B | Global',
      'EB-2/EB-3 | Green Card',
      'E-3 | Australia',
      'H-1B1 | Singapore',
      'J-1 | Exchange',
      'H-1B1 | Chile'
    ],
    []
  );

  const filtered = useMemo(() => {
    if (!visaQuery.trim()) return VISA_OPTIONS;
    const q = visaQuery.toLowerCase();
    return VISA_OPTIONS.filter(o => o.toLowerCase().includes(q));
  }, [visaQuery, VISA_OPTIONS]);

  const commitSelection = useCallback((idx: number) => {
    if (idx < 0 || idx >= filtered.length) return;
    const option = filtered[idx];
    setVisaType(option);
    setVisaQuery(option);
    setOpen(false);
    setHighlightedIndex(-1);
  }, [filtered]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };
    if (open) window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);
  const isComplete = providesLawyer !== null && visaType.trim() !== '';

  const handleSelection = (value: boolean) => {
    setProvidesLawyer(value);
    // Reset visa type if selection changes, in case user goes back and forth
    setVisaType(''); 
  };

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
            <span className="h-2 w-7 rounded-full" style={{ backgroundColor: STEP_DONE }} />
            <span className="h-2 w-7 rounded-full" style={{ backgroundColor: BRAND }} />
            <span className="ml-2 text-[13px] text-gray-600">Step 3 of 3</span>
          </div>
        </div>
        <div style={{ width: 40 }} /> {/* Spacer for symmetry */}
      </div>
  <div className="grid items-start gap-5 px-5 py-5 md:grid-cols-[1.55fr_1fr] md:gap-7 xl:grid-cols-[1.7fr_1fr] xl:gap-7">
        {/* Left column */}
        <div className="flex flex-col">
          <div className="space-y-5">
            {foundJobAnswer === 'No' ? (
              <>
                <h2 className="font-semibold text-gray-900 text-[clamp(24px,2.8vw,38px)] leading-tight mb-1.5">
                  You landed the job!<br />
                  <span className="italic">That&apos;s what we live for.</span>
                </h2>
                <p className="text-gray-600 text-[18px] leading-relaxed mb-3.5 max-w-[60ch]">
                  Even if it wasn&apos;t through Migrate Mate,<br />
                  let us help get your visa sorted.
                </p>
                <div className="text-gray-500 text-[14px] mb-3.5">
                  Is your company providing an immigration lawyer to help with your visa? (If you pick No we’ll connect you with help.)
                </div>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-gray-900 text-[clamp(24px,2.8vw,38px)] leading-tight mb-1.5">
                  We helped you land the job, now let&apos;s help you secure your visa.
                </h2>
                <div className="text-gray-700 text-[clamp(15px,1.1vw,18px)] mb-3.5">
                  Is your company providing an immigration lawyer to help with your visa? (Choose No to get support.)
                </div>
              </>
            )}

            {/* Conditional UI */}
            <div className="mt-5 space-y-4">
              {providesLawyer === null ? (
                <>
                  <RadioOption label="Yes" onSelect={() => handleSelection(true)} />
                  <RadioOption label="No" onSelect={() => handleSelection(false)} />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between rounded-lg border border-[#8952fc] bg-[#f8f5ff] p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 flex items-center justify-center rounded-full bg-[#8952fc]">
                        <svg className="h-3 w-3 text-white" viewBox="0 0 16 16" fill="currentColor"><path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" /></svg>
                      </div>
                      <span className="font-medium text-gray-800">{providesLawyer ? 'Yes' : 'No'}</span>
                    </div>
                    <button onClick={() => setProvidesLawyer(null)} className="text-sm font-medium text-[#8952fc] hover:underline">Change</button>
                  </div>

                  {providesLawyer === false && (
                    <p className="text-gray-700 text-[15px] px-1">We can connect you with one of our trusted partners.</p>
                  )}
                  
                  <div className={providesLawyer === false ? '' : 'pt-2'} ref={containerRef}>
                    <label htmlFor="visa-type" className="mb-2 block text-[15px] font-medium text-gray-800">
                      {providesLawyer ? 'What visa will you be applying for?*' : 'Which visa would you like to apply for?*'}
                    </label>
                    <div className="relative">
                      <input
                        id="visa-type"
                        type="text"
                        role="combobox"
                        aria-expanded={open}
                        aria-autocomplete="list"
                        value={open ? visaQuery : visaType}
                        onFocus={() => { setOpen(true); setVisaQuery(visaType); setHighlightedIndex(-1); }}
                        onChange={(e) => { setVisaQuery(e.target.value); setOpen(true); setHighlightedIndex(0); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setOpen(false); (e.target as HTMLInputElement).blur(); return;
                          }
                          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                            setOpen(true); return;
                          }
                          if (open) {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setHighlightedIndex(i => {
                                const next = i + 1; return next >= filtered.length ? 0 : next;
                              });
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              setHighlightedIndex(i => {
                                const prev = i - 1; return prev < 0 ? filtered.length - 1 : prev;
                              });
                            } else if (e.key === 'Enter') {
                              e.preventDefault();
                              if (highlightedIndex >= 0) {
                                commitSelection(highlightedIndex);
                              } else if (filtered.length === 1) {
                                commitSelection(0);
                              }
                            }
                          }
                        }}
                        className="w-full rounded-lg border border-gray-300 p-3 pr-20 text-gray-900 focus:border-[#8952fc] focus:ring-2 focus:ring-[#8952fc]/30 focus:outline-none placeholder:text-gray-500 shadow-sm"
                        placeholder="Search visa type..."
                      />
                      {visaType && (
                        <button
                          type="button"
                          aria-label="Clear selection"
                          onClick={() => { setVisaType(''); setVisaQuery(''); setOpen(true); setHighlightedIndex(-1); }}
                          className="absolute inset-y-0 right-8 flex items-center pr-1.5 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label="Toggle visa list"
                        onClick={() => setOpen(o => !o)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      >
                        <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd"/></svg>
                      </button>
                      {open && (
                        <ul
                          role="listbox"
                          className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-gray-200 bg-white/95 backdrop-blur shadow-xl ring-1 ring-black/5 text-sm divide-y divide-gray-100"
                        >
                          {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-gray-500 select-none">No matches</li>
                          ) : filtered.map((option, idx) => {
                            const active = highlightedIndex === idx;
                            const selected = visaType === option;
                            return (
                              <li
                                key={option}
                                role="option"
                                aria-selected={selected}
                                onMouseDown={(e) => { e.preventDefault(); }}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                onClick={() => commitSelection(idx)}
                                className={`relative cursor-pointer px-4 py-2.5 flex items-start gap-2 rounded-none transition-colors ${active ? 'bg-[#f4eeff]' : 'hover:bg-[#f8f5ff]'} ${selected ? 'font-medium text-gray-900' : 'text-gray-700'}`}
                              >
                                {selected && (
                                  <span className="mt-0.5 text-[#8952fc]">
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0L3.296 9.524a1 1 0 011.42-1.42l3.025 3.024 6.54-6.539a1 1 0 011.423 0z" clipRule="evenodd" /></svg>
                                  </span>
                                )}
                                <span className="flex-1 leading-snug">{option}</span>
                              </li>
                            );
                          })}
                          {filtered.length > 0 && (
                            <li className="sticky bottom-0 bg-white/95 backdrop-blur px-4 py-2 text-[11px] text-gray-400 select-none">
                              Type to filter • Enter to select • Esc to close
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <button
            className={`mt-5 w-full rounded-lg font-semibold py-3 text-lg shadow-sm transition-colors ${isComplete ? 'bg-gray-800 text-white hover:bg-gray-900' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!isComplete}
            onClick={() => isComplete && onComplete({ providesLawyer: providesLawyer as boolean, visaType })}
          >
            Complete cancellation
          </button>
        </div>
  {/* Right column (image hidden on mobile) */}
  <div className="hidden md:flex md:pl-2 self-stretch">
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

// Helper component for radio buttons to reduce repetition
const RadioOption = ({ label, onSelect }: { label: string; onSelect: () => void }) => (
  <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-gray-300 p-4 hover:border-[#8952fc] hover:bg-[#f8f5ff]">
    <input type="radio" name="providesLawyer" className="form-radio h-5 w-5 text-[#8952fc] focus:ring-[#8952fc]" onChange={onSelect} />
    <span className="text-gray-800 font-medium">{label}</span>
  </label>
);

export default FoundJobStepVisa;
