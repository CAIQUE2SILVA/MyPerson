import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductGrid, { CatalogoMensagem } from "../../components/product/ProductGrid";
import { loadCategorias, loadVitrine } from "@/lib/catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;
  const [{ produtos, erro }, { categorias, erro: erroCategoria }] = await Promise.all([
    loadVitrine(),
    loadCategorias(),
  ]);
  const categoria = categorias.find((item) => item.slug === slug);
  const daCategoria = produtos.filter((produto) => produto.categoriaSlug === slug);
  const falha = erro || erroCategoria;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {categoria?.nome ?? "Categoria"}
        </h1>
        {falha && <CatalogoMensagem erro vazio={false} />}
        {!falha && !categoria && (
          <p className="text-lg text-gray-600">Categoria não encontrada.</p>
        )}
        {!falha && categoria && (
          <>
            <CatalogoMensagem erro={false} vazio={daCategoria.length === 0} />
            {daCategoria.length > 0 && <ProductGrid produtos={daCategoria} />}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
