// src/customer-page-component/CustomerLanding.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosInformationCircle, IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaOpencart } from 'react-icons/fa';
import { CustomerContext } from '../context/CustomerContext';
import { BsBoxArrowRight } from "react-icons/bs";
import { CiSearch } from "react-icons/ci"; // Search icon

const CustomerLanding = () => {
  const { customers, archiveCustomer } = useContext(CustomerContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // State to track search input
  const [searchQuery, setSearchQuery] = useState('');

  // State for password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [actionType, setActionType] = useState('');

  // Handle customer click to show modal
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setActiveTab('general');
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Redirect to Add Customer page when the "Add Customer" button is clicked
  const handleAddCustomerClick = () => {
    navigate('/customer/customer-information');
  };

  // Handle Edit button click
  const handleEditCustomer = () => {
    setActionType('edit');
    setShowPasswordModal(true);
  };

  // Handle Archive button click
  const handleArchiveCustomer = () => {
    setActionType('archive');
    setShowPasswordModal(true);
  };

  // Handle password modal submit
  const handlePasswordSubmit = () => {
    if (password === '12345') { // Replace '12345' with your actual password logic
      if (actionType === 'edit') {
        navigate('/customer/customer-information', { state: { customer: selectedCustomer, isEdit: true } });
        setShowModal(false);
      } else if (actionType === 'archive') {
        archiveCustomer(selectedCustomer.id);
        setShowModal(false);
      }
    } else {
      alert('Incorrect Password');
    }
    setPassword('');
    setShowPasswordModal(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Filter customers based on search query (name or CID)
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `CID-${customer.id}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [activeStatus, setActiveStatus] = useState('All'); // Default is 'All'

  // Function to handle button click
  const handleStatusClick = (status) => {
    setActiveStatus(status); // Set the active status
  };

  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CUSTOMER</h1>
          <div className="flex items-center">
            <div className="flex items-center border-b border-gray-600">
              <CiSearch className="text-gray-600 text-xl mr-2" /> {/* Icon before the input */}
              <input
                type="text"
                placeholder="Search customer"
                className="bg-transparent text-gray-600  px-4 py-2 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Track input changes
              />
            </div>
            <button
              onClick={handleAddCustomerClick}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg text-sm"
            >
              Add Customer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1">
            <div className="mb-6">
              <h2 className="text-sm font-bold text-white mb-2">FILTER BY</h2>

              {/* Dropdown Button */}
              <button
                onClick={toggleDropdown}
                className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
              >
                CUSTOMER TYPE
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                  <ul className="text-sm text-white">
                    <li className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127]  cursor-pointer">Online Store</li>
                    <li className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127]  cursor-pointer">Physical Store</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mb-6 mt-2">
              <h2 className="text-sm font-bold text-white mb-2">STATUS</h2>
              <div className="flex space-x-2">
                {/* 'All' Button */}
                <button
                  onClick={() => handleStatusClick('All')}
                  className={`text-sm px-6 py-2 rounded-lg ${
                    activeStatus === 'All'
                      ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white'
                      : 'bg-gradient-to-r from-[#000000] to-[#000000] text-white hover:from-[#040405] hover:to-[#122127]'
                  }`}
                >
                  All
                </button>

                {/* 'Active' Button */}
                <button
                  onClick={() => handleStatusClick('Active')}
                  className={`text-sm px-6 py-2 rounded-lg ${
                    activeStatus === 'Active'
                      ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white'
                      : 'bg-gradient-to-r from-[#000000] to-[#000000] text-white hover:from-[#040405] hover:to-[#122127]'
                  }`}
                >
                  Active
                </button>

                {/* 'Inactive' Button */}
                <button
                  onClick={() => handleStatusClick('Inactive')}
                  className={`text-sm px-6 py-2 rounded-lg ${
                    activeStatus === 'Inactive'
                      ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white'
                      : 'bg-gradient-to-r from-[#000000] to-[#000000] text-white hover:from-[#040405] hover:to-[#122127]'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <div className="space-y-6">
              {/* If no customers are found, display the message */}
              {filteredCustomers.length === 0 ? (
                <div className="text-center text-gray-400">
                  No customer found
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="bg-gradient-to-r from-[#040405] to-[#335C6E] p-6 rounded-lg shadow-md flex items-center cursor-pointer"
                    onClick={() => handleCustomerClick(customer)}
                  >
                    <div className="w-16 h-16 flex items-center justify-center text-white text-lg font-bold">
                      {`CID-${customer.id}`}
                    </div>
                    <div className="ml-6">
                      <h2 className="text-xl font-semibold">{customer.name}</h2>
                      <p className="text-gray-400 text-sm mt-2">
                        {customer.orderID} | {customer.phone} | {customer.email} |{' '}
                        {customer.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#040405] p-6 rounded-lg shadow-lg max-w-3xl w-full h-[500px] flex flex-col">
            {/* Customer Info Section */}
            <div className="flex justify-between items-start mb-4">
              {/* Left Section: Icon above the entire customer information */}
              <div className="flex flex-col items-start">
                {/* Icon at the top */}
                <button
                  onClick={handleCloseModal}
                  className="bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg p-2 mb-2 shadow-md"
                >
                  <BsBoxArrowRight className="text-white text-md" />
                </button>

                {/* Customer Information */}
                <div className="flex items-center">
                  <div className="w-24 h-24 flex justify-center items-center text-white text-lg font-bold">
                    {`CID-${selectedCustomer.id}`}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                    <p className="text-gray-400">Manually Added</p>
                  </div>
                </div>
              </div>

              {/* Right Section: Edit and Archive buttons */}
              <div className="space-x-4">
                <button
                  onClick={handleEditCustomer}
                  className="text-sm text-white hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={handleArchiveCustomer}
                  className="text-sm text-white hover:underline"
                >
                  Archive
                </button>
              </div>
            </div>
            <div className="flex space-x-4 mb-6">
              <button
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-300 ${
                  activeTab === 'general'
                    ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white text-sm'
                    : 'bg-gradient-to-r from-[#000000] to-[#000000] text-gray-400 text-sm hover:text-white'
                }`}
                onClick={() => setActiveTab('general')}
              >
                <IoIosInformationCircle className="mr-2 text-xl" />
                General Information
              </button>

              {/* Delivery Details Button */}
              <button
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-300 ${
                  activeTab === 'delivery'
                    ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white text-sm'
                    : 'bg-gradient-to-r from-[#000000] to-[#000000] text-gray-400 text-sm hover:text-white'
                }`}
                onClick={() => setActiveTab('delivery')}
              >
                <GiStorkDelivery className="mr-2 text-xl" />
                Delivery Details
              </button>

              {/* Order Lists Button */}
              <button
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-300 ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white text-sm'
                    : 'bg-gradient-to-r from-[#000000] to-[#000000] text-gray-400 text-sm hover:text-white'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <FaOpencart className="mr-2 text-xl" />
                Order Lists
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 gap-4">
                  {/* Customer Details Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">
                      Customer Details
                    </h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        CUSTOMER NAME:
                      </span>
                      <span className="text-xs">{selectedCustomer.name}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        CUSTOMER TYPE:
                      </span>
                      <span className="text-xs">{selectedCustomer.type}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        PAYMENT STATUS:
                      </span>
                      <span className="text-xs">
                        {selectedCustomer.paymentStatus || 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        PAYMENT REFERENCE:
                      </span>
                      <span className="text-xs">
                        {selectedCustomer.paymentReference || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">
                      Contact Information
                    </h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">EMAIL:</span>
                      <span className="text-xs">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">PHONE:</span>
                      <span className="text-xs">{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="grid grid-cols-1 gap-4">
                  {/* Current Address Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">
                      Current Address
                    </h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">STREET:</span>
                      <span className="text-xs">
                        {selectedCustomer?.currentAddress?.street || 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">CITY:</span>
                      <span className="text-xs">
                        {selectedCustomer?.currentAddress?.city || 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        PROVINCE:
                      </span>
                      <span className="text-xs">
                        {selectedCustomer?.currentAddress?.province || 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        ZIP CODE:
                      </span>
                      <span className="text-xs">
                        {selectedCustomer?.currentAddress?.zipCode || 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        LANDMARK:
                      </span>
                      <span className="text-xs">
                        {selectedCustomer?.currentAddress?.landmark || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Conditionally render New Address section only if there is any data */}
                  {selectedCustomer?.newAddress?.street ||
                  selectedCustomer?.newAddress?.city ||
                  selectedCustomer?.newAddress?.province ||
                  selectedCustomer?.newAddress?.zipCode ? (
                    <div>
                      <h3 className="text-white text-md font-semibold mb-2">
                        New Address
                      </h3>
                      <div className="flex">
                        <span className="text-xs text-gray-400 w-40">
                          STREET:
                        </span>
                        <span className="text-xs">
                          {selectedCustomer?.newAddress?.street || 'N/A'}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-xs text-gray-400 w-40">CITY:</span>
                        <span className="text-xs">
                          {selectedCustomer?.newAddress?.city || 'N/A'}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-xs text-gray-400 w-40">
                          PROVINCE:
                        </span>
                        <span className="text-xs">
                          {selectedCustomer?.newAddress?.province || 'N/A'}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-xs text-gray-400 w-40">
                          ZIP CODE:
                        </span>
                        <span className="text-xs">
                          {selectedCustomer?.newAddress?.zipCode || 'N/A'}
                        </span>
                      </div>
                      {selectedCustomer?.newAddress?.landmark && (
                        <div className="flex">
                          <span className="text-xs text-gray-400 w-40">
                            LANDMARK:
                          </span>
                          <span className="text-xs">
                            {selectedCustomer.newAddress.landmark}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Orders</h3>
                    {selectedCustomer.orders.length > 0 ? (
                      selectedCustomer.orders.map((order) => (
                        <div key={order.id} className="mb-4">
                          <p>
                            <strong>Order ID:</strong> {order.id}
                          </p>
                          <p>
                            <strong>Item:</strong> {order.item}
                          </p>
                          <p>
                            <strong>Price:</strong> {order.price}
                          </p>
                          <p>
                            <strong>Status:</strong> {order.status}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No orders available.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#040405] p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 text-center">
              ACCESS CUSTOMER DATA TO {actionType === 'edit' ? 'EDIT CUSTOMER #' + selectedCustomer?.id : actionType === 'archive' ? 'ARCHIVE CUSTOMER #' + selectedCustomer?.id : ''}
            </h2>
            <p className="mb-4 text-sm text-center">
              Enter your password to {actionType} the customer data.
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
  );
};

export default CustomerLanding;
