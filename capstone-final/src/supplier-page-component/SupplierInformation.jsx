// src/supplier-page-component/SupplierInformation.jsx
import React, { useState, useContext, useEffect } from 'react';
import { GiStorkDelivery } from 'react-icons/gi';
import { IoIosInformationCircle } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import { SupplierContext } from '../context/SupplierContext';

const SupplierInformation = () => {
  const { addSupplier, updateSupplier } = useContext(SupplierContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're editing an existing supplier
  const isEdit = location.state?.isEdit || false;
  const existingSupplier = location.state?.supplier || {};

  const [generalInfo, setGeneralInfo] = useState({
    id: existingSupplier.id || null,
    name: existingSupplier.name || '',
    type: existingSupplier.type || '',
    email: existingSupplier.email || '',
    phone: existingSupplier.phone || '',
    paymentStatus: existingSupplier.paymentStatus || '',
    paymentReference: existingSupplier.paymentReference || '',
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
    window.scrollTo(0, 0); // Scroll to the top of the page

    // Add the currentAddress and newAddress to generalInfo
    const updatedGeneralInfo = {
      ...generalInfo,
      currentAddress: existingSupplier.currentAddress || {}, // Ensure address is passed
      newAddress: existingSupplier.newAddress || {},         // Ensure new address is passed
    };

    // Navigate to SupplierAddress with the updated general information
    navigate('/supplier/supplier-address', { state: { generalInfo: updatedGeneralInfo, isEdit } });
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    window.scrollTo(0, 0);
    navigate('/supplier');
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
      setGeneralInfo({
        id: existingSupplier.id,
        name: existingSupplier.name,
        type: existingSupplier.type,
        email: existingSupplier.email,
        phone: existingSupplier.phone,
        paymentStatus: existingSupplier.paymentStatus,
        paymentReference: existingSupplier.paymentReference,
      });
    }
  }, [isEdit, existingSupplier]);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      <div className="mb-10 mt-16 text-center">
        <h1 className="text-xl font-bold text-white mt-2">GENERAL INFORMATION</h1>
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

          {/* Payment Reference */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Reference</label>
            <input
              type="text"
              name="paymentReference"
              value={generalInfo.paymentReference}
              onChange={handleInputChange}
              placeholder="INV-2024-000"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={handleCancelClick}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
              onClick={handleNextClick}
            >
              NEXT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierInformation;
