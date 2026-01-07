"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: string;
  imageUrl?: string;
}

export default function ProductCard({ id, name, category, price, imageUrl }: ProductCardProps) {
  return (
    <Link href={`/produtos/${id}`} className="group cursor-pointer block">
      <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square mb-4 relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
            <svg className="w-24 h-24 text-purple-400 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Adicionar aos favoritos"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
      <p className="text-sm text-gray-600 mb-2">{category}</p>
      <p className="text-lg font-bold text-purple-600">{price}</p>
    </Link>
  );
}

