// src/supplier-page-component/SupplierAddress.jsx
import React, { useState, useEffect, useContext } from 'react';
import { GiStorkDelivery } from 'react-icons/gi';
import { IoIosInformationCircle } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { SupplierContext } from '../context/SupplierContext';

const SupplierAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addSupplier, updateSupplier } = useContext(SupplierContext);

  const { generalInfo, isEdit } = location.state || {};

  // Initialize state for address details
  const [addressInfo, setAddressInfo] = useState({
    currentStreet: generalInfo?.currentAddress?.street || '',
    currentCity: generalInfo?.currentAddress?.city || '',
    currentProvince: generalInfo?.currentAddress?.province || '',
    currentZipCode: generalInfo?.currentAddress?.zipCode || '',
    currentLandmark: generalInfo?.currentAddress?.landmark || '',
    newStreet: generalInfo?.newAddress?.street || '',
    newCity: generalInfo?.newAddress?.city || '',
    newProvince: generalInfo?.newAddress?.province || '',
    newZipCode: generalInfo?.newAddress?.zipCode || '',
    newLandmark: generalInfo?.newAddress?.landmark || '',
  });

  useEffect(() => {
    // Scroll to the top when the component is mounted
    window.scrollTo(0, 0);
  }, []);

  // Handle input changes for address forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSaveClick = (e) => {
    e.preventDefault();

    // Validate required fields (optional but recommended)
    const requiredFields = [
      'currentStreet',
      'currentCity',
      'currentProvince',
      'currentZipCode',
    ];

    for (let field of requiredFields) {
      if (!addressInfo[field]) {
        alert('Please fill in all required fields.');
        return;
      }
    }

    // Prepare supplier data
    const supplierData = {
      ...generalInfo, // General Information from SupplierInformation
      currentAddress: {
        street: addressInfo.currentStreet,
        city: addressInfo.currentCity,
        province: addressInfo.currentProvince,
        zipCode: addressInfo.currentZipCode,
        landmark: addressInfo.currentLandmark || '',
      },
      newAddress: {
        street: addressInfo.newStreet,
        city: addressInfo.newCity,
        province: addressInfo.newProvince,
        zipCode: addressInfo.newZipCode,
        landmark: addressInfo.newLandmark || '',
      },
      supplyID: `SID-${Math.floor(Math.random() * 10000)}`, // Generate a random Supply ID
      supplyDetails: 'New Supply', // Placeholder, modify as needed
      supplyPrice: generalInfo.paymentReference || '₱0.00', // Using Payment Reference as Price for demonstration
      supplies: generalInfo.supplies || [], // Initialize with existing supplies if any
    };

    if (isEdit) {
      // Update existing supplier
      updateSupplier({
        ...supplierData,
        id: generalInfo.id, // Ensure the ID remains the same
      });
    } else {
      // Add new supplier
      addSupplier(supplierData);
    }

    // Scroll to the top of the page after saving
    window.scrollTo(0, 0);

    // Navigate back to SupplierLanding
    navigate('/supplier');
  };

  // Handle back button click
  const handleBackClick = () => {
    // Scroll to the top when the user clicks the "Back" button
    window.scrollTo(0, 0);
    navigate('/supplier/supplier-information', { state: { supplier: generalInfo, isEdit } });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      <div className="mb-10 mt-16 text-center">
        <h1 className="text-xl font-bold text-white mt-2">ADDRESS DETAILS</h1>
        <h2 className="text-sm text-white">Add New Supplier</h2>
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
        <form className="space-y-6" onSubmit={handleSaveClick}>
          {/* Current Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Current Address</label>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  name="currentStreet"
                  value={addressInfo.currentStreet}
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
                  value={addressInfo.currentCity}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <input
                type="text"
                name="currentProvince"
                value={addressInfo.currentProvince}
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
                value={addressInfo.currentZipCode}
                onChange={handleInputChange}
                placeholder="Zip Code"
                className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              name="currentLandmark"
              value={addressInfo.currentLandmark}
              onChange={handleInputChange}
              placeholder="Landmark (Optional)"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* New Address */}
          <div>
            <label className="block text-sm font-medium mb-1">New Address</label>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  name="newStreet"
                  value={addressInfo.newStreet}
                  onChange={handleInputChange}
                  placeholder="Street Number/Name"
                  className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="newCity"
                  value={addressInfo.newCity}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <input
                type="text"
                name="newProvince"
                value={addressInfo.newProvince}
                onChange={handleInputChange}
                placeholder="Province"
                className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="newZipCode"
                value={addressInfo.newZipCode}
                onChange={handleInputChange}
                placeholder="Zip Code"
                className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              name="newLandmark"
              value={addressInfo.newLandmark}
              onChange={handleInputChange}
              placeholder="Landmark (Optional)"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
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
      </div>
    </div>
  );
};

export default SupplierAddress;
