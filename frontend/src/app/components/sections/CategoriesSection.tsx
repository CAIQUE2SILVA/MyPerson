import Link from "next/link";

const categories = [
  { name: "Feminino", slug: "feminino" },
  { name: "Masculino", slug: "masculino" },
  { name: "Unissex", slug: "unissex" },
  { name: "Luxo", slug: "luxo" },
];

export default function CategoriesSection() {
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categorias/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 text-center">{category.name}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

