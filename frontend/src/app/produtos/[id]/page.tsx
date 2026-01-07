import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }> | {
    id: string;
  };
}

// Mock de produtos com mais detalhes
const mockProducts = {
  "1": {
    id: 1,
    name: "Perfume Elegance",
    category: "Feminino",
    price: "R$ 299,90",
    originalPrice: "R$ 349,90",
    description: "Uma fragrância sofisticada e elegante, perfeita para ocasiões especiais. Combina notas florais delicadas com toques amadeirados, criando uma experiência única e memorável.",
    longDescription: "O Perfume Elegance é uma criação exclusiva que combina as melhores notas de flores raras com essências amadeiradas. Ideal para mulheres que buscam sofisticação e elegância em cada momento. Sua fragrância duradoura acompanha você durante todo o dia, deixando um rastro inesquecível.",
    volume: "100ml",
    brand: "My Person",
    inStock: true,
    rating: 4.5,
    reviews: 128,
    features: [
      "Fragrância duradoura até 8 horas",
      "Notas florais e amadeiradas",
      "Ideal para uso diário",
      "Embalagem premium"
    ]
  },
  "2": {
    id: 2,
    name: "Fragrância Premium",
    category: "Masculino",
    price: "R$ 349,90",
    originalPrice: "R$ 399,90",
    description: "Uma fragrância marcante e sofisticada para o homem moderno. Combina notas cítricas frescas com toques especiados e amadeirados.",
    longDescription: "A Fragrância Premium foi desenvolvida para homens que valorizam qualidade e sofisticação. Com notas de saída cítricas, coração especiado e base amadeirada, esta fragrância é perfeita para qualquer ocasião, do dia a dia aos eventos mais importantes.",
    volume: "100ml",
    brand: "My Person",
    inStock: true,
    rating: 4.8,
    reviews: 256,
    features: [
      "Fragrância duradoura até 10 horas",
      "Notas cítricas e especiadas",
      "Ideal para uso profissional",
      "Embalagem elegante"
    ]
  },
  "3": {
    id: 3,
    name: "Essência Única",
    category: "Unissex",
    price: "R$ 279,90",
    originalPrice: "R$ 329,90",
    description: "Uma fragrância versátil e moderna, perfeita para todos os gêneros. Combina notas frescas com toques doces e amadeirados.",
    longDescription: "A Essência Única é uma fragrância que transcende gêneros, criada para pessoas que buscam algo especial e único. Sua composição equilibrada de notas frescas, doces e amadeiradas cria uma experiência olfativa incomparável.",
    volume: "100ml",
    brand: "My Person",
    inStock: true,
    rating: 4.6,
    reviews: 189,
    features: [
      "Fragrância duradoura até 8 horas",
      "Notas frescas e doces",
      "Unissex - para todos",
      "Embalagem moderna"
    ]
  },
  "4": {
    id: 4,
    name: "Aroma Exclusivo",
    category: "Luxo",
    price: "R$ 499,90",
    originalPrice: "R$ 599,90",
    description: "Uma fragrância de luxo com ingredientes raros e exclusivos. Uma experiência olfativa única e sofisticada.",
    longDescription: "O Aroma Exclusivo representa o ápice da perfumaria de luxo. Criado com ingredientes raros e selecionados, esta fragrância é uma verdadeira obra de arte olfativa. Cada nota foi cuidadosamente escolhida para criar uma experiência sensorial incomparável.",
    volume: "100ml",
    brand: "My Person",
    inStock: true,
    rating: 5.0,
    reviews: 87,
    features: [
      "Fragrância duradoura até 12 horas",
      "Ingredientes raros e exclusivos",
      "Edição limitada",
      "Embalagem de luxo premium"
    ]
  }
};

export default async function ProdutoPage({ params }: PageProps) {
  // Aguardar params se for Promise (Next.js 16+)
  const resolvedParams = params instanceof Promise ? await params : params;
  const productId = resolvedParams?.id || "";
  
  const product = mockProducts[productId as keyof typeof mockProducts];
  
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Produto não encontrado</h1>
          <Link href="/produtos" className="text-purple-600 hover:text-purple-800 underline">
            Voltar para produtos
          </Link>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">Início</Link>
          <span className="mx-2">/</span>
          <Link href="/produtos" className="hover:text-gray-900">Produtos</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Imagem do Produto */}
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
              <svg className="w-48 h-48 text-purple-400 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
          </div>

          {/* Informações do Produto */}
          <div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Avaliação */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">({product.rating})</span>
              <span className="text-gray-500">• {product.reviews} avaliações</span>
            </div>

            {/* Preço */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">{product.originalPrice}</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">Volume: {product.volume}</p>
            </div>

            {/* Descrição */}
            <p className="text-lg text-gray-700 mb-6">{product.description}</p>

            {/* Características */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Características:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-4">
              <button
                className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-colors text-lg"
              >
                Adicionar ao Carrinho
              </button>
              <button
                className="w-full border-2 border-purple-600 text-purple-600 py-4 px-6 rounded-xl font-semibold hover:bg-purple-50 transition-colors text-lg"
              >
                Adicionar aos Favoritos
              </button>
            </div>

            {/* Status de Estoque */}
            {product.inStock ? (
              <p className="mt-4 text-green-600 font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Em estoque
              </p>
            ) : (
              <p className="mt-4 text-red-600 font-medium">Fora de estoque</p>
            )}
          </div>
        </div>

        {/* Descrição Detalhada */}
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrição Detalhada</h2>
          <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

