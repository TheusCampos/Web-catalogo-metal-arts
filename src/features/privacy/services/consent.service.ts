import type { ConsentPreferences, CookieCategory } from "../types/consent.types";

const CONSENT_STORAGE_KEY = "metal_arts_cookie_consent_v1";
export const PRIVACY_POLICY_VERSION = "v1.0";

export const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: "",
  version: PRIVACY_POLICY_VERSION,
};

/**
 * Lê preferências salvas no localStorage de forma segura.
 */
export function getStoredConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;

    // Se a versão da política tiver mudado substancialmente, exige novo consentimento
    if (parsed.version !== PRIVACY_POLICY_VERSION) {
      return null;
    }

    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp: parsed.timestamp || new Date().toISOString(),
      version: PRIVACY_POLICY_VERSION,
    };
  } catch {
    return null;
  }
}

/**
 * Persiste a decisão de consentimento e notifica a aplicação via evento customizado.
 */
export function saveConsent(preferences: {
  analytics: boolean;
  marketing: boolean;
}): ConsentPreferences {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PREFERENCES, ...preferences, timestamp: new Date().toISOString() };
  }

  const complete: ConsentPreferences = {
    necessary: true,
    analytics: preferences.analytics,
    marketing: preferences.marketing,
    timestamp: new Date().toISOString(),
    version: PRIVACY_POLICY_VERSION,
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(complete));
    window.dispatchEvent(new CustomEvent("metal_arts_consent_changed", { detail: complete }));
  } catch (err) {
    console.error("Erro ao salvar consentimento de cookies:", err);
  }

  return complete;
}

/**
 * Verifica se uma categoria específica possui consentimento ativo.
 */
export function hasConsent(category: CookieCategory): boolean {
  if (category === "necessary") return true;
  const stored = getStoredConsent();
  return Boolean(stored && stored[category]);
}
