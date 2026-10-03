export const CONSENT_KEY = "pd_cookie_consent";
export const CONSENT_EVENT = "pd-consent-change";

export interface CookieConsent {
  analytics: boolean;
  date: string;
}

declare global {
  interface Window {
    __loadTracking?: () => void;
    __trackingLoaded?: boolean;
    gtag?: (...args: unknown[]) => void;
  }
}

export function getConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
}

function clearGoogleCookies() {
  const host = window.location.hostname;
  const domains = ["", host, "." + host, "." + host.replace(/^www\./, "")];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (/^(_ga|_gid|_gat|_gcl|_fbp|_fbc)/.test(name)) {
      domains.forEach((d) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
      });
    }
  });
}

export function setConsent(analytics: boolean) {
  const wasLoaded = !!window.__trackingLoaded;
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics, date: new Date().toISOString() }));
  window.dispatchEvent(new Event(CONSENT_EVENT));

  if (analytics) {
    window.__loadTracking?.();
  } else {
    window.gtag?.("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    clearGoogleCookies();
    // Already-loaded scripts can't be unloaded; reload so they are gone.
    if (wasLoaded) window.location.reload();
  }
}

export function resetConsent() {
  localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
