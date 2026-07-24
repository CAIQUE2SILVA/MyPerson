import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative">
      {/* Container da imagem em tela cheia */}
      <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
        {/* Placeholder da imagem (fundo) */}
        <div className="absolute inset-0 flex items-center justify-center text-white opacity-25">
          <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </div>

        {/* Conteúdo sobreposto: título em cima, botões em baixo */}
        <div className="relative z-10 flex h-full flex-col items-center justify-between px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="flex flex-1 flex-col items-center justify-center">
            <h2 className="mb-6 text-4xl font-bold text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              Encontre seu
              <span className="text-purple-100"> perfume perfeito</span>
            </h2>
            <p className="max-w-2xl text-lg text-white/90 drop-shadow">
              Descubra uma coleção exclusiva de fragrâncias que expressam sua personalidade única.
              Qualidade premium e aromas inesquecíveis.
            </p>
          </div>

          {/* Botões de ações em baixo */}
          <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <Link
              href="/produtos"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 font-semibold text-purple-600 transition-colors hover:bg-purple-50"
            >
              Explorar Produtos
            </Link>
            <Link
              href="/categorias"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver Categorias
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
