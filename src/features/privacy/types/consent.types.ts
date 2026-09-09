export type CookieCategory = "necessary" | "analytics" | "marketing";

export interface ConsentPreferences {
  necessary: boolean; // Sempre true
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

export interface CookieInfo {
  name: string;
  category: CookieCategory;
  purpose: string;
  vendor: string;
  duration: string;
}
