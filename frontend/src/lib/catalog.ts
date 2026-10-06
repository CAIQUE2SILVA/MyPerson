export type ProdutoVitrine = {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  categoriaId: number | null;
  categoriaNome: string | null;
  categoriaSlug: string | null;
  imagemUrl: string | null;
};

export type CategoriaVitrine = {
  id: number;
  nome: string;
  slug: string;
};

export function apiBase(): string {
  const configured = process.env.API_INTERNAL_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return "http://127.0.0.1/api";
}

// ponytail: no-store porque o build da imagem não alcança a API
async function readJson<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase()}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(String(res.status));
  return res.json() as Promise<T>;
}

export async function loadVitrine(): Promise<{ produtos: ProdutoVitrine[]; erro: boolean }> {
  try {
    const produtos = await readJson<ProdutoVitrine[]>("/produtos/vitrine");
    return { produtos, erro: false };
  } catch {
    return { produtos: [], erro: true };
  }
}

export async function loadProduto(id: number): Promise<ProdutoVitrine | null> {
  const res = await fetch(`${apiBase()}/produtos/vitrine/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(String(res.status));
  return res.json() as Promise<ProdutoVitrine>;
}

export async function loadCategorias(): Promise<{ categorias: CategoriaVitrine[]; erro: boolean }> {
  try {
    const categorias = await readJson<CategoriaVitrine[]>("/categorias");
    return { categorias, erro: false };
  } catch {
    return { categorias: [], erro: true };
  }
}
