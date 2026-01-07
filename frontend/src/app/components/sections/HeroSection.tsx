import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Encontre seu
              <span className="text-purple-600"> perfume perfeito</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Descubra uma coleção exclusiva de fragrâncias que expressam sua personalidade única.
              Qualidade premium e aromas inesquecíveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/produtos"
                className="inline-flex items-center justify-center px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Explorar Produtos
              </Link>
              <Link
                href="/categorias"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors"
              >
                Ver Categorias
              </Link>
            </div>
          </div>
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-32 h-32 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                <p className="text-xl font-semibold">Imagem do Produto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

