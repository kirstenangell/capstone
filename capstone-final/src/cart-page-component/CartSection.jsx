import React, { useState } from 'react';
import { IoIosRemove, IoIosAdd } from 'react-icons/io';
import { IoArrowForwardCircle } from 'react-icons/io5'; 
import { NavLink } from 'react-router-dom'; 
import cartImg from '../assets/CartSection.jpeg';
import partWheel from '../assets/wheel1.png';
import { LiaOpencart } from "react-icons/lia";

const CartSection = () => {
  const initialPrice = 30000;
  const [quantities, setQuantities] = useState([1, 1, 1, 1]);
  const [showModal, setShowModal] = useState(false); 
  const [removeIndex, setRemoveIndex] = useState(null);

  const calculateSubtotal = () => {
    return quantities.reduce((total, quantity) => {
      return total + quantity * initialPrice;
    }, 0);
  };

  const handleQuantityChange = (index, action) => {
    if (action === 'decrease' && quantities[index] === 1) {
      setRemoveIndex(index);
      setShowModal(true);
      return;
    }

    setQuantities((prevQuantities) => {
      const newQuantities = [...prevQuantities];
      if (action === 'increase') {
        newQuantities[index] += 1;
      } else if (action === 'decrease') {
        if (newQuantities[index] > 1) {
          newQuantities[index] -= 1;
        }
      }
      return newQuantities;
    });
  };

  const handleConfirmRemove = () => {
    setQuantities((prevQuantities) => prevQuantities.filter((_, i) => i !== removeIndex));
    setShowModal(false);
  };

  const handleCancelRemove = () => {
    setShowModal(false);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal;

  const cartItems = quantities.map((quantity, index) => ({
    product: `PRODUCT NAME ${index + 1}`,
    quantity,
    price: initialPrice,
    image: partWheel,
  }));

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white py-10 relative">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-black hover:shadow-blue-500/40 text-black p-6 rounded-lg shadow-md max-w-sm">
            <p className="mb-2 text-md font-semibold text-center text-white">
              Do you want to remove this product from the cart?
            </p>
            <p className="mb-6 text-xs text-center text-gray-600">
              You cannot undo this action
            </p>
            <div className="flex justify-around border-t pt-2">
              <button
                onClick={handleCancelRemove}
                className="py-2 px-4 text-blue-600 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="py-2 px-4 text-red-600 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full max-w-6xl mx-auto">
        <div
          className="w-full max-w-xl p-8 rounded-lg flex flex-col justify-between"
          style={{ 
            background: 'linear-gradient(90deg, #000000 45%, #040405 66%)', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
          }}
        >
          {quantities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <LiaOpencart size={100} className="mx-auto mb-8 text-gray-500" />
              <h1 className="text-lg font-medium mb-4">Your Cart Is Currently Empty!</h1>
              <p className="text-gray-400 mb-8 text-xs">
                Before proceeding to checkout you must add some products to your shopping cart.
              </p>
              <NavLink
                to="/products"
                className="inline-block bg-gradient-to-r from-black to-[#4B88A3] text-white py-2 px-6 rounded-full font-normal text-xs"
              >
                Return To Shop
              </NavLink>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-left mb-4">Shopping Cart</h1>
              <div className="space-y-4">
                {quantities.map((quantity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-4 border-b border-gray-700"
                  >
                    <div className="flex items-center">
                      <img
                        src={partWheel}
                        alt="Product"
                        className="w-12 h-12 mr-4"
                      />
                      <div>
                        <p className="font-semibold text-sm">PRODUCT NAME</p>
                        <p className="text-xs text-gray-400">Consectetur adipiscing</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div
                        className="flex items-center justify-between w-[90px] p-1.5 border border-gray-700 rounded-md text-gray-300 bg-black"
                      >
                        <button
                          onClick={() => handleQuantityChange(index, 'decrease')}
                          className="focus:outline-none"
                        >
                          <IoIosRemove size={14} />
                        </button>
                        <span className="text-md">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(index, 'increase')}
                          className="focus:outline-none"
                        >
                          <IoIosAdd size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="font-semibold text-blue-400 text-sm">PHP {initialPrice.toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="font-semibold text-lg mb-2">Summary</h2>
                <hr className="border-gray-700 mb-4" />

                <div className="flex justify-between text-gray-400 text-sm mb-2">
                  <span>Subtotal</span>
                  <span className="text-blue-400">PHP {subtotal.toLocaleString()}</span>
                </div>

                <hr className="border-gray-700 mb-2" />

                <div className="flex justify-between font-semibold text-sm mt-4">
                  <span>Total</span>
                  <span className="text-blue-400">PHP {total.toLocaleString()}</span>
                </div>
              </div>

              <NavLink 
                to="checkout-landing" // Relative path
                state={{ cartItems, total }}
                className="w-full mt-8"
              >
                <button
                  className="w-full py-2 rounded-full font-semibold bg-gradient-to-r from-[#4B88A3] via-[#000000] to-[#4B88A3] flex items-center justify-center"
                >
                  Proceed to Checkout
                  <IoArrowForwardCircle className="ml-2" />
                </button>
              </NavLink>
            </>
          )}
        </div>

        {/* Add back the image beside the cart section */}
        <div className="hidden lg:block lg:w-full lg:ml-8 lg:mr-8">
          <img
            src={cartImg}
            alt="Side"
            className="rounded-lg shadow-lg h-full w-full"
            style={{ objectFit: 'cover', marginRight: '1rem' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CartSection;
