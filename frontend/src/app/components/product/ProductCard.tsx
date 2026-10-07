import { formatPrice } from "@/lib/format";
import type { ProdutoVitrine } from "@/lib/catalog";
import Link from "next/link";

export default function ProductCard({ produto }: { produto: ProdutoVitrine }) {
  return (
    <Link href={`/produtos/${produto.id}`} className="group cursor-pointer block">
      <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4 relative">
        {produto.imagemUrl ? (
          <img
            src={produto.imagemUrl}
            alt={produto.nome}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200" />
        )}
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{produto.nome}</h4>
      <p className="text-sm text-gray-600 mb-2">{produto.categoriaNome ?? "Sem categoria"}</p>
      <p className="text-lg font-bold text-purple-600">{formatPrice(produto.preco)}</p>
    </Link>
  );
}
