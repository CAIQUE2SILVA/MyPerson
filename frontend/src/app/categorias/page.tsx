import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { loadCategorias } from "@/lib/catalog";
import Link from "next/link";

export default async function CategoriasPage() {
  const { categorias, erro } = await loadCategorias();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Categorias</h1>
        {erro && <p className="text-lg text-gray-600">Não foi possível carregar as categorias agora.</p>}
        {!erro && categorias.length === 0 && (
          <p className="text-lg text-gray-600">Nenhuma categoria publicada ainda.</p>
        )}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map((categoria) => (
            <li key={categoria.id}>
              <Link
                href={`/categorias/${categoria.slug}`}
                className="block rounded-xl border border-gray-200 p-6 font-semibold text-gray-900 hover:border-purple-300"
              >
                {categoria.nome}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
