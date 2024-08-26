import React from 'react';
import ProductSection from '../product-page-component/ProductSection';

export default function ProductPage({ onAddToCart }) {
  return (
    <ProductSection onAddToCart={onAddToCart} />
  );
}
