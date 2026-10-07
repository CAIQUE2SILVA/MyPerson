import { loadCategorias } from "@/lib/catalog";
import Link from "next/link";

export default async function CategoriesSection() {
  const { categorias, erro } = await loadCategorias();

  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explore por Categoria
          </h3>
          <p className="text-lg text-gray-600">
            Encontre o aroma ideal para você
          </p>
        </div>
        {erro && <p className="text-center text-lg text-gray-600">Não foi possível carregar as categorias agora.</p>}
        {!erro && categorias.length === 0 && (
          <p className="text-center text-lg text-gray-600">Nenhuma categoria publicada ainda.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categorias.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4" />
              <h4 className="font-semibold text-gray-900 text-center">{category.nome}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
