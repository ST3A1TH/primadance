import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CookieBanner from "@/components/CookieBanner";
import { CONSENT_KEY, getConsent, setConsent, resetConsent } from "@/lib/cookie-consent";

vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/SEOHead", () => ({ default: () => null }));

import CookiePolicy from "@/pages/CookiePolicy";

const wrap = (ui: React.ReactNode, path = "/") =>
  render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </LanguageProvider>
  );

let loadTracking: ReturnType<typeof vi.fn>;
let gtag: ReturnType<typeof vi.fn>;
let reload: ReturnType<typeof vi.fn>;

beforeEach(() => {
  localStorage.clear();
  document.cookie.split(";").forEach((c) => {
    const n = c.split("=")[0].trim();
    if (n) document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
  loadTracking = vi.fn(() => { window.__trackingLoaded = true; });
  gtag = vi.fn();
  reload = vi.fn();
  window.__trackingLoaded = false;
  window.__loadTracking = loadTracking;
  window.gtag = gtag;
  Object.defineProperty(window, "location", { configurable: true, value: { ...window.location, reload, hostname: "localhost" } });
});

describe("cookie consent logic", () => {
  it("accepting loads Google tracking and stores the choice", () => {
    setConsent(true);
    expect(loadTracking).toHaveBeenCalledTimes(1);
    expect(getConsent()?.analytics).toBe(true);
  });

  it("declining never loads tracking, denies consent and clears Google cookies", () => {
    document.cookie = "_ga=GA1.1.123; path=/";
    document.cookie = "_gid=abc; path=/";
    setConsent(false);
    expect(loadTracking).not.toHaveBeenCalled();
    expect(gtag).toHaveBeenCalledWith("consent", "update", expect.objectContaining({
      analytics_storage: "denied", ad_storage: "denied",
    }));
    expect(document.cookie).not.toMatch(/_ga|_gid/);
    expect(getConsent()?.analytics).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it("declining after tracking was loaded reloads the page to unload scripts", () => {
    setConsent(true);
    setConsent(false);
    expect(reload).toHaveBeenCalled();
  });

  it("resetConsent removes the stored choice", () => {
    setConsent(true);
    resetConsent();
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();
  });
});

describe("cookie banner", () => {
  it("shows on first visit and hides after Accept", () => {
    wrap(<CookieBanner />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(loadTracking).toHaveBeenCalled();
  });

  it("hides after Decline without loading tracking", () => {
    wrap(<CookieBanner />);
    fireEvent.click(screen.getByRole("button", { name: "Refuz" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(loadTracking).not.toHaveBeenCalled();
  });

  it("stays hidden on return visits once a choice exists", () => {
    setConsent(false);
    wrap(<CookieBanner />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not show on admin pages", () => {
    wrap(<CookieBanner />, "/admin");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("cookie policy settings", () => {
  it("lets visitors change their choice later", () => {
    setConsent(false);
    wrap(<CookiePolicy />, "/cookie-policy");
    expect(screen.getByText("doar cookie-uri necesare")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(loadTracking).toHaveBeenCalled();
    expect(screen.getByText("cookie-uri de analiză acceptate")).toBeInTheDocument();

    act(() => { fireEvent.click(screen.getByRole("button", { name: "Refuz" })); });
    expect(getConsent()?.analytics).toBe(false);
    expect(reload).toHaveBeenCalled();
    expect(screen.getByText("doar cookie-uri necesare")).toBeInTheDocument();
  });
});
