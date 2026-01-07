import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function FretePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Frete e Entrega</h1>
        <div className="max-w-3xl space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Política de Frete</h2>
            <p className="text-lg text-gray-600 mb-4">
              Oferecemos diferentes opções de entrega para atender suas necessidades.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Frete grátis para compras acima de R$ 200,00</li>
              <li>Entrega expressa disponível</li>
              <li>Rastreamento em tempo real</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Prazos de Entrega</h2>
            <p className="text-lg text-gray-600">
              Os prazos de entrega variam conforme a região e modalidade escolhida.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

