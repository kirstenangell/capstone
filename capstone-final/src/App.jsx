import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Global Components
import Header from "./global/Header";
import Navbar from "./global/Navbar";
import InventoryNavbar from './global/InventoryNavbar';
import Footer from "./global/Footer";
import ContactUs from "./global/ContactUs";
import Faqs from "./global/Faqs";
import Terms from "./global/Terms";
import Shipping from "./global/Shipping";
import Returns from "./global/Returns";

// Page Components
import LandingPage from './pages/LandingPage';
import AboutUsPage from "./pages/AboutUsPage";
import ServicePage from "./pages/ServicePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ManageAcc from "./login-page-component/ManageAcc"; 
import Dashboard from './inventory/Dashboard';
import InventoryPage from "./inventory/InventoryPage";
import OrderPage from "./inventory/OrderPage";
import CustomerPage from "./inventory/CustomerPage";
import UserPage from "./inventory/UserPage";
import SupplierPage from './inventory/SupplierPage'; 
import InventoryLanding from './inventory-page-component/InventoryLanding';
import OrderDetails from './order-page-component/OrderDetails';
import ProductInformation from './inventory-page-component/ProductInformation'; 
import SupplierInformation from './supplier-page-component/SupplierInformation'; 
import SupplierAddress from './supplier-page-component/SupplierAddress'; 
import ProductDetail from './product-page-component/ProductDetail';
import Login from './login-page-component/Login';
import ForgotPassword from './login-page-component/ForgotPassword';
import ProductSection from './product-page-component/ProductSection';



// Context Providers
import { CustomerProvider } from './context/CustomerContext';
import { ProductProvider } from './context/ProductContext'; 
import { OrderProvider } from './context/OrderContext'; 
import { SupplierProvider } from './context/SupplierContext'; 
import SetPassword from './login-page-component/SetPassword';


function App() {
  // Cart State Management
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  // Cart Functions
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

  const [products, setProducts] = useState([
    { id: 1, name: 'Wheel A', price: 30000, image: 'path_to_image', description: 'Some description' },
    { id: 2, name: 'Wheel B', price: 32000, image: 'path_to_image', description: 'Some description' }
  ]);

  const addNewProduct = (newProduct) => {
    setProducts([...products, newProduct]); // Add new product to the state
  };

  const cartItemCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);

  return ( 
    <ProductProvider>
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
                    <InventoryPage onPublish={addNewProduct} />
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
            
            {/* Supplier Routes Wrapped with SupplierProvider */}
            <Route
              path="/supplier/*"
              element={
                <SupplierProvider>
                  <>
                    <InventoryNavbar cartItemCount={cartItemCount} />
                    <SupplierPage />
                  </>
                </SupplierProvider>
              }
            />

          {/* OrderDetails Route Wrapped with CustomerProvider and OrderProvider */}
          <Route
            path="/order-details"
            element={
              <CustomerProvider>
                <OrderProvider>
                  <>
                    <InventoryNavbar cartItemCount={cartItemCount} />
                    <OrderDetails />
                  </>
                </OrderProvider>
              </CustomerProvider>
            }
          />
          
          {/* InventoryLanding Route Wrapped with ProductProvider */}
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
  
          {/* ProductInformation Route Wrapped with ProductProvider */}
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
          
          {/* Supplier Information Routes Wrapped with SupplierProvider */}
          <Route
            path="/supplier/supplier-information"
            element={
              <SupplierProvider>
                <>
                  <InventoryNavbar cartItemCount={cartItemCount} />
                  <SupplierInformation />
                </>
              </SupplierProvider>
            }
          />
          
          <Route
            path="/supplier/supplier-address"
            element={
              <SupplierProvider>
                <>
                  <InventoryNavbar cartItemCount={cartItemCount} />
                  <SupplierAddress />
                </>
              </SupplierProvider>
            }
          />

            {/* Supplier Information Routes Wrapped with SupplierProvider */}
            <Route
              path="/supplier/supplier-information"
              element={
                <SupplierProvider>
                  <>
                    <InventoryNavbar cartItemCount={cartItemCount} />
                    <SupplierInformation />
                  </>
                </SupplierProvider>
              }
            />
            
            <Route
              path="/supplier/supplier-address"
              element={
                <SupplierProvider>
                  <>
                    <InventoryNavbar cartItemCount={cartItemCount} />
                    <SupplierAddress />
                  </>
                </SupplierProvider>
              }
            />

            {/* Public Routes */}
            <Route
              path="*"
              element={
                <>
                  <Navbar cartItemCount={cartItems.length} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutUsPage />} />
                    <Route path="/services" element={<ServicePage />} />
                    <Route
                      path="/products"
                      element={
                        <ProductProvider>
                          <ProductSection onAddToCart={handleAddToCart} isLoggedIn={isLoggedIn} /> {/* Added ProductSection route */}
                        </ProductProvider>
                      }
                    />

                    <Route path="/cart/*" element={<CartPage cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onUpdateQuantity={handleUpdateQuantity} />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/login/*" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/login/forgot-password" element={<ForgotPassword />} />
                    <Route path="/set-password" element={<SetPassword />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/faqs" element={<Faqs />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route 
                      path="/product-detail" 
                      element={<ProductDetail onAddToCart={handleAddToCart} isLoggedIn={isLoggedIn} />}
                    />
                    <Route path="/manage-account" element={<ManageAcc />} />



                  </Routes>
                </>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ProductProvider>
  );
}

export default App;