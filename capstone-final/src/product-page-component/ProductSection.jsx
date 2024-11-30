import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import dashboardImage from '../assets/dashboard.png';
import { ProductContext } from '../context/ProductContext';
import axios from 'axios'; // Add this import statement

const ProductSection = ({ onAddToCart, isLoggedIn }) => {
  const { products } = useContext(ProductContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLoginWarning, setShowLoginWarning] = useState(false); // Warning state
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5173';
  console.log('Base URL:', baseUrl); // Add this line
  

  // Ensure all products display by default
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const searchResults = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(searchResults);
    }
  };

  const handleFilter = (type) => {
    let sortedProducts = [];
    switch (type) {
      case 'A-Z':
        sortedProducts = [...filteredProducts].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case 'Z-A':
        sortedProducts = [...filteredProducts].sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;
      case 'Price ↑':
        sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
        break;
      case 'Price ↓':
        sortedProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
        break;
      default:
        sortedProducts = filteredProducts;
    }
    setFilteredProducts(sortedProducts);
    setIsDropdownOpen(false);
  };

  const handleProductClick = (product) => {
    navigate('/product-detail', { state: { product } });
    window.scrollTo(0, 0);
  };


  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  const handleAddToCartClick = async (product) => {
    const userId = localStorage.getItem('userId'); // Ensure the user is logged in
    if (!userId) {
      console.error('User ID is missing. Redirecting to login...');
      navigate('/login');
      return;
    }
  
    // Prepare the payload
    const payload = {
      user_id: userId,
      product_id: product.id,
      quantity: product.quantity || 1,
    };
  
    try {
      // Make API call to add item to cart
      const response = await axios.post('http://localhost:5000/api/cart', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.status === 200) {
        console.log('Product added to cart:', response.data);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  


  const handleBuyNow = (product) => {
    if (isLoggedIn) {
      onAddToCart(product);
      navigate('/cart');
    } else {
      setShowLoginWarning(true);
    }
  };


  // Filtering related products by category (for recommendations)
  const getRelatedProducts = (product) => {
    return products.filter((p) => p.category === product.category && p.id !== product.id && !p.archived);
  };


  return (
    <div className="relative min-h-screen bg-black text-white pb-80">
      {showLoginWarning && !isLoggedIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-md shadow-lg">
            <p>You need to login</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Log in now
              </button>
              <button
                onClick={() => setShowLoginWarning(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      {!selectedProduct && (
        <div className="relative w-full h-[700px] bg-no-repeat bg-center bg-cover">
          <div className="absolute inset-0">
            <div
              className="w-full h-full bg-no-repeat bg-center bg-cover"
              style={{ backgroundImage: `url(${dashboardImage})`, opacity: 0.3, zIndex: -1 }}
            />
          </div>


          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-4xl font-bold">PRODUCTS</h1>
          <p className="mt-8 mx-8 text-sm text-gray-400">
            Discover our extensive range of high-quality auto parts and accessories, tailored to meet the needs of every car enthusiast. From advanced audio systems and cutting-edge security devices to durable tires and stylish exterior enhancements, each product is designed to improve performance and elevate your driving experience. Shop now to find the perfect upgrades for your vehicle.
          </p>

            <button className="mt-6 bg-black text-gray-200 py-2 pl-10 pr-8 rounded-full focus:outline-none placeholder-gray-500 bg-opacity-75 border border-cyan-900 shadow-lg shadow-cyan-800/50 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_15px_5px_rgba(0,255,255,0.5)]">
              SHOP NOW
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="relative mt-20 mb-20 px-6 md:px-12 lg:px-64">
      <form onSubmit={handleSearch} className="flex items-center space-x-4">
  <div className="relative flex-1">
    {/* Search bar with the icon inside */}
    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
      <FaSearch className="text-gray-400" />
    </span>
    <input
      type="text"
      placeholder="Search product"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="italic w-full bg-black text-white py-2 pl-10 pr-4 rounded-md focus:outline-none placeholder-gray-500 bg-opacity-75 border border-gray-700 shadow-none"
    />
  </div>
  {/* Filter button aligned */}
  <button
    type="button"
    onClick={toggleDropdown}
    className="italic bg-black text-white py-2 px-4 rounded-md flex items-center space-x-2 focus:outline-none border border-gray-700 shadow-none"
  >
    Filter <FaChevronDown />
  </button>
</form>

        {isDropdownOpen && (
          <div className="absolute right-64 mt-2 w-46 bg-black text-white rounded-md shadow-lg border border-cyan-900 shadow-cyan-900/50 z-10">
            <ul className="py-2">
              <li
                onClick={() => handleFilter('A-Z')}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Alphabetical (A-Z)
              </li>
              <li
                onClick={() => handleFilter('Z-A')}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Alphabetical (Z-A)
              </li>
              <li
                onClick={() => handleFilter('Price ↑')}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Price ↑
              </li>
              <li
                onClick={() => handleFilter('Price ↓')}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Price ↓
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="relative mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 lg:px-24">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] rounded-lg p-4 shadow-lg cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <div className="w-full h-80 rounded-t-lg flex items-center justify-center">
                <img
                  src={
                    product.image.startsWith('http')
                      ? product.image
                      : `${baseUrl}/${product.image.startsWith('/')
                          ? product.image.slice(1)
                          : product.image}`
                  }
                  alt={product.name}
                  className="object-contain h-full rounded-md"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-sm font-light italic text-gray-400">LOREM IPSUM</h2>
                <p className="text-lg font-bold text-white mt-1">{product.name}</p>
                <p className="text-lg font-semibold text-gray-400 mt-1">
                  PHP {product.price.toLocaleString()}
                </p>
                <button
                  className="mt-4 bg-gradient-to-r from-[#4B88A3]/[0.3] via-[#040405] to-[#4B88A3]/[0.3] text-white py-2 px-4 rounded-lg hover:from-cyan-400 hover:to-blue-400 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCartClick({ ...product, quantity: 1 });
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="italic text-gray-400 text-center col-span-full">
            No products found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSection;