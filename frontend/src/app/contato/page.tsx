import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contato</h1>
        <div className="max-w-2xl">
          <p className="text-lg text-gray-600 mb-6">
            Entre em contato conosco. Estamos aqui para ajudar!
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email</h2>
              <p className="text-gray-600">contato@myperson.com.br</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Telefone</h2>
              <p className="text-gray-600">(11) 1234-5678</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

