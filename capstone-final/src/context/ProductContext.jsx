// src/context/ProductContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        const data = await response.json();
        setProducts(data.filter(product => !product.archived)); // Filter out archived products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    try {
      const response = await fetch('http://localhost:5000/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const savedProduct = await response.json();
        setProducts(prevProducts => [...prevProducts, savedProduct]);
      } else {
        console.error('Failed to add product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      const response = await fetch(`http://localhost:5000/update-product/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
  
      if (response.ok) {
        const updatedProductFromDB = await response.json();
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === updatedProduct.id ? updatedProductFromDB : product
          )
        );
      } else {
        console.error('Failed to update product:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const archiveProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/archive-product/${productId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        // Update state to reflect archived product
        setProducts(prevProducts =>
          prevProducts.filter(product => product.id !== productId)
        );
      } else {
        console.error('Failed to archive product:', response.statusText);
      }
    } catch (error) {
      console.error('Error archiving product:', error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, archiveProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
