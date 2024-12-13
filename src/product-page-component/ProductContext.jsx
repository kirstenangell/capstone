// src/context/ProductContext.js
import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    // Predefined products
    { 
      id: 1, 
      image: "/assets/wheel1.png", 
      name: "Wheel A", 
      price: 30000, 
      reviews: 11, 
      rating: 4,
      category: "wheels",
      archived: false, // Add archived flag for each product
    },
    { 
      id: 2, 
      image: "/assets/wheel2.png", 
      name: "Wheel B", 
      price: 32000, 
      reviews: 8, 
      rating: 5,
      category: "wheels",
      archived: false, // Add archived flag
    },
  ]);

  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const archiveProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, archived: true } : product
      )
    );
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, archiveProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
