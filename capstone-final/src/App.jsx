import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from "./global/Header";
import Navbar from "./global/Navbar";
import Footer from "./global/Footer";

import LandingPage from "./pages/LandingPage";
import AboutUsPage from "./pages/AboutUsPage";
import ServicePage from "./pages/ServicePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage"; // CartPage will manage both CartSection and CheckoutLanding
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage"; 
import ContactUs from "./global/ContactUs";
import Faqs from "./global/Faqs";
import Terms from "./global/Terms";
import Shipping from "./global/Shipping";
import Returns from "./global/Returns";

function App() {
  return (
    <Router>
      <div style={{ background: 'black' }}>
        <Header />
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/cart/*" element={<CartPage />} /> {/* Ensures all cart-related routes are handled */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login/*" element={<LoginPage />} />
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
