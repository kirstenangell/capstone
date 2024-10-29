// src/context/ProductContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // State to hold products, initialized with predefined products
  const [products, setProducts] = useState([
    { 
      id: 1, 
      image: "/assets/wheel1.png", 
      name: "Wheel A", 
      price: 30000, 
      reviews: 11, 
      rating: 4,
      category: "wheels",
    },
    { 
      id: 2, 
      image: "/assets/wheel2.png", 
      name: "Wheel B", 
      price: 32000, 
      reviews: 8, 
      rating: 5,
      category: "wheels",
    },
  ]);

  // Function to add a new product to the current list
  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  // Fetch products from the backend API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with your actual backend endpoint
        const response = await fetch('http://localhost:5000/products');
        
        // Check if the response is successful
        if (response.ok) {
          const data = await response.json();
          
          // If data is successfully fetched, update the products list
          // by combining predefined products and fetched data
          setProducts((prevProducts) => [
            ...prevProducts,  // Keep existing predefined products
            ...data,          // Add fetched products
          ]);
        } else {
          console.error('Failed to fetch products:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();  // Call fetchProducts on component mount
  }, []);  // Empty dependency array ensures it only runs on mount

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
