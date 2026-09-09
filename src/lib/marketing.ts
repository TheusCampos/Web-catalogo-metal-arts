import { hasConsent } from "@/features/privacy/services/consent.service";

let marketingInitialized = false;

/**
 * Inicializa ferramentas de marketing, remarketing e pixels de conversão
 * SOMENTE se o usuário concedeu consentimento explícito para a categoria 'marketing'.
 */
export function initializeMarketing(): void {
  if (typeof window === "undefined") return;
  if (!hasConsent("marketing")) {
    return;
  }
  if (marketingInitialized) return;

  marketingInitialized = true;
  if (process.env["NODE_ENV"] === "development") {
    console.info("[Marketing] Inicializado com consentimento ativo.");
  }
}

/**
 * Dispara evento de conversão ou interesse comercial com guarda de consentimento.
 */
export function trackConversion(eventName: string, params?: Record<string, unknown>): void {
  if (!hasConsent("marketing")) return;
  if (process.env["NODE_ENV"] === "development") {
    console.debug(`[Marketing Conversion]: ${eventName}`, params);
  }
}
