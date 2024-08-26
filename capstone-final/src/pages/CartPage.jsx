import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CartSection from '../cart-page-component/CartSection';
import CheckoutLanding from '../cart-page-component/CheckoutLanding';

const CartPage = ({ cartItems, onRemoveFromCart }) => {
  return (
    <Routes>
      <Route path="/" element={<CartSection cartItems={cartItems} onRemoveFromCart={onRemoveFromCart} />} />
      <Route path="checkout-landing" element={<CheckoutLanding />} />
    </Routes>
  );
};

export default CartPage;
