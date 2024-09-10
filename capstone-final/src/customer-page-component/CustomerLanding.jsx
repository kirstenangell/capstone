import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CustomerLanding = () => {
  const [showModal, setShowModal] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState(''); // State for the password input
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleAddCustomerClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal

    // Use setTimeout to ensure modal closes before navigation
    setTimeout(() => {
      navigate('/customer/customer-information'); // Redirect to CustomerInformation.jsx page
    }, 150); // Adjust the timeout if needed
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CUSTOMER</h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search customer"
              className="bg-transparent border-b border-gray-600 text-white px-4 py-2 w-80 focus:outline-none"
            />
            <button
              onClick={handleAddCustomerClick}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#335C6E] to-[#000000] text-white rounded-lg text-sm"
            >
              Add Customer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1">
            {/* Sidebar filters */}
            <div className="mb-6">
              <h2 className="text-sm font-bold">CUSTOMER SOURCE</h2>
              <button className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#335C6E] rounded-lg text-left">
                Lorem Ipsum Dolor
              </button>
            </div>
            <div className="mb-6">
              <h2 className="text-sm font-bold">CUSTOMER TYPE</h2>
              <button className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#335C6E] rounded-lg text-left">
                Lorem Ipsum Dolor
              </button>
            </div>
            <div className="mb-6">
              <h2 className="text-sm font-bold">CUSTOMER LOCATION</h2>
              <button className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#335C6E] rounded-lg text-left">
                Lorem Ipsum Dolor
              </button>
            </div>
          </div>

          <div className="col-span-3">
            <div className="space-y-6">
              {Array.from({ length: 1 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-[#040405] to-[#335C6E] p-6 rounded-lg shadow-md flex items-center"
                >
                  <img
                    src={`https://via.placeholder.com/50`} 
                    alt="Customer"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="ml-6">
                    <h2 className="text-xl font-semibold">Last Name, First Name, M.I</h2>
                    <p className="text-gray-400 text-sm mt-2">
                      Order ID | Contact Number | Email Address | Current Address | Status
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-[#040405] p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 text-center">ACCESS INVENTORY</h2>
            <p className="mb-4 text-sm text-center">Enter your password to add a new customer to the inventory</p>
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
                className="w-full px-6 text-sm py-2 text-white rounded-lg"
                onClick={handleCloseModal}
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLanding;
