import { describe, it, expect } from "vitest";
import { buildWhatsAppLink, buildProductWhatsAppLink, buildCartWhatsAppLink } from "./whatsapp";

describe("buildWhatsAppLink", () => {
  it("builds link with product", () => {
    const link = buildWhatsAppLink({
      whatsappNumber: "5511999999999",
      customerName: "João",
      productName: "Camisa",
      storeName: "Minha Loja",
    });
    expect(link).toContain("5511999999999");
    expect(link).toContain("Jo%C3%A3o");
    expect(link).toContain("Camisa");
  });
});

describe("buildProductWhatsAppLink", () => {
  it("builds direct product buy link with size, color and quantity", () => {
    const link = buildProductWhatsAppLink({
      whatsappNumber: "11999999999",
      productName: "Camiseta Streetwear",
      price: 89.9,
      qty: 2,
      size: "G",
      color: "Preto",
      storeName: "Loja Moda",
    });
    expect(link).toContain("5511999999999");
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain("Camiseta Streetwear");
    expect(decoded).toContain("Tamanho:* G");
    expect(decoded).toContain("Cor:* Preto");
    expect(decoded).toContain("Quantidade:* 2 unidade");
    expect(decoded).toContain("Total:* R$ 179,80");
  });
});

describe("buildCartWhatsAppLink", () => {
  it("builds cart link with size and color per item", () => {
    const link = buildCartWhatsAppLink({
      whatsappNumber: "11912345678",
      customerName: "Maria",
      customerPhone: "11999999999",
      items: [
        { name: "Tênis", qty: 2, unitPrice: 100, size: "40", color: "Branco" },
        { name: "Boné", qty: 1, unitPrice: 50 },
      ],
      total: 250,
    });
    expect(link).toContain("5511912345678");
    const decoded = decodeURIComponent(link);
    expect(decoded).toContain("Maria");
    expect(decoded).toContain("2x Tênis (Tamanho: 40 | Cor: Branco)");
    expect(decoded).toContain("1x Boné");
    expect(decoded).toContain("Total:* R$ 250,00");
  });
});
