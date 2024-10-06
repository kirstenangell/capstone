// src/context/ProductContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const ProductContext = createContext();

// Create the provider component
export const ProductProvider = ({ children }) => {
  // Initialize products from localStorage or start with an empty array
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  // Persist products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Function to generate a unique Product ID (similar to OID logic)
  const generateProductID = () => {
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    return nextId;
  };

  // Function to add a new product
  const addProduct = (product) => {
    const newProduct = { ...product, id: generateProductID() };
    setProducts([...products, newProduct]);
  };

  // Function to update an existing product
  const updateProduct = (updatedProduct) => {
    setProducts(
      products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    );
  };

  // Function to archive (remove) a product
  const archiveProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, archiveProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
