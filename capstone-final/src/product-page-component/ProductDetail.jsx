import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import { useUser } from '../context/UserContext';

const ProductDetail = ({ onAddToCart, isLoggedIn, updateCartCount }) => {
  const { products } = useContext(ProductContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState({
    ...location.state?.product || products[0],
    quantity: 0,
  });
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  useEffect(() => {
    if (location.state?.product) {
      setSelectedProduct({ ...location.state.product, quantity: 0 });
    }
  }, [location.state]);

  const handleAddToCart = async (productId, quantity, setShowLoginWarning) => {
    const { user } = useUser(); // Extract user from the context

    if (!user) {
        console.error('User not logged in');
        setShowLoginWarning(true); // Show login warning if user is not logged in
        return;
    }

    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, productId, quantity })
        });
  
        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }
  
        console.log('Product added to cart successfully');
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
    }
};


  const handleBuyNowClick = async () => {
    if (isLoggedIn) {
      onAddToCart({ ...selectedProduct, quantity: selectedProduct.quantity || 1 });
            navigate('/cart');
      const userId = localStorage.getItem('userId');
  
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity: selectedProduct.quantity || 1,
        }),
      });
  
      if (response.ok) {
        navigate('/checkout-landing'); // Redirect to checkout
      } else {
        console.error('Error with Buy Now:', response.statusText);
      }
    } else {
      setShowLoginWarning(true);
    }
  };  

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 mt-12">
      {showLoginWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="p-6 bg-gradient-to-br from-[#4B88A3] to-[#000000] text-white rounded-md shadow-lg text-center">
            <p className="mb-4">You need to login</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLoginRedirect}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Log in now
              </button>
              <button
                onClick={() => setShowLoginWarning(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex">
        {/* Left Side - Thumbnails and Main Image */}
        <div className="flex flex-col justify-center space-y-4 mr-8">
          <div className="flex flex-col items-center space-y-4">
            {selectedProduct.relatedImages?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Related image ${index + 1}`}
                className={`w-16 h-16 object-contain cursor-pointer ${
                  selectedProduct.image === image ? 'border-2 border-blue-500' : 'border-2 border-transparent'
                }`}
                onClick={() => setSelectedProduct({ ...selectedProduct, image })}
              />
            ))}
          </div>

          <div className="w-full bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] rounded-lg p-8 shadow-lg flex items-center justify-center">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-96 h-96 object-contain" />
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="ml-12 flex-1">
          <h1 className="text-3xl font-medium">{selectedProduct.name}</h1>
          <p className="mt-4 text-gray-400">
            {selectedProduct.description || 'No description provided.'}
          </p>

          {/* Static Star Rating */}
          <div className="flex items-center mt-4">
            <span className="text-[#335C6E] text-2xl">
              &#9733; &#9733; &#9733; &#9733; &#9734; {/* Static 4 stars filled and 1 star empty */}
            </span>
            <span className="ml-2 text-sm text-gray-400">(11 Reviews)</span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold mt-4 bg-gradient-to-r from-[#335C6E] to-[#979797] bg-clip-text text-transparent">
            PHP {selectedProduct.price.toLocaleString()}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mt-4">
            <button
              onClick={() =>
                setSelectedProduct({
                  ...selectedProduct,
                  quantity: selectedProduct.quantity > 0 ? selectedProduct.quantity - 1 : 0,
                })
              }
              className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none hover:bg-gray-700"
            >
              -
            </button>
            <div className="px-4 py-2 bg-gray-900 text-white">{selectedProduct.quantity || 0}</div>
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

          {/* Additional Product Details */}
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

      {/* "You may also like" Section */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="text-white p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
              style={{ backgroundColor: 'rgba(217, 217, 217, 0.04)' }}
              onClick={() => setSelectedProduct({ ...product, quantity: 0 })}
            >
              <img src={product.image} alt={product.name} className="w-full h-64 object-contain rounded-md" />
              <div className="mt-4">
                <p className="text-sm text-gray-400">LOREM IPSUM</p>
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-3xl font-bold mt-4 bg-gradient-to-r from-[#335C6E] to-[#979797] bg-clip-text text-transparent">
                  PHP {product.price.toLocaleString()}
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
