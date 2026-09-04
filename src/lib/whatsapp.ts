import { onlyDigits } from "./phone";

/**
 * Monta o link do WhatsApp da loja para dúvidas ou contato geral.
 */
export function buildWhatsAppLink(params: {
  whatsappNumber: string;
  customerName: string;
  productName?: string | null | undefined;
  storeName?: string | null | undefined;
}): string {
  let number = onlyDigits(params.whatsappNumber);
  if (number.length === 10 || number.length === 11) number = `55${number}`;
  const lines = [
    `Olá${params.storeName ? ` ${params.storeName}` : ""}! Meu nome é ${params.customerName}.`,
  ];
  if (params.productName) {
    lines.push(`Tenho interesse no produto: ${params.productName}.`);
  }
  lines.push("Pode me passar mais informações?");
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join(" "))}`;
}

/**
 * Monta a mensagem direta de compra de um produto com Cor, Tamanho e Quantidade.
 */
export function buildProductWhatsAppLink(params: {
  whatsappNumber: string;
  productName: string;
  price: number;
  qty?: number | null | undefined;
  size?: string | null | undefined;
  color?: string | null | undefined;
  storeName?: string | null | undefined;
}): string {
  let number = onlyDigits(params.whatsappNumber);
  if (number.length === 10 || number.length === 11) number = `55${number}`;

  const money = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const qty = params.qty && params.qty > 0 ? params.qty : 1;
  const totalPrice = params.price * qty;

  const lines = [
    `Olá${params.storeName ? ` ${params.storeName}` : ""}! Gostaria de fazer o pedido:`,
    "",
    `🛍️ *Produto:* ${params.productName}`,
  ];
  if (params.size) {
    lines.push(`📏 *Tamanho:* ${params.size}`);
  }
  if (params.color) {
    lines.push(`🎨 *Cor:* ${params.color}`);
  }
  lines.push(`🔢 *Quantidade:* ${qty} unidade${qty > 1 ? "s" : ""}`);
  lines.push(`💰 *Total:* ${money(totalPrice)}`);
  lines.push("", "Pode me passar as instruções para pagamento?");

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/**
 * Mensagem de fechamento do carrinho, com lista detalhada de peças (Quantidade, Tamanho, Cor) e total.
 */
export function buildCartWhatsAppLink(params: {
  whatsappNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null | undefined;
  storeName?: string | null | undefined;
  items: {
    name: string;
    qty: number;
    unitPrice: number;
    size?: string | null | undefined;
    color?: string | null | undefined;
  }[];
  total: number;
}): string {
  let number = onlyDigits(params.whatsappNumber);
  if (number.length === 10 || number.length === 11) number = `55${number}`;

  const money = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatItem = (item: {
    name: string;
    qty: number;
    unitPrice: number;
    size?: string | null | undefined;
    color?: string | null | undefined;
  }) => {
    const details: string[] = [];
    if (item.size) details.push(`Tamanho: ${item.size}`);
    if (item.color) details.push(`Cor: ${item.color}`);
    const variantStr = details.length > 0 ? ` (${details.join(" | ")})` : "";
    return `• ${item.qty}x ${item.name}${variantStr} — ${money(item.unitPrice * item.qty)}`;
  };

  const lines = [
    `Olá${params.storeName ? ` ${params.storeName}` : ""}! Meu nome é ${params.customerName} e quero fechar meu pedido:`,
    "",
    ...params.items.map(formatItem),
    "",
    `💰 *Total:* ${money(params.total)}`,
    `📱 *Telefone:* ${params.customerPhone}`,
  ];
  if (params.customerEmail) lines.push(`✉️ *E-mail:* ${params.customerEmail}`);
  lines.push("", "Como faço para prosseguir com o pagamento?");

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}
