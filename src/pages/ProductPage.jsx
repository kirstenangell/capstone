import React from 'react';
import ProductSection from '../product-page-component/ProductSection';

const handleAddToCart = (product) => {
  const [cartItems, setCartItems] = useState([]);
  setCartItems((prevItems) => [...prevItems, product]);
  console.log('Added to cart:', product);
};
export default function ProductPage({ onAddToCart }) {
  return (
    <ProductSection onAddToCart={handleAddToCart} />

  );
}
