import type { ReplacementMap } from './types.js'

export function sanitizeText(content: string, replacements: ReplacementMap): string {
  let sanitized = content
  const entries = Object.entries(replacements).sort((a, b) => b[0].length - a[0].length)
  for (const [original, replacement] of entries) {
    sanitized = sanitized.split(original).join(replacement)
  }
  return sanitized
}

export function createNetworkStub(): string {
  return `
const demoSafeBlocked = (name) => (...args) => {
  console.warn('[demo-safe] blocked network call:', name, args[0]);
  return Promise.resolve({ ok: true, status: 200, json: async () => ({}), text: async () => '' });
};
window.fetch = demoSafeBlocked('fetch');
window.XMLHttpRequest = class DemoSafeXHR { open() {} send() {} setRequestHeader() {} abort() {} };
window.WebSocket = class DemoSafeWebSocket { constructor(url) { console.warn('[demo-safe] blocked WebSocket:', url); } close() {} send() {} };
window.EventSource = class DemoSafeEventSource { constructor(url) { console.warn('[demo-safe] blocked EventSource:', url); } close() {} };
navigator.sendBeacon = (...args) => { console.warn('[demo-safe] blocked sendBeacon:', args[0]); return true; };
`.trim()
}
