import ProductCard from "../product/ProductCard";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  imageUrl?: string;
}

const mockProducts: Product[] = [
  { id: 1, name: "Perfume Elegance", category: "Feminino", price: "R$ 299,90" },
  { id: 2, name: "Fragrância Premium", category: "Masculino", price: "R$ 349,90" },
  { id: 3, name: "Essência Única", category: "Unissex", price: "R$ 279,90" },
  { id: 4, name: "Aroma Exclusivo", category: "Luxo", price: "R$ 499,90" },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Produtos em Destaque
          </h3>
          <p className="text-lg text-gray-600">
            Nossas fragrâncias mais populares
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

