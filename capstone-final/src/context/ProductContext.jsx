// src/context/ProductContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const ProductContext = createContext();

// Create the provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Function to add a new product
  const addProduct = (product) => {
    setProducts((prevProducts) => {
      const maxId = prevProducts.reduce((max, product) => Math.max(max, product.id), 0);
      return [...prevProducts, { ...product, id: maxId + 1 }];
    });
  };

  // Function to update an existing product
  const updateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  // Function to archive (remove) a product
  const archiveProduct = (productId) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, archiveProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
