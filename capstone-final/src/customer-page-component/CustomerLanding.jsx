// src/components/CustomerLanding.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaOpencart } from 'react-icons/fa';
import { CustomerContext } from '../context/CustomerContext';

const CustomerLanding = () => {
  const { customers, archiveCustomer } = useContext(CustomerContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  // Archive customer
  const handleArchiveCustomer = (customerToArchive) => {
    archiveCustomer(customerToArchive.id);
    setShowModal(false);
  };

  // Handle Edit button click
  const handleEditCustomer = () => {
    // Navigate to CustomerInformation with selected customer data
    navigate('/customer/customer-information', { state: { customer: selectedCustomer, isEdit: true } });
    setShowModal(false);
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
              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg text-sm"
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
              <button className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left">
                Lorem Ipsum Dolor
              </button>
            </div>
          </div>

          <div className="col-span-3">
            <div className="space-y-6">
              {customers.map((customer) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#040405] p-6 rounded-lg shadow-lg max-w-3xl w-full h-[600px] flex flex-col">
            {/* Customer Info Section */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-24 h-24 flex justify-center items-center text-white text-lg font-bold">
                  {`CID-${selectedCustomer.id}`}
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                  <p className="text-gray-400">Manually Added</p>
                </div>
              </div>
              <div className="space-x-4">
                <button
                  onClick={handleEditCustomer}
                  className="text-sm text-white hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleArchiveCustomer(selectedCustomer)}
                  className="text-sm text-white hover:underline"
                >
                  Archive
                </button>
              </div>
            </div>

            {/* Tabs */}
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
                <div className="grid grid-cols-1 gap-8">
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
                <div className="grid grid-cols-1 gap-8">
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
                <div className="grid grid-cols-2 gap-6">
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

            {/* Close Button */}
            <div className="flex justify-end mt-4">
              <button
                className="px-6 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg"
                onClick={handleCloseModal}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLanding;
