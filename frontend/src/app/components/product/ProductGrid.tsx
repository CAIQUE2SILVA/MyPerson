import type { ProdutoVitrine } from "@/lib/catalog";
import ProductCard from "./ProductCard";

export function CatalogoMensagem({ erro, vazio }: { erro: boolean; vazio: boolean }) {
  if (erro) {
    return <p className="text-lg text-gray-600">Não foi possível carregar o catálogo agora.</p>;
  }
  if (vazio) {
    return <p className="text-lg text-gray-600">Nenhum produto publicado ainda.</p>;
  }
  return null;
}

export default function ProductGrid({ produtos }: { produtos: ProdutoVitrine[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
