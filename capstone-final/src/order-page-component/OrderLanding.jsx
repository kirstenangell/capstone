// src/order-page-component/OrderLanding.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci'; // Search icon
import { BsBoxArrowRight } from "react-icons/bs"; // Close Icon
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaOpencart } from 'react-icons/fa';
import { OrderContext } from '../context/OrderContext'; // Import OrderContext
import LabelValue from '../global/LabelValue';

const OrderLanding = () => {
  const { orders, archiveOrder, updateOrder, addOrder } = useContext(OrderContext);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('general'); // Default to 'general'

  // State for FILTER BY dropdown
  const [isFilterByOpen, setIsFilterByOpen] = useState(false);
  const [selectedFilterBy, setSelectedFilterBy] = useState('');

  // State for STATUS buttons
  const [activeStatus, setActiveStatus] = useState('All'); // Default is 'All'

  // Sample Filter By options (you can customize these based on your requirements)
  const filterByOptions = ['All Types', 'Online', 'Offline', 'Express Delivery', 'Standard Delivery'];

  // Function to toggle FILTER BY dropdown
  const toggleFilterByDropdown = () => {
    setIsFilterByOpen(!isFilterByOpen);
  };

  // Function to handle selecting a FILTER BY option
  const handleFilterBySelect = (option) => {
    setSelectedFilterBy(option === 'All Types' ? '' : option);
    setIsFilterByOpen(false);
  };

  // Function to handle STATUS button click
  const handleStatusClick = (status) => {
    setActiveStatus(status);
  };

  // Function to handle order click to show modal
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setActiveTab('general');
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // Function to archive an order
  const handleArchiveOrder = () => {
    if (selectedOrder) {
      const confirmArchive = window.confirm(`Are you sure you want to archive Order #${selectedOrder.oid || selectedOrder.id}?`);
      if (confirmArchive) {
        archiveOrder(selectedOrder.id);
        alert(`Order #${selectedOrder.oid || selectedOrder.id} has been archived.`);
        setSelectedOrder(null);
      }
    }
  };

  // Function to edit an order
  const handleEditOrder = () => {
    if (selectedOrder) {
      navigate('/order-details', { state: { order: selectedOrder, isEdit: true } });
      setSelectedOrder(null);
    }
  };

  // Function to add a new order
  const handleAddOrder = () => {
    const newOrder = {
      title: '', // Initialize with empty string to prevent undefined
      customer: '',
      address: '',
      price: '',
      status: 'PENDING', // Default status
      date: new Date().toLocaleDateString(), // Set default order date
      deliveryOption: '',
      pickUpDate: '',
      pickUpTime: '',
      paymentOption: '',
      products: [''],
    };

    // Use 'addOrder' from context to ensure 'id' and 'oid' are assigned
    // Navigate to OrderDetails.jsx with the new order data for adding
    navigate('/order-details', { state: { order: newOrder, isEdit: false } });
  };

  // Filter orders based on search query, FILTER BY, and STATUS
  const filteredOrders = orders.filter((order) => {
    const orderTitle = (order.title || '').toLowerCase();
    const orderOid = (`OID-${order.id}` || '').toLowerCase();
    const searchLower = searchQuery.toLowerCase();

    // Search filter
    const matchesSearch = orderTitle.includes(searchLower) || orderOid.includes(searchLower);

    // FILTER BY filter
    const matchesFilterBy = selectedFilterBy === '' || (order.deliveryOption && order.deliveryOption === selectedFilterBy);

    // STATUS filter
    const matchesStatus = activeStatus === 'All' || (order.status && order.status.toLowerCase() === activeStatus.toLowerCase());

    return matchesSearch && matchesFilterBy && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">ORDER</h1>
          <div className="flex items-center">
            <div className="flex items-center border-b border-gray-600">
              <CiSearch className="text-gray-600 text-xl mr-2" /> {/* Icon before the input */}
              <input
                type="text"
                placeholder="Search order"
                className="bg-transparent text-gray-600 px-4 py-2 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Track input changes
              />
            </div>
            <button
              onClick={handleAddOrder} // Trigger navigation with the new order
              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg text-sm"
            >
              Add Order
            </button>
          </div>
        </div>

        {/* Filters and Sidebar */}
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-1">
            {/* FILTER BY */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-white mb-2">FILTER BY</h2>

              {/* FILTER BY Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleFilterByDropdown}
                  className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
                >
                  {selectedFilterBy || 'ORDER TYPE'}
                </button>

                {/* Dropdown Menu */}
                {isFilterByOpen && (
                  <div className="absolute mt-2 w-full bg-[#040405] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <ul className="text-sm text-white">
                      {filterByOptions.map((option) => (
                        <li
                          key={option}
                          className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                          onClick={() => handleFilterBySelect(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* STATUS Filters */}
            <div className="mb-6 mt-2">
              <h2 className="text-sm font-bold text-white mb-2">STATUS</h2>
              <div className="flex space-x-2">
                {['All', 'Active', 'Not Active'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusClick(status)}
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

          {/* Order List */}
          <div className="col-span-3">
            <div className="space-y-6 overflow-y-auto h-[500px]">
              {/* If no orders are found, display the message */}
              {filteredOrders.length === 0 ? (
                <div className="text-center text-gray-400">
                  No orders found
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.oid || order.id}
                    className="bg-gradient-to-r from-[#040405] to-[#335C6E] p-6 rounded-lg shadow-md flex items-center cursor-pointer"
                    onClick={() => handleOrderClick(order)}
                  >
                    <div className="w-16 h-16 flex items-center justify-center text-white text-lg font-bold">
                      {`OID-${order.id}`}
                    </div>
                    <div className="ml-6">
                      <h2 className="text-xl font-semibold">{order.title || 'No Title'}</h2>
                      <p className="text-gray-400 text-sm mt-2">
                        {order.customer} | {order.phone} | {order.email} | {order.status}
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
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#040405] p-6 rounded-lg shadow-lg max-w-3xl w-full h-auto flex flex-col">
            {/* Modal Header: Close, Edit, and Archive Buttons */}
            <div className="flex justify-between items-start mb-4">
              {/* Left Side: Close Button */}
              <button
                onClick={handleCloseModal}
                className="bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg p-2 shadow-md"
              >
                <BsBoxArrowRight className="text-white text-md" />
              </button>

              {/* Right Side: Edit and Archive Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleEditOrder}
                  className="text-sm text-white hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={handleArchiveOrder}
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
                  {/* Order Details Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">
                      Order Details
                    </h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        ORDER TITLE:
                      </span>
                      <span className="text-xs">
                        {selectedOrder.title || 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        CUSTOMER:
                      </span>
                      <span className="text-xs">{selectedOrder.customer || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        ADDRESS:
                      </span>
                      <span className="text-xs">{selectedOrder.address || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        PRICE:
                      </span>
                      <span className="text-xs">{selectedOrder.price || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        STATUS:
                      </span>
                      <span className="text-xs">
                        {selectedOrder.status || 'N/A'}
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
                      <span className="text-xs">{selectedOrder.email || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">PHONE:</span>
                      <span className="text-xs">{selectedOrder.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'delivery' && (
                <div className="grid grid-cols-1 gap-4">
                  {/* Delivery Details Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">Delivery Details</h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">DELIVERY OPTION:</span>
                      <span className="text-xs">{selectedOrder.deliveryOption || 'N/A'}</span>
                    </div>
                    {selectedOrder.deliveryOption === 'Pick Up' && (
                      <>
                        <div className="flex">
                          <span className="text-xs text-gray-400 w-40">PICK UP DATE:</span>
                          <span className="text-xs">{selectedOrder.pickUpDate || 'N/A'}</span>
                        </div>
                        <div className="flex">
                          <span className="text-xs text-gray-400 w-40">PICK UP TIME:</span>
                          <span className="text-xs">{selectedOrder.pickUpTime || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="grid grid-cols-1 gap-4">
                  {/* Order Lists Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">Order Lists</h3>
                    {selectedOrder.products && selectedOrder.products.length > 0 ? (
                      selectedOrder.products.map((product, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="text-white text-md font-semibold mb-2">{`Product #${index + 1}`}</h4>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">PRODUCT NAME:</span>
                            <span className="text-xs">{product || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">CATEGORY:</span>
                            <span className="text-xs">{selectedOrder.category || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">DESCRIPTION:</span>
                            <span className="text-xs">{selectedOrder.description || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">QUANTITY AVAILABLE:</span>
                            <span className="text-xs">{selectedOrder.quantity || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">UNIT PRICE:</span>
                            <span className="text-xs">{selectedOrder.unitPrice || 'N/A'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No products available.</p>
                    )}
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

export default OrderLanding;
