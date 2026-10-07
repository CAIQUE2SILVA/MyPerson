import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { loadProduto } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProdutoPage({ params }: PageProps) {
  const { id } = await params;
  const produtoId = Number(id);
  let produto = null;
  let erro = false;

  if (!Number.isInteger(produtoId)) {
    erro = false;
  } else {
    try {
      produto = await loadProduto(produtoId);
    } catch {
      erro = true;
    }
  }

  if (erro || !produto) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {erro ? "Não foi possível carregar o produto" : "Produto não encontrado"}
          </h1>
          <Link href="/produtos" className="text-purple-600 hover:text-purple-800 underline">
            Voltar para produtos
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Início</Link>
          <span className="mx-2">/</span>
          <Link href="/produtos" className="hover:text-gray-900">Produtos</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{produto.nome}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative">
            {produto.imagemUrl ? (
              <img src={produto.imagemUrl} alt={produto.nome} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200" />
            )}
          </div>

          <div>
            {produto.categoriaNome && (
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full mb-4">
                {produto.categoriaNome}
              </span>
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{produto.nome}</h1>
            <p className="text-4xl font-bold text-gray-900 mb-6">{formatPrice(produto.preco)}</p>
            {produto.descricao && <p className="text-lg text-gray-700">{produto.descricao}</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
