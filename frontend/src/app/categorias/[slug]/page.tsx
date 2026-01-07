import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

interface PageProps {
  params: Promise<{
    slug: string;
  }> | {
    slug: string;
  };
}

export default async function CategoriaPage({ params }: PageProps) {
  // Aguardar params se for Promise (Next.js 16+)
  let resolvedParams;
  if (params instanceof Promise) {
    resolvedParams = await params;
  } else {
    resolvedParams = params;
  }
  
  // Verificar se params existe e tem slug
  const slug = resolvedParams?.slug || "";
  
  // Capitalizar primeira letra com verificação adicional
  const categoriaNome = slug && slug.length > 0
    ? slug.charAt(0).toUpperCase() + slug.slice(1)
    : "Categoria";
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Categoria: {categoriaNome}
        </h1>
        <p className="text-lg text-gray-600">Produtos da categoria {categoriaNome}...</p>
      </main>
      <Footer />
    </div>
  );
}

