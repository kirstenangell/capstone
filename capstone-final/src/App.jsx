import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./global/Navbar";
import LandingPage from "./pages/LandingPage";
import AboutUsPage from "./pages/AboutUsPage";
import ServicePage from "./pages/ServicePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Footer from "./global/Footer";
import Header from "./global/header";
import ProductDetail from "./product-page-component/ProductDetail";

function App() {
  return (
    <Router>
      <Header/>
      <Navbar />
      <Footer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
