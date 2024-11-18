import React, { useState, useEffect, useContext } from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext';

const CustomerAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addCustomer, updateCustomer } = useContext(CustomerContext);

  const { generalInfo, isEdit } = location.state || {};

  // Initialize state for address details and saving status
  const [addressInfo, setAddressInfo] = useState({
    currentStreet: '',
    currentBarangay: '',
    currentCity: '',
    currentRegion: '',
    currentProvince: '',
    currentZipCode: '',
    currentLandmark: '',
    newStreet: '',
    newBarangay: '',
    newCity: '',
    newRegion: '',
    newProvince: '',
    newZipCode: '',
    newLandmark: '',
  });

  const [isSaving, setIsSaving] = useState(false); // Track saving state

  // Populate addressInfo from generalInfo if editing
  useEffect(() => {
    if (isEdit && generalInfo) {
      setAddressInfo({
        currentStreet: generalInfo.currentAddress?.street || '',
        currentBarangay: generalInfo.currentAddress?.barangay || '',
        currentCity: generalInfo.currentAddress?.city || '',
        currentRegion: generalInfo.currentAddress?.region || '',
        currentProvince: generalInfo.currentAddress?.province || '',
        currentZipCode: generalInfo.currentAddress?.zipCode || '',
        currentLandmark: generalInfo.currentAddress?.landmark || '',
        newStreet: generalInfo.newAddress?.street || '',
        newBarangay: generalInfo.newAddress?.barangay || '',
        newCity: generalInfo.newAddress?.city || '',
        newRegion: generalInfo.newAddress?.region || '',
        newProvince: generalInfo.newAddress?.province || '',
        newZipCode: generalInfo.newAddress?.zipCode || '',
        newLandmark: generalInfo.newAddress?.landmark || '',
      });
    }
  }, [isEdit, generalInfo]);

  // Handle input changes for address forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle form submission to save or update customer data
  const handleSaveClick = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);

    // Validate required fields
    const requiredFields = ['currentStreet', 'currentCity', 'currentProvince', 'currentZipCode'];
    for (let field of requiredFields) {
      if (!addressInfo[field]) {
        alert('Please fill in all required fields.');
        setIsSaving(false);
        return;
      }
    }

    // Prepare customer data
    const customerData = {
      ...generalInfo,
      currentAddress: {
        street: addressInfo.currentStreet,
        barangay: addressInfo.currentBarangay,
        city: addressInfo.currentCity,
        region: addressInfo.currentRegion,
        province: addressInfo.currentProvince,
        zipCode: addressInfo.currentZipCode,
        landmark: addressInfo.currentLandmark || '',
      },
      newAddress: {
        street: addressInfo.newStreet,
        barangay: addressInfo.newBarangay,
        city: addressInfo.newCity,
        region: addressInfo.newRegion,
        province: addressInfo.newProvince,
        zipCode: addressInfo.newZipCode,
        landmark: addressInfo.newLandmark || '',
      },
    };

    try {
      if (isEdit) {
        const response = await fetch(`http://localhost:5000/update-customer/${generalInfo.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData),
        });

        if (response.ok) {
          const updatedCustomer = await response.json();
          updateCustomer(updatedCustomer); // Update customer in context
          alert('Customer updated successfully!');
        } else {
          alert('Failed to update customer. Please try again.');
        }
      } else {
        const response = await fetch('http://localhost:5000/add-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData),
        });

        if (response.ok) {
          const newCustomer = await response.json();
          addCustomer(newCustomer); // Add new customer to context
          alert('Customer added successfully!');
        } else {
          alert('Failed to add customer. Please try again.');
        }
      }
      navigate('/customer');
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackClick = () => {
    window.scrollTo(0, 0);
    navigate('/customer/customer-information', { state: { customer: generalInfo, isEdit } });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      <div className="mb-10 mt-16 text-center">
        <h1 className="text-xl font-bold text-white mt-2">
          {isEdit ? 'EDIT CUSTOMER ADDRESS' : 'ADD NEW CUSTOMER ADDRESS'}
        </h1>
        <h2 className="text-sm text-white">{isEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
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
                  name="currentBarangay"
                  value={addressInfo.currentBarangay}
                  onChange={handleInputChange}
                  placeholder="Barangay"
                  className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <input
                type="text"
                name="currentCity"
                value={addressInfo.currentCity}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="currentRegion"
                value={addressInfo.currentRegion}
                onChange={handleInputChange}
                placeholder="Region"
                className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
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
                  placeholder="Street Number/Street Name"
                  className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="newBarangay"
                  value={addressInfo.newBarangay}
                  onChange={handleInputChange}
                  placeholder="Barangay"
                  className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <input
                type="text"
                name="newCity"
                value={addressInfo.newCity}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="newRegion"
                value={addressInfo.newRegion}
                onChange={handleInputChange}
                placeholder="Region"
                className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
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
              onClick={handleBackClick}
              className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              BACK
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
            >
              {isSaving ? 'Saving...' : 'SAVE'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerAddress;
