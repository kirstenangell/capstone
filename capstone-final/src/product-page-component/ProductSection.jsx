import React, { useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import Wheel1 from "../assets/wheel1.png";
import Wheel2 from "../assets/wheel2.png";
import Wheel3 from "../assets/wheel3.png";
import Wheel4 from "../assets/wheel4.png";
import Wheel5 from "../assets/wheel5.png";
import Wheel6 from "../assets/wheel6.png";
import Wheel7 from "../assets/wheel7.png";
import Wheel8 from "../assets/wheel8.png";
import dashboardImage from '../assets/dashboard.png';

const products = [
  { 
    id: 1, 
    image: Wheel5, 
    name: "PRODUCT NAME", 
    price: "PHP30,000.00", 
    reviews: 11, 
    rating: 4,
    relatedImages: [Wheel1, Wheel2, Wheel3] 
  },
  { 
    id: 2, 
    image: Wheel6, 
    name: "PRODUCT NAME", 
    price: "PHP30,000.00", 
    reviews: 11, 
    rating: 4,
    relatedImages: [Wheel2, Wheel3, Wheel4]
  },
  { 
    id: 3, 
    image: Wheel7, 
    name: "PRODUCT NAME", 
    price: "PHP30,000.00", 
    reviews: 11, 
    rating: 4,
    relatedImages: [Wheel3, Wheel4, Wheel5]
  },
  { 
    id: 4, 
    image: Wheel8, 
    name: "PRODUCT NAME", 
    price: "PHP30,000.00", 
    reviews: 11, 
    rating: 4,
    relatedImages: [Wheel4, Wheel5, Wheel6]
  },
];

const ProductSection = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="relative min-h-screen bg-black text-white pb-80">
      {!selectedProduct && (
        <div className="relative w-full h-[700px] bg-no-repeat bg-center bg-cover">
          <div className="absolute inset-0">
            <div 
              className="w-full h-full bg-no-repeat bg-center bg-cover"
              style={{ backgroundImage: `url(${dashboardImage})`, opacity: 0.3, zIndex: -1 }}
            />
          </div>

          {/* Hero Section */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <h1 className="text-4xl font-bold">PRODUCT NAME</h1>
            <p className="mt-4 text-lg text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla neque quam, maximus in sagittis quis, sollicitudin non nisi.
            </p>
            <button className="mt-6 bg-black text-gray-200 py-2 pl-10 pr-8 rounded-full focus:outline-none placeholder-gray-500 bg-opacity-75 border border-cyan-900 shadow-lg shadow-cyan-800/50 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-[0_0_15px_5px_rgba(0,255,255,0.5)]">
              SHOP NOW
            </button>
          </div>
        </div>
      )}

      {selectedProduct ? (
        <div className="max-w-7xl mx-auto p-6">
          {/* Back Button */}
          <button 
            onClick={handleBackToProducts}
            className="mb-6 text-white bg-gray-800 py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Back to Products
          </button>
          {/* Product Detail View */}
          <div className="flex">
            {/* Left Side - Thumbnails and Main Image */}
            <div className="flex">
              {/* Thumbnails */}
              <div className="flex flex-col justify-center space-y-4">
                {selectedProduct.relatedImages.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`Related image ${index + 1}`} 
                    className={`w-16 h-16 object-contain cursor-pointer ${selectedProduct.image === image ? 'border-2 border-blue-500' : 'border-2 border-transparent'}`}
                    onClick={() => setSelectedProduct({ ...selectedProduct, image })}
                  />
                ))}
              </div>
              
              {/* Main Image */}
              <div className="ml-4">
                <div className="bg-gradient-to-b from-[#62B1D4]/[0.2] to-[#000000] rounded-lg p-4 shadow-lg">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-96 h-96 object-contain rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="ml-12 flex-1">
              <h1 className="text-3xl font-medium">{selectedProduct.name}</h1>
              <p className="mt-4 text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim 
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex eado consequat.
              </p>
              <div className="flex items-center mt-4">
                <span className="text-[#335C6E]">
                  {Array.from({ length: selectedProduct.rating }, (_, index) => (
                    <>&#9733; </>
                  ))}
                  {Array.from({ length: 5 - selectedProduct.rating }, (_, index) => (
                    <>&#9734; </>
                  ))}
                </span>
                <span className="ml-2 text-sm text-gray-400">({selectedProduct.reviews} Reviews)</span>
              </div>
              <div className="text-3xl font-bold mt-4 bg-gradient-to-r from-[#335C6E] to-[#979797] bg-clip-text text-transparent">
                {selectedProduct.price}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center mt-4">
                <button 
                  onClick={() => setSelectedProduct({ ...selectedProduct, quantity: selectedProduct.quantity > 1 ? selectedProduct.quantity - 1 : 1 })}
                  className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none hover:bg-gray-700"
                >-</button>
                <div className="px-4 py-2 bg-gray-900 text-white">
                  {selectedProduct.quantity || 1}
                </div>
                <button 
                  onClick={() => setSelectedProduct({ ...selectedProduct, quantity: (selectedProduct.quantity || 1) + 1 })}
                  className="px-4 py-2 bg-gray-800 text-white rounded-r-md focus:outline-none hover:bg-gray-700"
                >+</button>
              </div>

              {/* Product Description */}
              <div className="mt-6 space-y-2 text-gray-400 font-thin">
                <p>Loren Ipsum: Sed do eiusmod tempor incididunt ut labore et</p>
                <p>Loren Ipsum: Sed do eiusmod tempor incididunt ut labore et</p>
                <p>Loren Ipsum: Sed do eiusmod tempor incididunt ut labore et</p>
                <p>Loren Ipsum: Sed do eiusmod tempor incididunt ut labore et</p>
              </div>

              {/* Action Buttons */}
              <div className="flex mt-6 space-x-4">
                <button 
                  className="px-6 py-2 text-white bg-black rounded-md focus:outline-none hover:bg-black border border-[#62B1D1]"
                >ADD TO CART</button>
                <button 
                  className="px-6 py-2 text-white bg-black rounded-md focus:outline-none hover:bg-black border border-[#62B1D1]"
                >BUY NOW</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filter Section */}
          <div className="relative mt-20 mb-20 px-6 md:px-12 lg:px-64">
            <div className="flex items-center w-full relative">
              <input
                type="text"
                placeholder="Search product"
                className="italic w-full bg-black text-white py-2 pl-10 pr-4 rounded-md focus:outline-none placeholder-gray-500 bg-opacity-75 border border-cyan-900 shadow-lg shadow-cyan-900/50"
              />
              <button
                onClick={toggleDropdown}
                className="italic bg-black text-white py-2 px-4 rounded-md border-l-0 border border-cyan-900 flex items-center space-x-2 focus:outline-none shadow-lg shadow-cyan-900/50"
              >
                <span>Filter</span>
                <FaChevronDown />
              </button>
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-400" />
              </span>
            </div>

            {/* Dropdown Box */}
            {isDropdownOpen && (
              <div className="absolute right-64 mt-2 w-46 bg-black text-white rounded-md shadow-lg border border-cyan-900 shadow-cyan-900/50 z-10">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-700">Alphabetical (A-Z)</li>
                  <li className="px-4 py-2 hover:bg-gray-700">Alphabetical (Z-A)</li>
                  <li className="px-4 py-2 hover:bg-gray-700">Price ↑</li>
                  <li className="px-4 py-2 hover:bg-gray-700">Price ↓</li>
                </ul>
              </div>
            )}
          </div>

          {/* Product Grid Section */}
          <div className="relative mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 lg:px-24">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] rounded-lg p-4 shadow-lg cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="w-full h-80 rounded-t-lg flex items-center justify-center">
                  <img src={product.image} alt="Wheel" className="object-contain h-full rounded-md" />
                </div>
                <div className="mt-4">
                  <h2 className="text-sm font-light italic text-gray-400">LOREM IPSUM</h2>
                  <p className="text-lg font-bold text-white mt-1">{product.name}</p>
                  <p className="text-lg font-semibold text-gray-400 mt-1">{product.price}</p>
                  <button 
                    className="mt-4 bg-gradient-to-r from-[#4B88A3]/[0.3] via-[#040405] to-[#4B88A3]/[0.3] text-white py-2 px-4 rounded-lg hover:from-cyan-400 hover:to-blue-400 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle add to cart logic
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductSection;
