// src/order-page-component/InventoryLanding.jsx
import React, { useState, useContext } from 'react';
import { IoMdClose } from 'react-icons/io'; // Close Icon
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'; // Password Visibility Icons
import { useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci"; // Search icon
import { BsBoxArrowRight } from "react-icons/bs";
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaOpencart } from 'react-icons/fa';
import { OrderContext } from '../context/OrderContext'; // Import OrderContext
import { ProductContext } from '../context/ProductContext'; // Import ProductContext
import LabelValue from '../global/LabelValue';

const InventoryLanding = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [actionType, setActionType] = useState(''); // Track action type (add/edit/archive)
  const [uploadedImages, setUploadedImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Initialize searchQuery state
  const navigate = useNavigate();

  // Use ProductContext to get products and product manipulation functions
  const { products, addProduct, updateProduct, archiveProduct } = useContext(ProductContext);

  // State for FILTER BY dropdown
  const [isFilterByOpen, setIsFilterByOpen] = useState(false);
  const [selectedFilterBy, setSelectedFilterBy] = useState('');

  // State for STATUS buttons
  const [activeStatus, setActiveStatus] = useState('All'); // Default is 'All'

  // Sample Filter By options (customize based on your requirements)
  const filterByOptions = ['All Types', 'Online', 'Offline', 'Express Delivery', 'Standard Delivery'];

  // Function to toggle FILTER BY dropdown
  const toggleFilterByDropdown = () => {
    setIsFilterByOpen(!isFilterByOpen);
  };

  // Function to handle selecting a FILTER BY option
  const handleFilterBySelect = (option) => {
    setSelectedFilterBy(option === 'All Types' ? '' : option);
    setIsFilterByOpen(false);
  };

  // Function to handle STATUS button click
  const handleStatusClick = (status) => {
    setActiveStatus(status);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setUploadedImages(product.images || []); // Ensure images is an array
  };

  const handlePublish = () => {
    if (selectedProduct) {
      const newProduct = {
        id: 'PID-' + Math.random().toString(36).substr(2, 9), // Generate a prefixed unique ID
        name: selectedProduct.name || "Untitled Product",
        image: selectedProduct.image || "/assets/wheel1.png", // Use a default image if not provided
        price: selectedProduct.price || 0,
        reviews: selectedProduct.reviews || 0,
        rating: selectedProduct.rating || 0,
        category: selectedProduct.category || "Uncategorized",
      };

      // Add the new product to the global product list using addProduct from ProductContext
      addProduct(newProduct);

      // Navigate to the ProductSection after publishing
      navigate('/products'); // Navigate to the product section
    }
  };

  const handleExit = () => {
    setSelectedProduct(null); // Close product summary
  };

  const handleAddProductClick = () => {
    navigate('/inventory/product-information'); // Navigate to add product page
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
  const handlePasswordSubmit = async () => {
    if (password === '12345') { // Replace '12345' with the actual password logic
      if (actionType === 'edit') {
        // Navigate to ProductInformation.jsx with the selectedProduct data for editing
        navigate('/inventory/product-information', { state: { product: selectedProduct, isEdit: true } });
      } else if (actionType === 'archive') {
        // Archive the product using archiveProduct from ProductContext
        await archiveProduct(selectedProduct.id);
        setSelectedProduct(null); // Close modal after archiving
      }
    } else {
      alert('Incorrect Password'); // Add any error handling logic if needed
    }
    setShowPasswordModal(false);
    setPassword(''); // Clear the password field after submission
  };

  // Check if product list has updated after edit
  const handleUpdate = (updatedProduct) => {
    updateProduct(updatedProduct); // Trigger product update using the context function
    setSelectedProduct(null); // Deselect the product after update
  };

  // Filter products based on search query, FILTER BY, and STATUS
  const filteredProducts = products.filter((product) => {
    const productName = (product.name || '').toLowerCase();
    const productId = (`PID-${product.id}` || '').toLowerCase();
    const searchLower = searchQuery.toLowerCase(); // Access the state here

    // Search filter
    const matchesSearch = productName.includes(searchLower) || productId.includes(searchLower);

    // FILTER BY filter
    const matchesFilterBy = selectedFilterBy === '' || (product.category && product.category === selectedFilterBy);

    // STATUS filter (assuming 'All', 'Active', 'Inactive' statuses exist)
    const matchesStatus = activeStatus === 'All' || (product.status && product.status.toLowerCase() === activeStatus.toLowerCase());

    return matchesSearch && matchesFilterBy && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">PRODUCT</h1>

          <div className="flex items-center">
            {/* Search input with icon */}
            <div className="flex items-center border-b border-gray-600">
              <CiSearch className="text-gray-600 text-xl mr-2" /> {/* Icon before the input */}
              <input
                type="text"
                placeholder="Search product"
                className="bg-transparent text-gray-600 px-4 py-2 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Track input changes
              />
            </div>

            {/* Add Product Button */}
            <button
              onClick={handleAddProductClick} // Navigate to the ProductInformation page
              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg text-sm"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Filters and Sidebar */}
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-1">
            {/* FILTER BY */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-white mb-2">FILTER BY</h2>

              {/* FILTER BY Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleFilterByDropdown}
                  className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
                >
                  {selectedFilterBy || 'PRODUCT CATEGORY'}
                </button>

                {/* Dropdown Menu */}
                {isFilterByOpen && (
                  <div className="absolute mt-2 w-full bg-[#040405] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <ul className="text-sm text-white">
                      {filterByOptions.map((option) => (
                        <li
                          key={option}
                          className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                          onClick={() => handleFilterBySelect(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* STATUS Filters */}
            <div className="mb-6 mt-2">
              <h2 className="text-sm font-bold text-white mb-2">STATUS</h2>
              <div className="flex space-x-2">
                {['All', 'Active', 'Inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusClick(status)}
                    className={`text-sm px-6 py-2 rounded-lg ${
                      activeStatus === status
                        ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white'
                        : 'bg-gradient-to-r from-[#000000] to-[#000000] text-white hover:from-[#040405] hover:to-[#122127]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="col-span-3">
          <div className="space-y-4">

              {filteredProducts.length === 0 ? (
                <div className="text-center text-gray-400">
                  No products found
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] rounded-lg p-4 shadow-lg flex justify-between items-center cursor-pointer transition transform hover:scale-105 duration-300 ease-in-out"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="flex items-center">
                      <div className="w-24 h-24 bg-gray-800 rounded-lg mr-6">
                      <img 
  src={typeof product.image === 'string' ? `http://localhost:5173/${product.image}` : URL.createObjectURL(product.image)} 
  alt={product.name} 
  className="w-full h-full object-contain" 
/>

                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-white">PID-{product.id}</h3> {/* Display the Product ID */}
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
              {/* Header with Close, Edit, and Archive Buttons */}
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

              {/* Product Details */}
              <div className="flex flex-col md:flex-row">
                {/* Left Column: Image and Description */}
                <div className="md:w-1/2">
                  <h1 className="text-xl font-bold text-white mb-2">
                    {selectedProduct.name}
                  </h1>
                  <p className="text-xs text-gray-400">{selectedProduct.description}</p>

                  {/* Product Main Image */}
                  <div className="mt-4 bg-gray-700 p-2 rounded-lg">
                    <img
                      src={uploadedImages[0] || selectedProduct.image} // Main image
                      alt={selectedProduct.name}
                      className="w-full h-64 object-contain rounded-lg"
                    />
                  </div>

                  {/* Thumbnails of uploaded images */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {uploadedImages.length > 1 && (
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {uploadedImages.slice(1, 4).map((image, index) => (
                          <div
                            key={index}
                            className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => setSelectedProduct({ ...selectedProduct, image: image })}
                          >
                            <img
  src={typeof image === 'string' ? `http://localhost:5173/${image}` : URL.createObjectURL(image)}
  alt={`Thumbnail ${index + 1}`}
  className="w-full h-20 object-cover"
/>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Information and Measurements */}
                <div className="md:w-1/2 mt-6 md:mt-0 md:ml-10">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {/* Basic Information */}
                    <h2 className="col-span-2 text-sm font-semibold text-white mb-2">Basic Information</h2>
                    <div className="text-gray-400 text-xs">
                      <p>Product Type:</p>
                      <p>Product Brand:</p>
                      <p>Product Category:</p>
                      <p>Product Description:</p>
                    </div>
                    <div className="text-white text-xs">
                      <p>{selectedProduct.type}</p>
                      <p>{selectedProduct.brand}</p>
                      <p>{selectedProduct.category}</p>
                      <p>{selectedProduct.description}</p>
                    </div>

                    {/* Measurement */}
                    <h2 className="col-span-2 text-sm font-semibold text-white mt-4 mb-2">Measurement</h2>
                    <div className="text-gray-400 text-xs">
                      <p>Dimensions:</p>
                      <p>Color:</p>
                      <p>Finish:</p>
                      <p>Material:</p>
                      <p>Model:</p>
                    </div>
                    <div className="text-white text-xs">
                      <p>{selectedProduct.dimensions}</p>
                      <p>{selectedProduct.color}</p>
                      <p>{selectedProduct.finish}</p>
                      <p>{selectedProduct.material}</p>
                      <p>{selectedProduct.model}</p>
                    </div>

                    {/* Sales Information */}
                    <h2 className="col-span-2 text-sm font-semibold text-white mt-4 mb-2">Sales Information</h2>
                    <div className="text-gray-400 text-xs">
                      <p>Retail Price:</p>
                      <p>Tax:</p>
                      <p>Discount:</p>
                      <p>Total Price:</p>
                    </div>
                    <div className="text-white text-xs">
                      <p>{selectedProduct.price}</p>
                      <p>{selectedProduct.tax || 'N/A'}</p>
                      <p>{selectedProduct.discount || 'N/A'}</p>
                      <p>{selectedProduct.totalPrice}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Publish Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handlePublish} // Uses addProduct from ProductContext
                  className="px-6 py-2 bg-gradient-to-r from-[#040405] to-[#2c505f] text-white rounded-md text-sm"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-[#040405] p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-lg font-bold mb-4 text-center">
                ACCESS INVENTORY TO {actionType === 'edit' ? `EDIT PRODUCT #${selectedProduct?.id}` : actionType === 'archive' ? `ARCHIVE PRODUCT #${selectedProduct?.id}` : 'ADD NEW PRODUCT'}
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
