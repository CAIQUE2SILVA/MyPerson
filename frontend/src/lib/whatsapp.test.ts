import { afterEach, describe, expect, it } from "vitest";
import { linkCompra, mensagemProduto, whatsappHref } from "./whatsapp";

afterEach(() => {
  delete process.env.WHATSAPP_NUMBER;
});

describe("whatsappHref", () => {
  it("monta o link só com dígitos e a mensagem", () => {
    const href = whatsappHref("+55 (11) 98888-7777", "Olá");
    expect(href).toBe("https://wa.me/5511988887777?text=Ol%C3%A1");
  });

  it("não gera link sem número", () => {
    expect(whatsappHref(undefined, "Olá")).toBeNull();
    expect(whatsappHref("abc", "Olá")).toBeNull();
  });
});

describe("mensagemProduto", () => {
  it("inclui nome e preço", () => {
    expect(mensagemProduto("Elegance", "R$ 10,00")).toBe("Olá! Quero comprar Elegance (R$ 10,00).");
  });
});

describe("linkCompra", () => {
  it("usa WHATSAPP_NUMBER do ambiente", () => {
    process.env.WHATSAPP_NUMBER = "5511999990000";
    expect(linkCompra("Elegance", "R$ 10,00")).toContain("https://wa.me/5511999990000?text=");
  });
});
