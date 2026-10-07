import { afterEach, describe, expect, it, vi } from "vitest";
import { apiBase, loadProduto, loadVitrine } from "./catalog";

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.API_INTERNAL_URL;
});

describe("apiBase", () => {
  it("usa a URL interna sem barra no fim", () => {
    process.env.API_INTERNAL_URL = "http://api:5000/api/";
    expect(apiBase()).toBe("http://api:5000/api");
  });

  it("cai em localhost quando a variável não existe", () => {
    expect(apiBase()).toBe("http://127.0.0.1/api");
  });
});

describe("loadVitrine", () => {
  it("devolve erro quando a API falha", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 500 })));
    await expect(loadVitrine()).resolves.toEqual({ produtos: [], erro: true });
  });
});

describe("loadProduto", () => {
  it("devolve null quando o produto não está na vitrine", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 404 })));
    await expect(loadProduto(9)).resolves.toBeNull();
  });
});
