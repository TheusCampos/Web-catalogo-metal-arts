import { hasConsent } from "@/features/privacy/services/consent.service";

let analyticsInitialized = false;

/**
 * Inicializa ferramentas de análise (Google Analytics, Plausible, etc.)
 * SOMENTE se o usuário concedeu consentimento explícito para a categoria 'analytics'.
 */
export function initializeAnalytics(): void {
  if (typeof window === "undefined") return;
  if (!hasConsent("analytics")) {
    return;
  }
  if (analyticsInitialized) return;

  analyticsInitialized = true;
  // Aqui são injetados scripts de telemetria/analytics autorizados
  if (process.env["NODE_ENV"] === "development") {
    console.info("[Analytics] Inicializado com consentimento ativo.");
  }
}

/**
 * Registra evento de navegação ou visualização, respeitando a guarda de consentimento.
 */
export function trackPageView(url: string): void {
  if (!hasConsent("analytics")) return;
  // Dispara métrica anônima se permitido
  if (process.env["NODE_ENV"] === "development") {
    console.debug(`[Analytics Track PageView]: ${url}`);
  }
}
