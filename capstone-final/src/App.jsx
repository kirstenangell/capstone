import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from "./global/Header";
import Navbar from "./global/Navbar";
import Footer from "./global/Footer";
import LandingPage from "./pages/LandingPage";
import AboutUsPage from "./pages/AboutUsPage";
import ServicePage from "./pages/ServicePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage"; 
import ContactUs from "./global/ContactUs";
import Faqs from "./global/Faqs";
import Terms from "./global/Terms";
import Shipping from "./global/Shipping";
import Returns from "./global/Returns";
import ManageAcc from "./login-page-component/ManageAcc"; // Import ManageAcc component

function App() {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage, if they exist
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProductIndex = prevItems.findIndex(item => item.id === product.id);
      if (existingProductIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingProductIndex].quantity += product.quantity || 1;
        return updatedItems;
      } else {
        return [...prevItems, product];
      }
    });
  };

  const handleRemoveFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = newQuantity;
      return updatedItems;
    });
  };

  const cartItemCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);

  return (
    <Router>
      <div style={{ background: 'black' }}>
        <Header />
        <Navbar cartItemCount={cartItemCount} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route 
            path="/products" 
            element={<ProductPage onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/cart/*" 
            element={<CartPage cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateQuantity} />} 
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login/*" element={<LoginPage />} />
          <Route path="/manage-account" element={<ManageAcc />} /> {/* Add the ManageAcc route */}
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
