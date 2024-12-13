import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import CarMultimediaImage from '../assets/CarMultimediaImage.jpg';
import { ProductContext } from '../context/ProductContext';
import axios from 'axios';

const CarMultiMedia = ({ isLoggedIn }) => {
  const { products } = useContext(ProductContext); // Get products from context
  const location = useLocation();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Backend server

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  useEffect(() => {
    if (location.state?.product) {
      setSelectedProduct({ ...location.state.product, quantity: 0 });
    } else {
      setSelectedProduct(null);
    }
  }, [location.state]);

  useEffect(() => {
    // Filter products by "Car Multimedia" category
    if (products) {
      const carmultimediaProducts = products.filter((product) => product.category === 'Car Multimedia');
      setFilteredProducts(carmultimediaProducts);
    }
  }, [products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // If search is empty, show all Car Multimedia products
      setFilteredProducts(products.filter((product) => product.category === 'Car Multimedia'));
    } else {
      const searchResults = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(searchResults);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilter = (type) => {
    let sortedProducts = [];
    switch (type) {
      case 'A-Z':
        sortedProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Z-A':
        sortedProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
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

  const handleAddToCartClick = async (product) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing. Redirecting to login...');
      navigate('/login');
      return;
    }

    const payload = {
      user_id: userId,
      product_id: product.id,
      quantity: product.quantity || 1,
    };

    console.log('Add to Cart Payload:', payload);

    try {
      const response = await axios.post(`${baseUrl}/api/cart`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        console.log('Product added to cart successfully:', response.data);
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error.response?.data || error.message);
    }
  };

  const handleBuyNowClick = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing. Redirecting to login...');
      navigate('/login');
      return;
    }

    if (!selectedProduct || !selectedProduct.id) {
      console.error('Invalid product selection.');
      return;
    }

    const payload = {
      user_id: userId,
      product_id: selectedProduct.id,
      quantity: selectedProduct.quantity || 1,
    };

    console.log('Buy Now Payload:', payload);

    try {
      const response = await axios.post(`${baseUrl}/api/cart`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        console.log('Buy Now Success:', response.data);

        navigate('/checkout-landing', {
          state: {
            cartItems: [
              { ...selectedProduct, quantity: selectedProduct.quantity || 1 },
            ],
            total: selectedProduct.price * (selectedProduct.quantity || 1),
          },
        });
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error processing Buy Now action:', error.response?.data || error.message);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct({ ...product, quantity: 0 });
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Login Warning Modal */}
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
              className="w-full h-full bg-no-repeat bg-center bg-cover mt-10"
              style={{ backgroundImage: `url(${CarMultimediaImage})`, opacity: 0.3, zIndex: -1 }}
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <h1 className="text-4xl font-bold">Car Multimedia</h1>
            <p className="mt-4 text-lg text-gray-400">
              Discover the best Multimedia for immersive sound experiences.
            </p>
          </div>
        </div>
      )}

      {/* Product List Section */}
      {!selectedProduct && (
        <div className="relative mt-10 px-6 md:px-12 lg:px-64">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="relative flex-1">
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
      )}

      {!selectedProduct && (
        <div className="relative mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 lg:px-24">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const image = product.image.split(',')[0];
              return(
              <div
                key={product.id}
                className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] rounded-lg p-4 shadow-lg cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="w-full h-80 rounded-t-lg flex items-center justify-center">
                  <img
                    src={image}
                    alt={product.name || 'Product Image'}
                    className="object-contain h-full rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <h2 className="text-sm font-light italic text-gray-400">LOREM IPSUM</h2>
                  <p className="text-lg font-bold text-white mt-1">{product.name}</p>
                  <p className="text-lg font-semibold text-gray-400 mt-1">
                    PHP {typeof product.price === 'number' ? product.price.toLocaleString() : 'N/A'}
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
            )})
          ) : (
            <p className="italic text-gray-400 text-center col-span-full">
              No products found matching your search.
            </p>
          )}
        </div>
      )}

      {/* Product Detail Page */}
      {selectedProduct && (
        <div className="min-h-screen bg-black text-white p-6 mt-12">
          <div className="max-w-7xl mx-auto flex">
            {/* Left Side - Thumbnails and Main Image */}
            <div className="flex flex-col items-center space-y-4">
              {selectedProduct.relatedImages?.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={
                    image && image.startsWith('http')
                      ? image
                      : image
                      ? `${baseUrl}/${image.startsWith('/') ? image.slice(1) : image}`
                      : '' // Fallback for missing image
                  }
                  alt={`Related ${index}`}
                  className={`w-16 h-16 object-contain cursor-pointer ${
                    selectedProduct.image === image ? 'border-2 border-blue-500' : 'border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedProduct({ ...selectedProduct, image })}
                />
              ))}

              <div className="w-full rounded-lg p-8 shadow-lg flex items-center justify-center bg-black">
                <img
                  src={
                    selectedProduct.image && selectedProduct.image.startsWith('http')
                      ? selectedProduct.image
                      : selectedProduct.image
                      ? `${baseUrl}/${selectedProduct.image.startsWith('/') ? selectedProduct.image.slice(1) : selectedProduct.image}`
                      : '' // Fallback for missing image
                  }
                  alt={selectedProduct.name || 'Product Image'}
                  className="w-96 h-96 object-contain"
                />
              </div>

              {selectedProduct.relatedImages?.slice(3).map((image, index) => (
                <img
                  key={index}
                  src={
                    image && image.startsWith('http')
                      ? image
                      : image
                      ? `${baseUrl}/${image.startsWith('/') ? image.slice(1) : image}`
                      : '' // Fallback for missing image
                  }
                  alt={`Related ${index}`}
                  className={`w-16 h-16 object-contain cursor-pointer ${
                    selectedProduct.image === image ? 'border-2 border-blue-500' : 'border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedProduct({ ...selectedProduct, image })}
                />
              ))}
            </div>

            {/* Right Side - Product Details */}
            <div className="ml-12 flex-1">
              <h1 className="text-3xl font-medium">{selectedProduct.name}</h1>
              <p className="mt-4 text-gray-400">
                {selectedProduct.description || 'No description provided.'}
              </p>

              <div className="flex items-center mt-4">
                <span className="text-[#335C6E] text-2xl">
                  &#9733; &#9733; &#9733; &#9733; &#9734;
                </span>
                <span className="ml-2 text-sm text-gray-400">(11 Reviews)</span>
              </div>

              <div className="text-3xl font-bold mt-4 bg-gradient-to-r from-[#335C6E] to-[#979797] bg-clip-text text-transparent">
                PHP {typeof selectedProduct.price === 'number' ? selectedProduct.price.toLocaleString() : 'N/A'}
              </div>

              <div className="flex items-center mt-4">
                <button
                  onClick={() =>
                    setSelectedProduct({
                      ...selectedProduct,
                      quantity: Math.max((selectedProduct.quantity || 0) - 1, 0),
                    })
                  }
                  className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none hover:bg-gray-700"
                >
                  -
                </button>
                <div className="px-4 py-2 bg-gray-900 text-white">
                  {selectedProduct.quantity || 0}
                </div>
                <button
                  onClick={() =>
                    setSelectedProduct({
                      ...selectedProduct,
                      quantity: (selectedProduct.quantity || 0) + 1,
                    })
                  }
                  className="px-4 py-2 bg-gray-800 text-white rounded-r-md focus:outline-none hover:bg-gray-700"
                >
                  +
                </button>
              </div>

              <div className="mt-6 space-y-2 text-gray-400 font-thin">
                <p>Product Type: {selectedProduct.type || 'N/A'}</p>
                <p>Category: {selectedProduct.category || 'N/A'}</p>
                <p>Dimensions: {selectedProduct.dimensions || 'N/A'}</p>
                <p>Color: {selectedProduct.color || 'N/A'}</p>
                <p>Finish: {selectedProduct.finish || 'N/A'}</p>
                <p>Material: {selectedProduct.material || 'N/A'}</p>
                <p>Model: {selectedProduct.model || 'N/A'}</p>
              </div>

              <div className="flex mt-6 space-x-4">
                <button
                  onClick={() => handleAddToCartClick(selectedProduct)}
                  className="px-6 py-2 text-white bg-black rounded-md focus:outline-none border border-[#62B1D1] hover:bg-gray-800 transition-colors"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNowClick}
                  className="px-6 py-2 text-white bg-black rounded-md focus:outline-none border border-[#62B1D1] hover:bg-gray-800 transition-colors"
                >
                  BUY NOW
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-4">You may also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const image = product.image.split(',')[0];
                return(
                <div
                  key={product.id}
                  className="text-white p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ backgroundColor: 'rgba(217, 217, 217, 0.04)' }}
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={image}
                    alt={product.name || 'Product Image'}
                    className="w-full h-64 object-contain rounded-md"
                  />
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">LOREM IPSUM</p>
                    <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                    <p className="text-3xl font-bold mt-4 bg-gradient-to-r from-[#335C6E] to-[#979797] bg-clip-text text-transparent">
                      PHP {typeof product.price === 'number' ? product.price.toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              )})}
            </div>
          </div>
          <button
            onClick={handleBackToList}
            className="mt-4 text-white bg-blue-500 rounded px-4 py-2"
          >
            Back to Products
          </button>
        </div>
      )}
    </div>
  );
};

export default CarMultiMedia;
