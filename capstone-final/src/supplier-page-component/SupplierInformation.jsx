// src/supplier-page-component/SupplierInformation.jsx
import React, { useState, useContext, useEffect } from 'react';
import { GiStorkDelivery } from 'react-icons/gi';
import { IoIosInformationCircle } from 'react-icons/io';
import { FaOpencart } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { SupplierContext } from '../context/SupplierContext';

const SupplierInformation = () => {
  const { addSupplier, updateSupplier } = useContext(SupplierContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're editing an existing supplier
  const isEdit = location.state?.isEdit || false;
  const existingSupplier = location.state?.supplier || {};

  // Manage the current step (1: General Info, 2: Address Details, 3: Product Lists)
  const [currentStep, setCurrentStep] = useState(1);

  // Combined state for general info, address details, and product lists
  const [supplierData, setSupplierData] = useState({
    // General Information
    id: existingSupplier.id || null,
    name: existingSupplier.name || '',
    type: existingSupplier.type || '',
    email: existingSupplier.email || '',
    phone: existingSupplier.phone || '',
    status: existingSupplier.status || '', // Renamed from paymentStatus
    additionalNotes: existingSupplier.additionalNotes || '', // Replaced paymentReference
    // Address Details
    currentAddressType: existingSupplier.currentAddress?.addressType || '', // Added Address Type for Current Address
    currentStreet: existingSupplier.currentAddress?.street || '',
    currentCity: existingSupplier.currentAddress?.city || '',
    currentProvince: existingSupplier.currentAddress?.province || '',
    currentZipCode: existingSupplier.currentAddress?.zipCode || '',
    currentLandmark: existingSupplier.currentAddress?.landmark || '',
    newAddressType: existingSupplier.newAddress?.addressType || '', // Added Address Type for New Address
    newStreet: existingSupplier.newAddress?.street || '',
    newCity: existingSupplier.newAddress?.city || '',
    newProvince: existingSupplier.newAddress?.province || '',
    newZipCode: existingSupplier.newAddress?.zipCode || '',
    newLandmark: existingSupplier.newAddress?.landmark || '',
    // Product Lists
    productLists: existingSupplier.productLists || [],
  });

  // Handle input changes for general information form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle form submission to navigate to Address Details
  const handleNextClick = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      // Basic validation for required fields in General Information
      if (
        !supplierData.name ||
        !supplierData.type ||
        !supplierData.email ||
        !supplierData.phone ||
        !supplierData.contactName || // Ensure Contact Name is filled
        !supplierData.status // Ensure Status is selected
      ) {
        alert('Please fill in all required fields.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Basic validation for required fields in Address Details
      const requiredAddressFields = [
        'currentAddressType',
        'currentStreet',
        'currentCity',
        'currentProvince',
        'currentZipCode',
      ];

      for (let field of requiredAddressFields) {
        if (!supplierData[field]) {
          alert('Please fill in all required address fields.');
          return;
        }
      }
      setCurrentStep(3);
    }
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  // Handle navigation to the previous step
  const handleBackClick = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  // Handle form submission to save the supplier
  const handleSaveClick = (e) => {
    e.preventDefault();

    // Prepare supplier data object
    const preparedSupplierData = {
      id: supplierData.id || `SUP${Date.now()}`, // Generate a unique ID if not editing
      name: supplierData.name,
      contactName: supplierData.contactName, // Added Contact Name
      type: supplierData.type,
      email: supplierData.email,
      phone: supplierData.phone,
      status: supplierData.status, // Renamed from paymentStatus
      additionalNotes: supplierData.additionalNotes, // Replaced paymentReference
      currentAddress: {
        addressType: supplierData.currentAddressType, // Added Address Type
        street: supplierData.currentStreet,
        city: supplierData.currentCity,
        province: supplierData.currentProvince,
        zipCode: supplierData.currentZipCode,
        landmark: supplierData.currentLandmark,
      },
      newAddress: {
        addressType: supplierData.newAddressType, // Added Address Type
        street: supplierData.newStreet,
        city: supplierData.newCity,
        province: supplierData.newProvince,
        zipCode: supplierData.newZipCode,
        landmark: supplierData.newLandmark,
      },
      productLists: supplierData.productLists,
    };

    if (isEdit) {
      // Update existing supplier
      updateSupplier(preparedSupplierData);
    } else {
      // Add new supplier
      addSupplier(preparedSupplierData);
    }

    // Scroll to the top after saving
    window.scrollTo(0, 0);

    // Navigate back to the Supplier Landing page
    navigate('/supplier');
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    window.scrollTo(0, 0);
    navigate('/supplier');
  };

  // Handle product list input changes
  const handleProductInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProductLists = [...supplierData.productLists];
    updatedProductLists[index] = {
      ...updatedProductLists[index],
      [name]: value,
    };
    setSupplierData((prevData) => ({
      ...prevData,
      productLists: updatedProductLists,
    }));
  };

  // Add new product to the product list
  const handleAddProduct = () => {
    setSupplierData((prevData) => ({
      ...prevData,
      productLists: [
        ...prevData.productLists,
        {
          productId: '',
          productName: '',
          category: '',
          productDescription: '',
          quantityAvailable: '',
          unitPrice: '',
        },
      ],
    }));
  };

  const [isOpen, setIsOpen] = useState(false);
  const supplierTypes = ['Wholesale', 'Retail', 'Distributor'];

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle selection of supplier type
  const handleSelect = (type) => {
    handleInputChange({
      target: {
        name: 'type',
        value: type,
      },
    });
    setIsOpen(false); // Close the dropdown after selection
  };

  useEffect(() => {
    // If editing, pre-fill the form with existing supplier data
    if (isEdit && existingSupplier) {
      setSupplierData({
        ...existingSupplier,
        currentAddressType: existingSupplier.currentAddress?.addressType || '',
        currentStreet: existingSupplier.currentAddress?.street || '',
        currentCity: existingSupplier.currentAddress?.city || '',
        currentProvince: existingSupplier.currentAddress?.province || '',
        currentZipCode: existingSupplier.currentAddress?.zipCode || '',
        currentLandmark: existingSupplier.currentAddress?.landmark || '',
        newAddressType: existingSupplier.newAddress?.addressType || '',
        newStreet: existingSupplier.newAddress?.street || '',
        newCity: existingSupplier.newAddress?.city || '',
        newProvince: existingSupplier.newAddress?.province || '',
        newZipCode: existingSupplier.newAddress?.zipCode || '',
        newLandmark: existingSupplier.newAddress?.landmark || '',
        productLists: existingSupplier.productLists || [],
      });
    }
  }, [isEdit, existingSupplier]);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      <div className="mb-10 mt-16 text-center">
        <h1 className="text-xl font-bold text-white mt-2">
          {currentStep === 1
            ? 'GENERAL INFORMATION'
            : currentStep === 2
            ? 'ADDRESS DETAILS'
            : 'PRODUCT LISTS'}
        </h1>
        <h2 className="text-sm font-bold text-white">Add New Supplier</h2>
      </div>

      <div className="absolute left-10 top-1/4">
        <div className="mb-4 flex items-center space-x-2 p-4 rounded-lg">
          <IoIosInformationCircle className="text-gray-400 text-2xl" />
          <div>
            <h3 className="text-gray-400 text-sm">STEP 1</h3>
            <h2 className="text-gray-400 text-sm">General Information</h2>
          </div>
        </div>
        <div className="mb-4 flex items-center space-x-2 p-4 bg-gray-800 rounded-lg">
          <GiStorkDelivery className="text-white text-2xl" />
          <div>
            <h3 className="text-white text-sm">STEP 2</h3>
            <h2 className="text-white text-sm">Address Details</h2>
          </div>
        </div>
        <div
          className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${
            currentStep === 3 ? 'bg-gray-800' : 'bg-transparent'
          }`}
        >
          <FaOpencart
            className={`text-2xl ${
              currentStep === 3 ? 'text-white' : 'text-gray-400'
            }`}
          />
          <div>
            <h3
              className={`text-sm ${
                currentStep === 3 ? 'text-white' : 'text-gray-400'
              }`}
            >
              STEP 3
            </h3>
            <h2
              className={`text-sm ${
                currentStep === 3 ? 'text-white' : 'text-gray-400'
              }`}
            >
              Product Lists
            </h2>
          </div>
        </div>
        <div
          className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${
            currentStep === 3 ? 'bg-gray-800' : 'bg-transparent'
          }`}
        >
          <FaOpencart
            className={`text-2xl ${
              currentStep === 3 ? 'text-white' : 'text-gray-400'
            }`}
          />
          <div>
            <h3
              className={`text-sm ${
                currentStep === 3 ? 'text-white' : 'text-gray-400'
              }`}
            >
              STEP 3
            </h3>
            <h2
              className={`text-sm ${
                currentStep === 3 ? 'text-white' : 'text-gray-400'
              }`}
            >
              Product Lists
            </h2>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl p-10 bg-gradient-to-b from-gray-800 to-black text-white rounded-lg shadow-lg">
        <form className="space-y-6">
          {/* Supplier Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Supplier Name</label>
            <input
              type="text"
              name="name"
              value={generalInfo.name}
              onChange={handleInputChange}
              placeholder="Supplier Name"
              className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Supplier Type Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Supplier Type</label>

            {/* Dropdown Button */}
            <button
              onClick={toggleDropdown}
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-left"
            >
              {generalInfo.type || 'Select Supplier Type'}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                <ul className="text-sm text-white">
                  {supplierTypes.map((type) => (
                    <li
                      key={type}
                      onClick={() => handleSelect(type)}
                      className="p-2 hover:bg-[#122127] cursor-pointer"
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={generalInfo.email}
              onChange={handleInputChange}
              placeholder="supplier@example.com"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={generalInfo.phone}
              onChange={handleInputChange}
              placeholder="+63 000 000 0000"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <input
              type="text"
              name="paymentStatus"
              value={generalInfo.paymentStatus}
              onChange={handleInputChange}
              placeholder="Paid / Pending / Cancelled"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={supplierData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Enter any additional notes here..."
                className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                rows="4"
              ></textarea>
            </div>
            {/* Buttons */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={handleCancelClick}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="ml-4 w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
              >
                NEXT
              </button>
            </div>
          </form>
        ) : currentStep === 2 ? (
          // Address Details Form
          <form className="space-y-6" onSubmit={handleNextClick}>
            {/* Current Address Section */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Address
              </label>

              {/* Address Type Dropdown for Current Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Address Type <span className="text-red-500">*</span>
                </label>

                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={toggleCurrentAddressTypeDropdown}
                  className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-left flex justify-between items-center"
                >
                  <span>{supplierData.currentAddressType || 'Select Address Type'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isCurrentAddressTypeDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isCurrentAddressTypeDropdownOpen && (
                  <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                    <ul className="text-sm text-white">
                      {addressTypeOptions.map((type) => (
                        <li
                          key={type}
                          onClick={() => handleSelect('currentAddressType', type)}
                          className="p-2 hover:bg-[#122127] cursor-pointer"
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Current Address Inputs */}
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    name="currentStreet"
                    value={supplierData.currentStreet}
                    onChange={handleInputChange}
                    placeholder="Street Number/Street Name"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="currentCity"
                    value={supplierData.currentCity}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    name="currentProvince"
                    value={supplierData.currentProvince}
                    onChange={handleInputChange}
                    placeholder="Province"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="currentZipCode"
                    value={supplierData.currentZipCode}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  name="currentLandmark"
                  value={supplierData.currentLandmark}
                  onChange={handleInputChange}
                  placeholder="Landmark (Optional)"
                  className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* New Address Section */}
            <div>
              <label className="block text-sm font-medium mb-1">New Address (Optional)</label>

              {/* Address Type Dropdown for New Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Address Type</label>

                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={toggleNewAddressTypeDropdown}
                  className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-left flex justify-between items-center"
                >
                  <span>{supplierData.newAddressType || 'Select Address Type'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isNewAddressTypeDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isNewAddressTypeDropdownOpen && (
                  <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                    <ul className="text-sm text-white">
                      {addressTypeOptions.map((type) => (
                        <li
                          key={type}
                          onClick={() => handleSelect('newAddressType', type)}
                          className="p-2 hover:bg-[#122127] cursor-pointer"
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* New Address Inputs */}
              <div className="flex space-x-4">
                
                <div className="w-1/2">
                  <input
                    type="text"
                    name="newStreet"
                    value={supplierData.newStreet}
                    onChange={handleInputChange}
                    placeholder="Street Number/Name"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="newCity"
                    value={supplierData.newCity}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-4">
                <div className="w-1/2">
                  <input
                    type="text"
                    name="newProvince"
                    value={supplierData.newProvince}
                    onChange={handleInputChange}
                    placeholder="Province"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="text"
                    name="newZipCode"
                    value={supplierData.newZipCode}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  name="newLandmark"
                  value={supplierData.newLandmark}
                  onChange={handleInputChange}
                  placeholder="Landmark (Optional)"
                  className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={handleBackClick}
              >
                BACK
              </button>
              <button
                type="submit"
                className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
              >
                NEXT
              </button>
            </div>
          </form>
        ) : (
          // Product Lists Form
          <form className="space-y-6" onSubmit={handleSaveClick}>
            {/* Product List Fields */}
            {supplierData.productLists.map((product, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h3 className="text-white text-md font-semibold mb-2">{`Product #${index + 1}`}</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product ID
                  </label>
                  <input
                    type="text"
                    name="productId"
                    value={product.productId}
                    onChange={(e) => handleProductInputChange(index, e)}
                    placeholder="Product ID"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="productName"
                    value={product.productName}
                    onChange={(e) => handleProductInputChange(index, e)}
                    placeholder="Product Name"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={product.category}
                    onChange={(e) => handleProductInputChange(index, e)}
                    placeholder="Category"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Product Description
                  </label>
                  <input
                    type="text"
                    name="productDescription"
                    value={product.productDescription}
                    onChange={(e) => handleProductInputChange(index, e)}
                    placeholder="Product Description"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity Available
                  </label>
                  <input
                    type="text"
                    name="quantityAvailable"
                    value={product.quantityAvailable}
                    onChange={(e) => handleProductInputChange(index, e)}
                    placeholder="Quantity Available"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Unit Price
                  </label>
                  <input
                    type="text"
                    name="unitPrice"
                    value={product.unitPrice}
                    onChange={(e) => handleProductInputChange(index, e)}
                    placeholder="Unit Price"
                    className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="w-full py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500 mt-4"
              onClick={handleAddProduct}
            >
              Add Product
            </button>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={handleBackClick}
              >
                BACK
              </button>
              <button
                type="submit"
                className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
              >
                SAVE
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SupplierInformation;
