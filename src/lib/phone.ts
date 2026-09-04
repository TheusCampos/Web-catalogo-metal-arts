/** Máscara de telefone brasileiro: (11) 91234-5678 */
export function maskPhone(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, "($1");
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d{0,4})/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

/** Telefone válido = DDD + 8 ou 9 dígitos. */
export function isValidPhone(input: string): boolean {
  const digits = input.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export function onlyDigits(input: string): string {
  return input.replace(/\D/g, "");
}
