import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const ProductContext = createContext();

// Create the provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);  // Initialize products as an empty array

  // Fetch products from backend on initial render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');  // Replace with your backend API endpoint
        const data = await response.json();
        setProducts(data);  // Update state with fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();  // Fetch products when the component mounts
  }, []);  // Empty dependency array ensures it only runs on mount

  // Function to add a new product
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
        setProducts((prevProducts) => [...prevProducts, savedProduct]);  // Add the newly saved product to the state
      } else {
        console.error('Failed to add product:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Function to update an existing product
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
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          )
        );
      } else {
        console.error('Failed to update product:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Function to archive (remove) a product
  const archiveProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-product/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
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
