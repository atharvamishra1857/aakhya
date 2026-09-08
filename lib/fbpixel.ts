declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

/**
 * Thin wrapper around window.fbq. Safe to call even before the Pixel
 * script has loaded (e.g. during SSR or the first render) — it just
 * no-ops until fbq exists.
 *
 * @param event    Standard Meta event name, e.g. "AddToCart", "Purchase"
 * @param params   Event parameters (value, currency, content_ids, etc.)
 * @param eventID  Optional shared ID used to deduplicate this browser-side
 *                 event against a matching server-side Conversions API
 *                 event for the same action.
 */
export function fbTrack(
  event: string,
  params?: Record<string, unknown>,
  eventID?: string,
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (eventID) {
      window.fbq("track", event, params, { eventID });
    } else {
      window.fbq("track", event, params);
    }
  }
}

export {};