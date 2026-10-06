import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900">My Person</h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Início
            </Link>
            <Link href="/produtos" className="text-gray-700 hover:text-gray-900 font-medium">
              Produtos
            </Link>
            <Link href="/categorias" className="text-gray-700 hover:text-gray-900 font-medium">
              Categorias
            </Link>
            <Link href="/sobre" className="text-gray-700 hover:text-gray-900 font-medium">
              Sobre
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-700 hover:text-gray-900" aria-label="Buscar">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

