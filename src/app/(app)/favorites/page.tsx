import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard'; // Adjust the path as necessary
import { Product } from '@/lib/types'; // Assuming you have a Product type defined

const FavoritesPage = () => {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

  // Placeholder data for demonstration purposes.
  // In a real application, you would fetch this data from storage (e.g., localStorage, a database).
  const placeholderProducts: Product[] = [
    { barcode: '12345', name: 'Example Product 1', ingredients: 'Ingredient A, Ingredient B', image_url: 'https://via.placeholder.com/150' },
    { barcode: '67890', name: 'Example Product 2', ingredients: 'Ingredient C, Ingredient D', image_url: 'https://via.placeholder.com/150' },
  ];

  useEffect(() => {
    // Simulate fetching favorite products
    setFavoriteProducts(placeholderProducts);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {favoriteProducts.map(product => (
          <ProductCard key={product.barcode} product={product} />
        ))}
      </div>
    </div>
  );
};
export default FavoritesPage;