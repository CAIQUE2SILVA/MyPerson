import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Sobre Nós</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-gray-600 mb-4">
            Bem-vindo à My Person, sua loja de perfumes premium.
          </p>
          <p className="text-lg text-gray-600">
            Oferecemos uma seleção cuidadosa de fragrâncias de alta qualidade para todos os gostos.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

