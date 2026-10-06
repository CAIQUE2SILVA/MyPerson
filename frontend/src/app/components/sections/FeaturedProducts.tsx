import { loadVitrine } from "@/lib/catalog";
import ProductGrid, { CatalogoMensagem } from "../product/ProductGrid";

export default async function FeaturedProducts() {
  const { produtos, erro } = await loadVitrine();
  const destaque = produtos.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Produtos em Destaque
          </h3>
          <p className="text-lg text-gray-600">
            Nossas fragrâncias publicadas na loja
          </p>
        </div>
        <CatalogoMensagem erro={erro} vazio={!erro && destaque.length === 0} />
        {destaque.length > 0 && <ProductGrid produtos={destaque} />}
      </div>
    </section>
  );
}
