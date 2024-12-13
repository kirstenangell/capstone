import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Example background images for categories
const backgroundImages = {
  'car-audio-system': '../assets/caraudio.png',
  'lighting': 'path/to/lighting-background.jpg',
  'car-security': 'path/to/car-security-background.jpg',
  'tires-wheels': 'path/to/tires-wheels-background.jpg',
  'car-gadgets': 'path/to/car-gadgets-background.jpg',
  // Add more categories and their background images here
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts(categoryName);
  }, [categoryName]);

  const fetchProducts = (category) => {
    // Simulated fetch function
    console.log("Fetching products for:", category);
    // Set products state based on fetched data
    // Dummy data
    setProducts([
      { id: 1, name: 'Product 1', description: 'Description 1', price: '100', image: '/path/to/image1.png' },
      { id: 2, name: 'Product 2', description: 'Description 2', price: '200', image: '/path/to/image2.png' }
    ]);
  };

  // Get the background image for the current category
  const backgroundImage = backgroundImages[categoryName.replace('-', ' ')] || 'path/to/default-background.jpg';

  return (
    <div className="min-h-screen bg-cover bg-center text-white py-10"
         style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">{categoryName.replaceAll('-', ' ').toUpperCase()}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-black bg-opacity-70 rounded-lg shadow-lg p-6 hover:bg-opacity-80 transition duration-300">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="mt-2">{product.description}</p>
              <div className="mt-4">
                <img src={product.image.split(',')[0]} alt={product.name} className="w-full h-40 object-cover rounded-md"/>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold">{product.price}</span>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
