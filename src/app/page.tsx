'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { mockUser } from '@/lib/mockUser';

// Remote subscription status state

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [monthlyPrice, setMonthlyPrice] = useState<number | null>(null);
  // Dynamic user selection (dev/testing): fetch list & allow switching.
  const [users, setUsers] = useState<string[]>([]);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string>(
    typeof window !== 'undefined'
      ? (localStorage.getItem('mm_selected_user_email') || mockUser.email)
      : mockUser.email
  );

  // Fetch users list once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/users');
        const j = await r.json();
        if (!cancelled && r.ok && Array.isArray(j.users)) {
          setUsers(j.users);
          // If selected email not in list, set to first
          if (j.users.length && !j.users.includes(selectedEmail)) {
            setSelectedEmail(j.users[0]);
            if (typeof window !== 'undefined') localStorage.setItem('mm_selected_user_email', j.users[0]);
          }
        }
      } catch (e) {
        console.warn('[Profile] Failed to fetch users list', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch subscription status whenever selectedEmail changes
  useEffect(() => {
    if (!selectedEmail) return;
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/subscription-status?email=${encodeURIComponent(selectedEmail)}`);
        const json = await res.json();
        if (res.ok) {
          setSubscriptionStatus(json.status);
          if (json.monthly_price != null) setMonthlyPrice(json.monthly_price / 100);
        } else {
          console.warn('Subscription status fetch error:', json.error);
          setSubscriptionStatus(json.error || 'unknown');
        }
      } catch (e) {
        console.warn('Subscription status fetch failed', e);
        setSubscriptionStatus('unknown');
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [selectedEmail]);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // New state for settings toggle
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    // Simulate sign out delay
    setTimeout(() => {
      console.log('User signed out');
      setIsSigningOut(false);
    }, 1000);
  };

  const handleClose = () => {
    console.log('Navigate to jobs');
  };

  // Always compute deterministic A/B variant when selectedEmail changes
  useEffect(() => {
    if (!selectedEmail) return;
    const KEY = 'mm_downsell_variant';
    const SALT = process.env.NEXT_PUBLIC_AB_VARIANT_SALT || 'mm_downsell_v1_salt';
    (async () => {
      try {
        const seed = selectedEmail.toLowerCase();
        const data = new TextEncoder().encode(`${SALT}|${seed}`);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const first = new Uint8Array(hash)[0];
        const variant = first < 128 ? 'A' : 'B';
        window.localStorage.setItem(KEY, variant);
        console.log('[Variant] Deterministically assigned variant:', variant, 'for seed/email:', seed);
      } catch (e) {
        console.warn('[Variant] Failed to compute variant, defaulting to A', e);
        try { window.localStorage.setItem(KEY, 'A'); } catch {}
      }
    })();
  }, [selectedEmail]);

  // Close dropdown on outside click
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [userDropdownOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header skeleton */}
            <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="h-8 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="flex space-x-3">
                  <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Profile Info skeleton */}
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="h-6 w-56 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="space-y-6">
                <div>
                  <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-36 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-4 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Support skeleton */}
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Subscription Management skeleton */}
            <div className="px-6 py-6">
              <div className="h-6 w-56 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse delay-75"></div>
                <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="sm:hidden">Profile</span>
                <span className="hidden sm:inline">My Profile</span>
              </h1>
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#8952fc] rounded-lg hover:bg-[#7b40fc] transition-colors"
                  aria-label="Back to jobs"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="sm:hidden">Jobs</span>
                  <span className="hidden sm:inline">Back to jobs</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  disabled={isSigningOut}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <div className="mt-1 text-md text-gray-900 flex items-center space-x-2 relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(o => !o)}
                    className="inline-flex items-center max-w-full truncate px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium shadow-sm"
                    title="Select test user"
                  >
                    <span className="truncate">{selectedEmail}</span>
                    <svg className={`w-4 h-4 ml-2 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute z-20 top-full mt-1 left-0 w-72 max-h-64 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                      <div className="p-2 text-xs text-gray-500">Select a seeded user (dev only)</div>
                      <ul className="divide-y divide-gray-100">
                        {users.map(u => (
                          <li key={u}>
                            <button
                              onClick={() => {
                                setSelectedEmail(u);
                                if (typeof window !== 'undefined') localStorage.setItem('mm_selected_user_email', u);
                                setUserDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-indigo-50 ${u === selectedEmail ? 'bg-indigo-50/70 font-medium' : ''}`}
                            >
                              <span className="truncate">{u}</span>
                              {u === selectedEmail && (
                                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </li>
                        ))}
                        {users.length === 0 && (
                          <li className="px-3 py-2 text-sm text-gray-500">No users found</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900">Subscription status</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {subscriptionStatus === 'active' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                        Active
                      </span>
                    )}
                    {subscriptionStatus && subscriptionStatus !== 'active' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200 capitalize">
                        {subscriptionStatus}
                      </span>
                    )}
                  </div>
                </div>

        {subscriptionStatus === 'active' && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900">Next payment</p>
                    </div>
          <p className="text-sm font-medium text-gray-900">{monthlyPrice != null ? `$${monthlyPrice}` : '-'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Support Button */}
          <div className="px-6 py-6 border-b border-gray-200">
            <button
              onClick={() => {
                console.log('Support contact clicked');
              }}
              title="Send email to support"
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#8952fc] text-white rounded-lg hover:bg-[#7b40fc] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Contact support</span>
            </button>
          </div>

          {/* Settings Toggle Button */}
          <div className="px-6 py-6">
            <button
              onClick={() => {
                setShowAdvancedSettings(!showAdvancedSettings);
                console.log('Settings toggled:', !showAdvancedSettings);
              }}
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Manage Subscription</span>
              <svg 
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${showAdvancedSettings ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Collapsible Settings Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAdvancedSettings ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        console.log('Update card clicked');
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-sm font-medium">Update payment method</span>
                    </button>
                    <button
                      onClick={() => {
                        console.log('Invoice history clicked');
                      }}
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-sm font-medium">View billing history</span>
                    </button>
                    <button
                      onClick={() => {
                        if (subscriptionStatus === 'pending_cancellation') return; // disabled
                        router.push(`/cancel?email=${encodeURIComponent(selectedEmail)}`);
                      }}
                      disabled={subscriptionStatus === 'pending_cancellation'}
                      title={subscriptionStatus === 'pending_cancellation' ? 'Cancellation is already pending' : 'Cancel subscription'}
                      className={`inline-flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-200 shadow-sm group
                        ${subscriptionStatus === 'pending_cancellation'
                          ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'}
                      `}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 transition-transform ${subscriptionStatus === 'pending_cancellation' ? '' : 'group-hover:scale-110'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-sm font-medium">Cancel Migrate Mate</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}