import React, { useState, useContext, useEffect } from 'react';
import { GiStorkDelivery } from 'react-icons/gi';
import { IoIosInformationCircle } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import { SupplierContext } from '../context/SupplierContext';

const SupplierInformation = () => {
  const { addSupplier, updateSupplier } = useContext(SupplierContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're editing an existing supplier
  const isEdit = location.state?.isEdit || false;
  const existingSupplier = location.state?.supplier || {};

  // Manage the current step (1: General Info, 2: Address Details)
  const [currentStep, setCurrentStep] = useState(1);

  // Combined state for general info and address details
  const [supplierData, setSupplierData] = useState({
    // General Information
    id: existingSupplier.id || null,
    name: existingSupplier.name || '',
    contactName: existingSupplier.contactName || '', // Added Contact Name
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
  });

  // Handle input changes for all form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle selection of supplier type from dropdown
  const handleSelect = (field, value) => {
    setSupplierData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    if (field === 'type') {
      setIsSupplierTypeDropdownOpen(false); // Close the supplier type dropdown after selection
    } else if (field === 'status') {
      setIsStatusDropdownOpen(false); // Close the status dropdown after selection
    }
  };

  // Dropdown state for supplier type
  const [isSupplierTypeDropdownOpen, setIsSupplierTypeDropdownOpen] = useState(false);
  const supplierTypes = ['Wholesale', 'Retail', 'Distributor'];

  // Dropdown state for status
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusOptions = ['Active', 'Not Active'];

  // Dropdown state for current address type
  const [isCurrentAddressTypeDropdownOpen, setIsCurrentAddressTypeDropdownOpen] = useState(false);
  const addressTypeOptions = ['Headquarters', 'Billing', 'Shipping'];

  // Dropdown state for new address type
  const [isNewAddressTypeDropdownOpen, setIsNewAddressTypeDropdownOpen] = useState(false);

  // Toggle the supplier type dropdown visibility
  const toggleSupplierTypeDropdown = () => {
    setIsSupplierTypeDropdownOpen(!isSupplierTypeDropdownOpen);
  };

  // Toggle the status dropdown visibility
  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  // Toggle the current address type dropdown visibility
  const toggleCurrentAddressTypeDropdown = () => {
    setIsCurrentAddressTypeDropdownOpen(!isCurrentAddressTypeDropdownOpen);
  };

  // Toggle the new address type dropdown visibility
  const toggleNewAddressTypeDropdown = () => {
    setIsNewAddressTypeDropdownOpen(!isNewAddressTypeDropdownOpen);
  };

  // Handle navigation to the next step
  const handleNextClick = (e) => {
    e.preventDefault();
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
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  // Handle navigation to the previous step
  const handleBackClick = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  // Handle form submission to save the supplier
  const handleSaveClick = (e) => {
    e.preventDefault();

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

  // Handle cancel action
  const handleCancelClick = () => {
    window.scrollTo(0, 0);
    navigate('/supplier');
  };

  // Pre-fill form if editing
  useEffect(() => {
    if (isEdit && existingSupplier) {
      setSupplierData({
        id: existingSupplier.id,
        name: existingSupplier.name,
        contactName: existingSupplier.contactName || '', // Added Contact Name
        type: existingSupplier.type,
        email: existingSupplier.email,
        phone: existingSupplier.phone,
        status: existingSupplier.status || '', // Renamed from paymentStatus
        additionalNotes: existingSupplier.additionalNotes || '', // Replaced paymentReference
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
      });
    }
  }, [isEdit, existingSupplier]);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      {/* Header */}
      <div className="mb-10 mt-16 text-center">
        <h1 className="text-xl font-bold text-white mt-2">
          {currentStep === 1 ? 'GENERAL INFORMATION' : 'ADDRESS DETAILS'}
        </h1>
        <h2 className="text-sm font-bold text-white">Add New Supplier</h2>
      </div>

      {/* Step Indicators */}
      <div className="absolute left-10 top-1/4">
        <div
          className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${
            currentStep === 1 ? 'bg-gray-800' : 'bg-transparent'
          }`}
        >
          <IoIosInformationCircle
            className={`text-2xl ${
              currentStep === 1 ? 'text-white' : 'text-gray-400'
            }`}
          />
          <div>
            <h3
              className={`text-sm ${
                currentStep === 1 ? 'text-white' : 'text-gray-400'
              }`}
            >
              STEP 1
            </h3>
            <h2
              className={`text-sm ${
                currentStep === 1 ? 'text-white' : 'text-gray-400'
              }`}
            >
              General Information
            </h2>
          </div>
        </div>
        <div
          className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${
            currentStep === 2 ? 'bg-gray-800' : 'bg-transparent'
          }`}
        >
          <GiStorkDelivery
            className={`text-2xl ${
              currentStep === 2 ? 'text-white' : 'text-gray-400'
            }`}
          />
          <div>
            <h3
              className={`text-sm ${
                currentStep === 2 ? 'text-white' : 'text-gray-400'
              }`}
            >
              STEP 2
            </h3>
            <h2
              className={`text-sm ${
                currentStep === 2 ? 'text-white' : 'text-gray-400'
              }`}
            >
              Address Details
            </h2>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-2xl p-10 bg-gradient-to-b from-gray-800 to-black text-white rounded-lg shadow-lg">
        {currentStep === 1 ? (
          // General Information Form
          <form className="space-y-6" onSubmit={handleNextClick}>
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={supplierData.name}
                onChange={handleInputChange}
                placeholder="Company Name"
                className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={supplierData.contactName}
                onChange={handleInputChange}
                placeholder="Contact Name"
                className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Supplier Type Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Supplier Type <span className="text-red-500">*</span>
              </label>

              {/* Dropdown Button */}
              <button
                type="button"
                onClick={toggleSupplierTypeDropdown}
                className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-left flex justify-between items-center"
              >
                <span>{supplierData.type || 'Select Supplier Type'}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isSupplierTypeDropdownOpen ? 'transform rotate-180' : ''
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
              {isSupplierTypeDropdownOpen && (
                <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                  <ul className="text-sm text-white">
                    {supplierTypes.map((type) => (
                      <li
                        key={type}
                        onClick={() => handleSelect('type', type)}
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
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={supplierData.email}
                onChange={handleInputChange}
                placeholder="supplier@example.com"
                className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={supplierData.phone}
                onChange={handleInputChange}
                placeholder="+63 000 000 0000"
                className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Status <span className="text-red-500">*</span>
              </label>

              {/* Dropdown Button */}
              <button
                type="button"
                onClick={toggleStatusDropdown}
                className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-left flex justify-between items-center"
              >
                <span>{supplierData.status || 'Select Status'}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isStatusDropdownOpen ? 'transform rotate-180' : ''
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
              {isStatusDropdownOpen && (
                <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                  <ul className="text-sm text-white">
                    {statusOptions.map((status) => (
                      <li
                        key={status}
                        onClick={() => handleSelect('status', status)}
                        className="p-2 hover:bg-[#122127] cursor-pointer"
                      >
                        {status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
        ) : (
          // Address Details Form
          <form className="space-y-6" onSubmit={handleSaveClick}>
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