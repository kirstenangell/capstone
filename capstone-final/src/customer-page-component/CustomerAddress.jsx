import React from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from "react-icons/gi";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CustomerAddress = () => {
    const navigate = useNavigate(); // Initialize navigate hook

  const handleBackClick = () => {
    navigate('/customer/customer-information'); // Navigate to CustomerInformation page
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      {/* Header Titles - Above the Box */}
      <div className="mb-10 mt-16 text-center">
        <h1 className="text-xl font-bold text-white mt-2">ADDRESS DETAILS</h1>
        <h2 className="text-sm text-white">Add New Customer</h2>
      </div>

      {/* Step Sidebar */}
      <div className="absolute left-10 top-1/4">
        <div className="mb-4 flex items-center space-x-2 p-4 rounded-lg">
          <IoIosInformationCircle className="text-gray-400 text-2xl" /> {/* Icon */}
          <div>
            <h3 className="text-gray-400 text-sm">STEP 1</h3>
            <h2 className="text-gray-400 text-sm">General Information</h2>
          </div>
        </div>
        <div className="mb-4 flex items-center space-x-2 p-4  bg-gray-800 rounded-lg">
          <GiStorkDelivery className="text-white text-2xl" /> {/* Icon */}
          <div>
            <h3 className="text-white text-sm">STEP 1</h3>
            <h2 className="text-white text-sm">Address Details</h2>
          </div>
        </div>
      </div>

      {/* Form Box */}
      <div className="w-full max-w-2xl p-10 bg-gradient-to-b from-gray-800 to-black text-white rounded-lg shadow-lg">
        {/* Form */}
        <form className="space-y-6">
          {/* Current Address (Required Fields) */}
          <div>
            <label className="block text-sm font-medium mb-1">Current Address</label>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Street Number"
                  className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required // Required field
                />
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Street Name"
                  className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required // Required field
                />
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="State"
                className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required // Required field
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Zip Code"
                className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                required // Required field
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Landmark (Optional)"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* New Address (Optional Fields) */}
          <div>
            <label className="block text-sm font-medium mb-1">New Address</label>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Street Number"
                  className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Street Name"
                  className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <input
                type="text"
                placeholder="State"
                className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="w-1/2">
              <input
                type="text"
                placeholder="Zip Code"
                className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <input
              type="text"
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
              className="w-32 py-2  text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerAddress;
