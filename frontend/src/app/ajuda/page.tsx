import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Central de Ajuda</h1>
        <div className="max-w-3xl space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Perguntas Frequentes</h2>
            <p className="text-lg text-gray-600">
              Em breve disponibilizaremos uma seção completa de perguntas frequentes.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Precisa de mais ajuda?</h2>
            <p className="text-lg text-gray-600">
              Entre em contato conosco através da nossa página de <a href="/contato" className="text-purple-600 hover:text-purple-800 underline">contato</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

