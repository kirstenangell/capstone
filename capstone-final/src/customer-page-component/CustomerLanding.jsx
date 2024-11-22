import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaOpencart } from 'react-icons/fa';
import { CustomerContext } from '../context/CustomerContext';
import { BsBoxArrowRight } from "react-icons/bs";
import { CiSearch } from "react-icons/ci"; // Search icon

const CustomerLanding = () => {
  const { customers, archiveCustomer, fetchCustomers } = useContext(CustomerContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // State to track search input
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('All'); // Default is 'All'
  const [isOpen, setIsOpen] = useState(false);

  // Fetch customers from the backend when the component loads
  useEffect(() => {
    fetchCustomers();
  }, []);

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

  // Redirect to Add Customer page
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
    navigate('/customer/customer-information', { state: { customer: selectedCustomer, isEdit: true } });
    setShowModal(false);
  };

  // Filter customers based on search query and status
  const filteredCustomers = customers.filter((customer) => {
    const fullName = `${customer.first_name || ''} ${customer.last_name || ''}`.toLowerCase();
    const searchQueryLower = searchQuery.toLowerCase();

    return (
      !customer.archived && // Exclude archived customers
      (fullName.includes(searchQueryLower) || `CID-${customer.id}`.toLowerCase().includes(searchQueryLower)) &&
      (activeStatus === 'All' || customer.status === activeStatus)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CUSTOMER</h1>
          <div className="flex items-center">
            <div className="flex items-center border-b border-gray-600">
              <CiSearch className="text-gray-600 text-xl mr-2" />
              <input
                type="text"
                placeholder="Search customer"
                className="bg-transparent text-gray-600 px-4 py-2 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
              >
                CUSTOMER TYPE
              </button>

              {isOpen && (
                <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                  <ul className="text-sm text-white">
                    <li className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer">Online Store</li>
                    <li className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer">Physical Store</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="mb-6 mt-2">
              <h2 className="text-sm font-bold text-white mb-2">STATUS</h2>
              <div className="flex space-x-2">
                {['All', 'Active', 'Inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`text-sm px-6 py-2 rounded-lg ${
                      activeStatus === status
                        ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white'
                        : 'bg-gradient-to-r from-[#000000] to-[#000000] text-white hover:from-[#040405] hover:to-[#122127]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <div className="space-y-6">
              {filteredCustomers.length === 0 ? (
                <div className="text-center text-gray-400">No customer found</div>
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
                      <h2 className="text-xl font-semibold">
                        {`${customer.first_name || 'N/A'} ${customer.last_name || 'N/A'}`}
                      </h2>
                      <p className="text-gray-400 text-sm mt-2">
                        {customer.email} | {customer.phone} | {customer.status}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#040405] p-6 rounded-lg shadow-lg max-w-3xl w-full h-[500px] flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col items-start">
                <button
                  onClick={handleCloseModal}
                  className="bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg p-2 mb-2 shadow-md"
                >
                  <BsBoxArrowRight className="text-white text-md" />
                </button>
                <div className="flex items-center">
                  <div className="w-24 h-24 flex justify-center items-center text-white text-lg font-bold">
                    {`CID-${selectedCustomer.id}`}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">
                      {`${selectedCustomer.first_name || 'N/A'} ${selectedCustomer.last_name || 'N/A'}`}
                    </h2>
                    <p className="text-gray-400">Customer Type: {selectedCustomer.type || 'N/A'}</p>
                  </div>
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

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">Customer Details</h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">First Name:</span>
                      <span className="text-xs">{selectedCustomer.first_name || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Last Name:</span>
                      <span className="text-xs">{selectedCustomer.last_name || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Email:</span>
                      <span className="text-xs">{selectedCustomer.email || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Phone:</span>
                      <span className="text-xs">{selectedCustomer.phone || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Status:</span>
                      <span className="text-xs">{selectedCustomer.status || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLanding;
