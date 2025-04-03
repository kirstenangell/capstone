import React, { useState, useEffect } from 'react';
import { IoIosRemove, IoIosAdd } from 'react-icons/io';
import { IoArrowForwardCircle } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { RiDeleteBin2Line } from "react-icons/ri";
import cartImg from '../assets/CartSection.jpeg';
import { LiaOpencart } from "react-icons/lia";
import axios from 'axios';


const CartSection = ({ onRemoveFromCart }) => {
  const [quantities, setQuantities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSelectedModal, setShowSelectedModal] = useState(false); // Modal for selected items
  const [removeIndex, setRemoveIndex] = useState(null);
  const [showSelectors, setShowSelectors] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [fetchedCartItems, setFetchedCartItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0); // Store subtotal
  const [cartCount, setCartCount] = useState(0); // To store the cart count
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';




  const fetchCartItems = async () => {
    const userId = localStorage.getItem('userId'); // Ensure the user is logged in
    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      if (response.status === 200) {
        const fetchedItems = response.data.cartItems;
        const mergedItems = mergeSimilarItems(fetchedItems); // Merge similar products
        setCartItems(mergedItems);
        setQuantities(mergedItems.map((item) => item.quantity || 1));
        calculateSubtotal(mergedItems);
        // Update cart count based on merged items
        const newCartCount = mergedItems.reduce((count, item) => count + item.quantity, 0);
        updateCartCount(newCartCount);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };





  // Fetch cart items on mount
  useEffect(() => {
    fetchCartItems();
  }, []);





  const mergeSimilarItems = (items) => {
    const merged = [];
    const itemMap = new Map();

    items.forEach((item) => {
      const key = item.name; // Use product name as the key for merging
      if (itemMap.has(key)) {
        const existingItem = itemMap.get(key);
        existingItem.quantity += item.quantity; // Add quantities
      } else {
        itemMap.set(key, { ...item });
      }
    });

    itemMap.forEach((value) => merged.push(value));
    return merged;
  };


  // Calculate subtotal and total
  const calculateSubtotal = (items) => {
    const total = items.reduce((sum, item, index) => {
      const quantity = quantities[index] || item.quantity || 0;
      return sum + quantity * (item.price || 0);
    }, 0);
    setSubtotal(total);
  };
  
  // Trigger subtotal calculation on quantities change
  useEffect(() => {
    calculateSubtotal(cartItems);
  }, [quantities, cartItems]);
  
  const updateCartCount = () => {
    const totalItems = cartItems.reduce((total, item, index) => {
      return total + (quantities[index] || item.quantity || 0);
    }, 0);
    setCartCount(totalItems);
  };
  
  // Update cart count on quantities or cartItems change
  useEffect(() => {
    updateCartCount();
  }, [quantities, cartItems]);
  

  // Update item quantity
  const handleQuantityChange = async (index, action) => {
    const updatedQuantities = [...quantities];

    // Adjust quantity based on the action
    if (action === 'increase') {
        updatedQuantities[index]++;
    } else if (action === 'decrease' && updatedQuantities[index] > 1) {
        updatedQuantities[index]--;
    } else {
        return; // Prevent quantity from going below 1
    }
    const cartId = cartItems[index].cartId;
    // Debugging logs
    console.log('Updating cartId:', cartId);
    console.log('New Quantity:', updatedQuantities[index]);

    try {
        // Send the updated quantity to the server
        const response = await axios.put(`http://localhost:5000/api/cart/${cartId}`, {
          quantity: updatedQuantities[index],
      });
      if (response.status === 200) {
          // Update state only if the server update is successful
          setQuantities(updatedQuantities);
          setCartItems((prevItems) => {
              const newItems = [...prevItems];
              newItems[index].quantity = updatedQuantities[index];
              return newItems;
          });
          calculateSubtotal(cartItems); // Recalculate subtotal
      }
  } catch (error) {
    console.error('Error updating quantity:', error);
    console.error('Error updating quantity:', error.response?.data || error.message);
    alert('Unable to update quantity. Please try again.');
}
};



const handleDeleteClick = (index) => {
setRemoveIndex(index);
setShowModal(true);
};


// Confirm removal of item
const handleConfirmRemove = async () => {
try {
  const cartId = cartItems[removeIndex].cartId;
  await axios.delete(`${baseUrl}/api/cart/${cartId}`);
  const updatedCartItems = cartItems.filter((_, i) => i !== removeIndex);
  setCartItems(updatedCartItems);
  setQuantities(updatedCartItems.map((item) => item.quantity || 1));
  calculateSubtotal(updatedCartItems);
  setShowModal(false);
} catch (error) {
  console.error('Error removing product from cart:', error);
}
};


const handleCancelRemove = () => {
setShowModal(false);
};




const handleSelectToggle = () => {
setShowSelectors((prev) => !prev);
setShowDeleteButton((prev) => !prev);
};




const handleCheckboxChange = (index, checked) => {
setSelectedItems((prev) =>
  checked ? [...prev, index] : prev.filter((itemIndex) => itemIndex !== index)
);
};




const handleDeleteSelectedClick = () => {
setShowSelectedModal(true);
};


const handleCancelSelectedRemove = () => {
setShowSelectedModal(false);
};


return (
<div className="min-h-screen flex flex-col items-center bg-black text-white pt-[150px] pb-10 relative">
{showModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
      <div className="bg-black hover:shadow-blue-500/40 text-black p-6 rounded-lg shadow-md max-w-sm">
        <p className="mb-2 text-md font-semibold text-center text-white">
          Do you want to remove this product from the cart?
        </p>
        <p className="mb-6 text-xs text-center text-gray-600">
          You cannot undo this action.
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
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      {cartItems.length === 0 ? (
<div className="flex flex-col items-center justify-center h-full">
<div className="cart-icon">
  <span>{cartCount}</span> {/* This dynamically updates the cart count */}
</div>
<LiaOpencart size={100} className="mx-auto mb-8 text-gray-500" />
<h1 className="text-lg font-medium mb-4">Your Cart Is Currently Empty!</h1>
<p className="text-gray-400 mb-8 text-xs">Before proceeding to checkout you must add some products to your shopping cart.</p>
<NavLink
  to="/products"
  className="inline-block bg-gradient-to-r from-black to-[#4B88A3] text-white py-2 px-6 rounded-full font-normal text-xs"
>
  Return To Shop
</NavLink>
</div>
) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-left">Shopping Cart</h1>
            <div className="flex items-center space-x-4">
              {showDeleteButton && (
                <button
                  onClick={selectedItems.length > 0 ? handleDeleteSelectedClick : null}
                  className={`text-sm font-medium ${
                    selectedItems.length > 0
                      ? "text-red-500 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={selectedItems.length === 0}
                >
                  Delete Selected
                </button>
              )}
              <button
                onClick={handleSelectToggle}
                className="text-blue-400 font-medium text-sm"
              >
                {showSelectors ? "Deselect" : "Select"}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-4 border-b border-gray-700"
              >
                <div className="flex items-center">
                  {showSelectors && (
                    <input
                      type="checkbox"
                      className="mr-2"
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                  )}
                  <img
                    src={item.image.split(',')[0]}
                    alt="Product"
                    className="w-12 h-12 mr-4"
                  />
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
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
                    <span className="text-md">{quantities[index]}</span>
                    <button
                      onClick={() => handleQuantityChange(index, 'increase')}
                      className="focus:outline-none"
                    >
                      <IoIosAdd size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="font-semibold text-blue-400 text-sm">
                    PHP {item.price ? (item.price * quantities[index]).toLocaleString() : '0.00'}
                  </div>
                  {!showSelectors && (
                    <RiDeleteBin2Line
                      size={20}
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleDeleteClick(index)}
                    />
                  )}
                </div>
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
              <span className="text-blue-400">PHP {subtotal.toLocaleString()}</span>
            </div>
          </div>
          <NavLink
            to="checkout-landing"
            state={{ cartItems, subtotal }}
            className="w-full mt-8"
          >
            <button
              className="w-full py-2 rounded-full font-semibold flex items-center justify-center"
              style={{
                background: 'linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%)',
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.9)',
              }}
            >
              Proceed to Checkout
              <IoArrowForwardCircle className="ml-2" />
            </button>
          </NavLink>
        </>
      )}
    </div>
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