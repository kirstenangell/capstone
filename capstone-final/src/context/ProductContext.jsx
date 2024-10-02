import React, { createContext, useState } from 'react';

// Create the context
export const ProductContext = createContext();

// Create the provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      image: 'path/to/default/image.png',
      name: 'PRODUCT NAME 1',
      price: 'PHP30,000.00',
      type: 'Loren Ipsum',
      brand: 'Loren Ipsum',
      category: 'Loren Ipsum',
      description: 'Loren Ipsum Acit Dolores',
      dimensions: 'Loren Ipsum',
      color: 'Loren Ipsum',
      finish: 'Loren Ipsum',
      material: 'Loren Ipsum',
      model: 'Loren Ipsum',
      tax: 'Loren Ipsum',
      discount: 'Loren Ipsum',
      totalPrice: 'PHP33,000.00',
    },
    // Add more initial products as needed
  ]);

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
      prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
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
