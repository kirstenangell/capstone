import React, { useState, useContext, useEffect } from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext';

const CustomerInformation = () => {
  const { addCustomer, updateCustomer } = useContext(CustomerContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're editing an existing customer
  const isEdit = location.state?.isEdit || false;
  const existingCustomer = location.state?.customer || {};

  // State to handle general information
  const [generalInfo, setGeneralInfo] = useState({
    id: existingCustomer.id || null,
    first_name: existingCustomer.first_name || '',
    last_name: existingCustomer.last_name || '',
    type: existingCustomer.type || '',
    email: existingCustomer.email || '',
    phone: existingCustomer.phone || '',
    paymentStatus: existingCustomer.paymentStatus || '',
    paymentReference: existingCustomer.paymentReference || '',
  });

  useEffect(() => {
    // Log existing customer data for debugging
    console.log('Existing customer data:', existingCustomer);
  }, [existingCustomer]);

  // Handle Next button click to navigate to the next step
  const handleNextClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0); // Scroll to the top of the page

    // Prepare the address information for passing to the next step
    const updatedGeneralInfo = {
      ...generalInfo,
      currentAddress: existingCustomer.currentAddress || {
        street: '',
        city: '',
        province: '',
        zipCode: '',
        landmark: '',
      },
      newAddress: existingCustomer.newAddress || {
        street: '',
        city: '',
        province: '',
        zipCode: '',
        landmark: '',
      },
    };

    // Debugging log to check if addresses are being passed correctly
    console.log('Navigating to CustomerAddress with:', updatedGeneralInfo);

    // Navigate to CustomerAddress with the updated general information
    navigate('/customer/customer-address', { state: { generalInfo: updatedGeneralInfo, isEdit } });
  };

  // Handle input changes for all fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Handle Cancel button click
  const handleCancelClick = () => {
    window.scrollTo(0, 0);
    navigate('/customer');
  };

  const [isOpen, setIsOpen] = useState(false);
  const customerTypes = ['Online Store', 'Physical Store'];

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle selection of customer type
  const handleSelect = (type) => {
    handleInputChange({
      target: {
        name: 'type',
        value: type,
      },
    });
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      <div className="mb-10 mt-16 text-center">
        <h1 className="text-xl font-bold text-white mt-2">GENERAL INFORMATION</h1>
        <h2 className="text-sm font-bold text-white">{isEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
      </div>

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
            <h2 className="text-gray-400 text-sm">Address Details</h2>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl p-10 bg-gradient-to-b from-gray-800 to-black text-white rounded-lg shadow-lg">
        <form className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="first_name"
              value={generalInfo.first_name}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={generalInfo.last_name}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full text-sm p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Customer Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Customer Type</label>
            <button
              type="button"
              onClick={toggleDropdown}
              className="w-full p-3 text-sm bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-left"
            >
              {generalInfo.type || 'Select Customer Type'}
            </button>
            {isOpen && (
              <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                <ul className="text-sm text-white">
                  {customerTypes.map((type) => (
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
              placeholder="user@gmail.com"
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

export default CustomerInformation;
