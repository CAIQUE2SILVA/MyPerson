import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function TrocasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Trocas e Devoluções</h1>
        <div className="max-w-3xl space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Política de Trocas</h2>
            <p className="text-lg text-gray-600 mb-4">
              Você tem até 7 dias corridos após o recebimento do produto para solicitar troca ou devolução.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Condições</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Produto deve estar na embalagem original</li>
              <li>Produto não pode ter sido usado</li>
              <li>Nota fiscal deve estar presente</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Como Solicitar</h2>
            <p className="text-lg text-gray-600">
              Entre em contato conosco através da nossa página de <a href="/contato" className="text-purple-600 hover:text-purple-800 underline">contato</a> ou envie um email para trocas@myperson.com.br
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

