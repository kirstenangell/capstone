import React, { useState, useContext } from 'react';
import { IoMdClose } from 'react-icons/io'; // Close Icon
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'; // Password Visibility Icons
import { useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci"; // Search icon
import { BsBoxArrowRight } from "react-icons/bs";
import { ProductContext } from '../context/ProductContext'; // Import ProductContext

const InventoryLanding = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [actionType, setActionType] = useState(''); // Track action type (add/edit/archive)
  const [uploadedImages, setUploadedImages] = useState([]);

  const navigate = useNavigate();

  // Use ProductContext to get products and product manipulation functions
  const { products, addProduct, updateProduct, archiveProduct } = useContext(ProductContext);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setUploadedImages(product.images || []); // Ensure images is an array
  };

  const handlePublish = () => {
    if (selectedProduct) {
      const newProduct = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedProduct.name || "Untitled Product",
        image: selectedProduct.image || Wheel1, // Use a default image if not provided
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

        {/* Sidebar Filters */}
        <div className="grid grid-cols-4 gap-10">
          <div className="space-y-6 col-span-1">
            {[ 'Product Status', 'Product Type', 'Stock Alert', 'Category', 'Product Price', 'Product Brand' ].map((label, idx) => (
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
                              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
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
