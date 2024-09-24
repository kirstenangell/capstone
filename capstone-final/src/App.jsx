// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./global/Header";
import Navbar from "./global/Navbar";
import InventoryNavbar from './global/InventoryNavbar';
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
import ManageAcc from "./login-page-component/ManageAcc"; 
import Dashboard from './inventory/Dashboard';
import CustomerPage from "./inventory/CustomerPage";
import InventoryPage from "./inventory/InventoryPage";
import OrderPage from "./inventory/OrderPage";
import UserPage from "./inventory/UserPage";
import SupplierPage from './inventory/SupplierPage';

// Import CustomerProvider
import { CustomerProvider } from './context/CustomerContext'; // Adjust the path if necessary

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <Routes>
          {/* Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <>
                <InventoryNavbar cartItemCount={cartItemCount} />
                <Dashboard />
              </>
            }
          />
          
          {/* Customer Routes Wrapped with CustomerProvider */}
          <Route
            path="/customer/*"
            element={
              <CustomerProvider>
                <>
                  <InventoryNavbar cartItemCount={cartItemCount} />
                  <CustomerPage />
                </>
              </CustomerProvider>
            }
          />
          
          {/* Inventory Routes */}
          <Route
            path="/inventory"
            element={
              <>
                <InventoryNavbar cartItemCount={cartItemCount} />
                <InventoryPage />
              </>
            }
          />
          <Route
            path="/order"
            element={
              <>
                <InventoryNavbar cartItemCount={cartItemCount} />
                <OrderPage />
              </>
            }
          />
          <Route
            path="/user"
            element={
              <>
                <InventoryNavbar cartItemCount={cartItemCount} />
                <UserPage />
              </>
            }
          />
          <Route
            path="/supplier"
            element={
              <>
                <InventoryNavbar cartItemCount={cartItemCount} />
                <SupplierPage />
              </>
            }
          />
          
          {/* Public Routes */}
          <Route
            path="*"
            element={
              <>
                <Navbar cartItemCount={cartItemCount} />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/services" element={<ServicePage />} />
                  <Route path="/products" element={<ProductPage onAddToCart={handleAddToCart} />} />
                  <Route path="/cart/*" element={<CartPage cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateQuantity} />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/login/*" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path="/manage-account" element={<ManageAcc />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/faqs" element={<Faqs />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/returns" element={<Returns />} />
                </Routes>
              </>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
