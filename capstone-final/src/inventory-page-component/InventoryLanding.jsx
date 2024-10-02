// src/inventory-page-component/InventoryLanding.jsx
import React, { useState, useEffect, useContext } from 'react';
import { IoMdClose } from 'react-icons/io'; // Close Icon
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'; // Password Visibility Icons
import { useNavigate } from 'react-router-dom';
import Wheel1 from '../assets/wheel1.png'; // Replace with your actual image path
import { CiSearch } from "react-icons/ci"; // Search icon
import { BsBoxArrowRight } from "react-icons/bs";
import { ProductContext } from '../context/ProductContext'; // Import ProductContext

const InventoryLanding = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [actionType, setActionType] = useState(''); // Track action type (add/edit/archive)

  const navigate = useNavigate();

  // Use ProductContext
  const { products, archiveProduct } = useContext(ProductContext);

  const handleProductClick = (product) => {
    setSelectedProduct(product); // Set selected product when clicked
  };

  const handleExit = () => {
    setSelectedProduct(null); // Close product summary
  };

  const handleAddProductClick = () => {
    navigate('/inventory/product-information');
  };

  const handleEditClick = () => {
    setActionType('edit'); // Set action to edit
    setShowPasswordModal(true); // Show password modal when editing
  };

  const handleArchiveClick = () => {
    setActionType('archive'); // Set action to archive
    setShowPasswordModal(true); // Show password modal when archiving
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword(''); // Reset the password input
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle password visibility
  };

  // Handle submit logic for the password modal
  const handlePasswordSubmit = () => {
    if (password === '12345') { // Replace '12345' with the actual password logic
      if (actionType === 'edit') {
        // Navigate to ProductInformation.jsx with the selectedProduct data for editing
        navigate('/inventory/product-information', { state: { product: selectedProduct, isEdit: true } });
      } else if (actionType === 'archive') {
        // Archive the product
        archiveProduct(selectedProduct.id);
        setSelectedProduct(null);
      }
    } else {
      alert('Incorrect Password'); // Add any error handling logic if needed
    }
    setShowPasswordModal(false);
    setPassword(''); // Clear the password field after submission
  };

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">PRODUCT</h1>

          <div className="flex items-center">
            {/* Search input with icon */}
            <div className="flex items-center border-b border-gray-600">
              <CiSearch className="text-gray-600 text-xl mr-2" /> {/* Icon before the input */}
              <input
                type="text"
                placeholder="Search product"
                className="bg-transparent text-gray-600 px-4 py-2 focus:outline-none"
              />
            </div>

            {/* Add Product Button */}
            <button
              onClick={handleAddProductClick}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#335C6E] to-[#000000] text-white rounded-lg text-sm"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Sidebar Filters */}
        <div className="grid grid-cols-4 gap-10">
          <div className="space-y-6 col-span-1">
            {[
              'Product Status',
              'Product Type',
              'Stock Alert',
              'Category',
              'Product Price',
              'Product Brand',
            ].map((label, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium mb-2">{label}</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gradient-to-r from-[#4B88A3] via-[#040405] to-[#4B88A3] border border-gray-700 rounded-md text-sm placeholder-gray-400"
                  placeholder="Lorem Ipsum Dolor"
                />
              </div>
            ))}
          </div>

          {/* Product List */}
          <div className="col-span-3">
            {/* Product Cards */}
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-center text-gray-400">
                  No products found
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] rounded-lg p-4 shadow-lg flex justify-between items-center cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex items-center">
                      <div className="w-24 h-24 bg-gray-800 rounded-lg mr-6">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-bold text-white">{product.name}</h2>
                        <p className="text-sm text-gray-400">Retail Price | Stock | Variant | Timestamp</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Product Summary Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-[#040405] p-10 rounded-lg shadow-xl max-w-3xl w-full relative">
              <div className="flex justify-between items-start mb-4">
                {/* Left Section: Close Button */}
                <div className="flex flex-col items-start">
                  <button
                    onClick={handleExit}
                    className="bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg p-2 mb-2 shadow-md"
                  >
                    <BsBoxArrowRight className="text-white text-md" />
                  </button>
                </div>

                {/* Right Section: Edit and Archive buttons */}
                <div className="space-x-4">
                  <button
                    onClick={handleEditClick}
                    className="text-sm text-white hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleArchiveClick}
                    className="text-sm text-white hover:underline"
                  >
                    Archive
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    {selectedProduct.name}
                  </h1>
                  <p className="text-sm text-gray-400">{selectedProduct.description}</p>

                  {/* Product Image with Faint Gray Background */}
                  <div className="mt-4 bg-gray-700 p-2 rounded-lg">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-contain rounded-lg"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0 md:ml-10">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <h2 className="col-span-2 text-lg font-bold text-white mb-2">Basic Information</h2>
                    <div className="text-gray-400">
                      <p>Product Type:</p>
                      <p>Product Brand:</p>
                      <p>Product Category:</p>
                      <p>Product Description:</p>
                    </div>
                    <div className="text-white">
                      <p>{selectedProduct.type}</p>
                      <p>{selectedProduct.brand}</p>
                      <p>{selectedProduct.category}</p>
                      <p>{selectedProduct.description}</p>
                    </div>

                    <h2 className="col-span-2 text-lg font-bold text-white mt-4 mb-2">Measurement</h2>
                    <div className="text-gray-400">
                      <p>Dimensions:</p>
                      <p>Color:</p>
                      <p>Finish:</p>
                      <p>Material:</p>
                      <p>Model:</p>
                    </div>
                    <div className="text-white">
                      <p>{selectedProduct.dimensions}</p>
                      <p>{selectedProduct.color}</p>
                      <p>{selectedProduct.finish}</p>
                      <p>{selectedProduct.material}</p>
                      <p>{selectedProduct.model}</p>
                    </div>

                    <h2 className="col-span-2 text-lg font-bold text-white mt-4 mb-2">Sales Information</h2>
                    <div className="text-gray-400">
                      <p>Retail Price:</p>
                      <p>Tax:</p>
                      <p>Discount:</p>
                      <p>Total Price:</p>
                    </div>
                    <div className="text-white">
                      <p>{selectedProduct.price}</p>
                      <p>{selectedProduct.tax}</p>
                      <p>{selectedProduct.discount}</p>
                      <p>{selectedProduct.totalPrice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-[#040405] p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-lg font-bold mb-4 text-center">
                ACCESS INVENTORY TO {actionType === 'edit' ? 'EDIT PRODUCT #' + selectedProduct?.id : actionType === 'archive' ? 'ARCHIVE PRODUCT #' + selectedProduct?.id : 'ADD NEW PRODUCT'}
              </h2>
              <p className="mb-4 text-sm text-center">
                Enter your password to {actionType} the product in the inventory.
              </p>
              <label className="block text-xs font-bold mb-2">PASSWORD</label>
              <div className="relative">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                  style={{ background: 'linear-gradient(90deg, #040405, #335C6E)' }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-white"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <IoIosEyeOff /> : <IoIosEye />}
                </button>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  className="w-full px-6 text-sm py-2 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                  onClick={handlePasswordSubmit}
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryLanding;
