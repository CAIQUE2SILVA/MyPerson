export function mensagemProduto(nome: string, preco: string): string {
  return `Olá! Quero comprar ${nome} (${preco}).`;
}

export function whatsappHref(numero: string | undefined, texto: string): string | null {
  const digits = (numero ?? "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(texto)}`;
}

export function linkCompra(nome: string, preco: string): string | null {
  return whatsappHref(process.env.WHATSAPP_NUMBER, mensagemProduto(nome, preco));
}
