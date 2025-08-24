// Basic security helpers: CSRF token generation & HTML escaping (for defensive rendering)

export function generateCsrfToken(): string {
  // 32 random bytes -> hex
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback (Node.js / server) using randomUUID
  return globalThis.crypto?.randomUUID?.().replace(/-/g, '') || Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
