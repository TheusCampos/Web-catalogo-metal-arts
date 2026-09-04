import { describe, it, expect } from "vitest";
import { formatPrice, formatDateTime } from "./format";

describe("formatPrice", () => {
  it("formats numbers to BRL", () => {
    // Note: spaces in Intl output can be non-breaking spaces (\u00A0)
    expect(formatPrice(10)).toContain("10,00");
    expect(formatPrice(10)).toMatch(/R\$\s?10,00/);
    expect(formatPrice(1500.5)).toContain("1.500,50");
  });

  it("handles strings", () => {
    expect(formatPrice("20")).toContain("20,00");
  });

  it("handles null/undefined by returning 0,00", () => {
    expect(formatPrice(null)).toContain("0,00");
    expect(formatPrice(undefined)).toContain("0,00");
  });
});

describe("formatDateTime", () => {
  it("formats ISO string to short date", () => {
    const result = formatDateTime("2026-08-17T15:00:00Z");
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(5);
  });
});
