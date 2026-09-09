import { useState, useEffect, useCallback } from "react";
import type { ConsentPreferences } from "../types/consent.types";
import { getStoredConsent, saveConsent, DEFAULT_PREFERENCES } from "../services/consent.service";

export function useConsent() {
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_PREFERENCES);
  const [hasChosen, setHasChosen] = useState<boolean>(true); // Assume escolhido no SSR para evitar layout flash
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setPreferences(stored);
      setHasChosen(true);
    } else {
      setHasChosen(false);
    }

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentPreferences>;
      if (customEvent.detail) {
        setPreferences(customEvent.detail);
        setHasChosen(true);
      }
    };

    window.addEventListener("metal_arts_consent_changed", handler);
    return () => window.removeEventListener("metal_arts_consent_changed", handler);
  }, []);

  const acceptAll = useCallback(() => {
    const updated = saveConsent({ analytics: true, marketing: true });
    setPreferences(updated);
    setHasChosen(true);
    setIsModalOpen(false);
  }, []);

  const rejectNonEssential = useCallback(() => {
    const updated = saveConsent({ analytics: false, marketing: false });
    setPreferences(updated);
    setHasChosen(true);
    setIsModalOpen(false);
  }, []);

  const saveCustom = useCallback((custom: { analytics: boolean; marketing: boolean }) => {
    const updated = saveConsent(custom);
    setPreferences(updated);
    setHasChosen(true);
    setIsModalOpen(false);
  }, []);

  return {
    preferences,
    hasChosen,
    isModalOpen,
    setIsModalOpen,
    acceptAll,
    rejectNonEssential,
    saveCustom,
  };
}
