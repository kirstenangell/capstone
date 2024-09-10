import React from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CustomerInformation = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleNextClick = (e) => {
    e.preventDefault(); // Prevent form submission
    navigate('/customer/customer-address'); // Navigate to CustomerAddress page
  };

  const handleCancelClick = () => {
    navigate('/customer'); // Navigate back to CustomerLanding page
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      {/* Header Titles - Above the Box */}
      <div className="mb-10 mt-16 text-center">
        <h1 className="text-xl font-bold text-white mt-2">GENERAL INFORMATION</h1>
        <h2 className="text-sm font-bold text-white">Add New Customer</h2>
      </div>

      {/* Step Sidebar */}
      <div className="absolute left-10 top-1/4">
        <div className="mb-4 flex items-center space-x-2 bg-gray-800 p-4 rounded-lg">
          <IoIosInformationCircle className="text-white text-2xl" />
          <div>
            <h3 className="text-gray-400 text-sm">STEP 1</h3>
            <h2 className="text-white text-sm">General Information</h2>
          </div>
        </div>
        <div className="mb-4 flex items-center space-x-2 p-4 rounded-lg">
          <GiStorkDelivery className="text-gray-400 text-2xl" />
          <div>
            <h3 className="text-gray-400 text-sm">STEP 2</h3>
            <h2 className="text-gray-400 text-sm ">Address Details</h2>
          </div>
        </div>
      </div>

      {/* Form Box */}
      <div className="w-full max-w-2xl p-10 bg-gradient-to-b from-gray-800 to-black text-white rounded-lg shadow-lg">
        {/* Form */}
        <form className="space-y-6">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              placeholder="Customer Name"
              className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Customer Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Customer Type</label>
            <input
              type="text"
              placeholder="Customer Type"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="user@gmail.com"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              placeholder="+63 000 000 0000"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Status</label>
            <input
              type="text"
              placeholder="Paid / Pending / Cancelled"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Payment Reference */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Reference</label>
            <input
              type="text"
              placeholder="INV-2024-000"
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={handleCancelClick} // Navigate back to CustomerLanding on click
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
              onClick={handleNextClick} // Navigate to CustomerAddress on click
            >
              NEXT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerInformation;
