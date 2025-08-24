// Centralized input validation & sanitization helpers
// Keep logic minimal, fast, and Unicode-friendly.

export interface SanitizeOptions {
  maxLength?: number; // default 500
  allowNewlines?: boolean; // default true
}

const DEFAULT_MAX = 500;

// Remove control chars (except \n if allowed), trim, collapse whitespace, normalize, enforce length.
export function sanitizeText(value: unknown, opts: SanitizeOptions = {}): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') value = String(value);
  const { maxLength = DEFAULT_MAX, allowNewlines = true } = opts;
  // Normalize Unicode
  const str = value as string;
  let v = str.normalize('NFC');
  // Strip null bytes
  v = v.replace(/\0/g, '');
  // Remove disallowed control characters
  const ctrlPattern = allowNewlines ? /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g : /[\x00-\x1F\x7F]/g;
  v = v.replace(ctrlPattern, '');
  // Basic HTML tag neutralization (avoid storing executable markup)
  // Remove simple <script> blocks (broad, non-greedy) without using 's' flag for older targets
  v = v.replace(/<\s*script/gi, '<script').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '[removed]');
  // Collapse excessive whitespace (except keep single newlines)
  if (allowNewlines) {
    // Replace Windows newlines
    v = v.replace(/\r\n?/g, '\n');
    // Collapse 3+ newlines to double newline
    v = v.replace(/\n{3,}/g, '\n\n');
    // Collapse internal spaces/tabs
  v = v.split('\n').map((line: string) => line.replace(/[ \t]{2,}/g, ' ').trim()).join('\n');
  } else {
    v = v.replace(/\s+/g, ' ');
  }
  v = v.trim();
  if (!v) return null;
  if (v.length > maxLength) v = v.slice(0, maxLength);
  return v;
}

export function sanitizeReason(value: unknown): string | null {
  return sanitizeText(value, { maxLength: 400, allowNewlines: true });
}

export function sanitizeVisaType(value: unknown): string | null {
  return sanitizeText(value, { maxLength: 120, allowNewlines: false });
}

export function sanitizeReviewFeedback(value: unknown): string | null {
  return sanitizeText(value, { maxLength: 600, allowNewlines: true });
}

export function sanitizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return null;
  return email;
}
