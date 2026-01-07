import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ProdutosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Produtos</h1>
        <p className="text-lg text-gray-600">Página de produtos em desenvolvimento...</p>
      </main>
      <Footer />
    </div>
  );
}

