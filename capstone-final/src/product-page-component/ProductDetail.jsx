import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext'; 
import Wheel1 from "../assets/wheel1.png";
import Wheel2 from "../assets/wheel2.png";
import Wheel3 from "../assets/wheel3.png";
import Wheel5 from "../assets/wheel5.png";

const ProductDetail = ({ onAddToCart }) => {
  const { products } = useContext(ProductContext); 
  const location = useLocation(); 
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(location.state?.product || products[0]);
  
  useEffect(() => {
    if (location.state?.product) {
      setSelectedProduct(location.state.product);
    }
  }, [location.state]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = () => {
    onAddToCart({ ...selectedProduct, quantity: selectedProduct.quantity || 1 });
  };
  

  const handleBuyNow = () => {
    onAddToCart({ ...selectedProduct, quantity: selectedProduct.quantity || 0 });
    navigate('/cart'); 
  };

  

  return (
    <div className="min-h-screen bg-black text-white p-6 mt-12">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Side - Thumbnails and Main Image */}
        <div className="flex">
          {/* Thumbnails */}
          <div className="flex flex-col justify-center space-y-4">
            {selectedProduct.relatedImages?.map((image, index) => (
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
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name} 
              className="w-96 h-96 object-contain"
            />
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="ml-12 flex-1">
          <h1 className="text-3xl font-medium">{selectedProduct.name}</h1>
          <p className="mt-4 text-gray-400">
            {selectedProduct.description || 'No description provided.'}
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
              onClick={() => setSelectedProduct({ ...selectedProduct, quantity: selectedProduct.quantity > 0 ? selectedProduct.quantity - 1 : 0 })}
              className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none hover:bg-gray-700"
            >-</button>
            <div className="px-4 py-2 bg-gray-900 text-white">
              {selectedProduct.quantity || 0}
            </div>
            <button 
              onClick={() => setSelectedProduct({ ...selectedProduct, quantity: (selectedProduct.quantity || 0) + 1 })}
              className="px-4 py-2 bg-gray-800 text-white rounded-r-md focus:outline-none hover:bg-gray-700"
            >+</button>
          </div>

          {/* Product Additional Details */}
          <div className="mt-6 space-y-2 text-gray-400 font-thin">
            <p>Product Type: {selectedProduct.type || 'N/A'}</p>
            <p>Category: {selectedProduct.category || 'N/A'}</p>
            <p>Dimensions: {selectedProduct.dimensions || 'N/A'}</p>
            <p>Color: {selectedProduct.color || 'N/A'}</p>
            <p>Finish: {selectedProduct.finish || 'N/A'}</p>
            <p>Material: {selectedProduct.material || 'N/A'}</p>
            <p>Model: {selectedProduct.model || 'N/A'}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex mt-6 space-x-4">
            <button 
              onClick={handleAddToCart}
              className="px-6 py-2 text-white bg-black rounded-md focus:outline-none hover:bg-black border border-[#62B1D1]"
            >ADD TO CART</button>
            <button 
              onClick={handleBuyNow}
              className="px-6 py-2 text-white bg-black rounded-md focus:outline-none hover:bg-black border border-[#62B1D1]"
            >BUY NOW</button>
          </div>
        </div>
      </div>
      
      {/* "You may also like" Section */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="text-white p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
              style={{ backgroundColor: 'rgba(217, 217, 217, 0.04)' }}
              onClick={() => handleProductClick(product)}
            >
              <img src={product.image} alt={product.name} className="w-full h-64 object-contain rounded-md" />
              <div className="mt-4">
                <p className="text-sm text-gray-400">LOREM IPSUM</p>
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-3xl font-bold mt-4 bg-gradient-to-r from-[#335C6E] to-[#979797] bg-clip-text text-transparent">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
