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
import InventoryLanding from './inventory-page-component/InventoryLanding';
import OrderDetails from './order-page-component/OrderDetails';
import ProductInformation from './inventory-page-component/ProductInformation'; 
import { CustomerProvider } from './context/CustomerContext';
import { ProductProvider } from './context/ProductContext'; 
import { OrderProvider } from './context/OrderContext'; // Import OrderProvider

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
          
          {/* Inventory Routes Wrapped with ProductProvider */}
          <Route
            path="/inventory/*"
            element={
              <ProductProvider>
                <>
                  <InventoryNavbar cartItemCount={cartItemCount} />
                  <InventoryPage />
                </>
              </ProductProvider>
            }
          />
          
          {/* Order Routes Wrapped with OrderProvider */}
          <Route
            path="/order/*"
            element={
              <OrderProvider>
                <>
                  <InventoryNavbar cartItemCount={cartItemCount} />
                  <OrderPage />
                </>
              </OrderProvider>
            }
          />
          
          {/* User Routes */}
          <Route
            path="/user"
            element={
              <>
                <InventoryNavbar cartItemCount={cartItemCount} />
                <UserPage />
              </>
            }
          />
          
          {/* Supplier Routes */}
          <Route
            path="/supplier"
            element={
              <>
                <InventoryNavbar cartItemCount={cartItemCount} />
                <SupplierPage />
              </>
            }
          />

          {/* Route for OrderDetails Wrapped with OrderProvider */}
          <Route
            path="/order-details"
            element={
              <OrderProvider>
                <>
                  <InventoryNavbar cartItemCount={cartItemCount} />
                  <OrderDetails />
                </>
              </OrderProvider>
            }
          />
          
          {/* Route for InventoryLanding Wrapped with ProductProvider */}
          <Route
            path="/inventory"
            element={
              <ProductProvider>
                <>
                  <InventoryNavbar cartItemCount={cartItemCount} />
                  <InventoryLanding />
                </>
              </ProductProvider>
            }
          />

          {/* Route for ProductInformation Wrapped with ProductProvider */}
          <Route
            path="/inventory/product-information"
            element={
              <ProductProvider>
                <>
                  <InventoryNavbar cartItemCount={cartItemCount} />
                  <ProductInformation />
                </>
              </ProductProvider>
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
                  <Route
                    path="/products"
                    element={
                      <ProductProvider>
                        <>
                          <ProductPage onAddToCart={handleAddToCart} />
                        </>
                      </ProductProvider>
                    }
                  />
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
