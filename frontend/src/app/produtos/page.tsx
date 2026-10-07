import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductGrid, { CatalogoMensagem } from "../components/product/ProductGrid";
import { loadVitrine } from "@/lib/catalog";

export default async function ProdutosPage() {
  const { produtos, erro } = await loadVitrine();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Produtos</h1>
        <CatalogoMensagem erro={erro} vazio={!erro && produtos.length === 0} />
        {produtos.length > 0 && <ProductGrid produtos={produtos} />}
      </main>
      <Footer />
    </div>
  );
}
