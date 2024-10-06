// src/order-page-component/OrderLanding.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci'; // Search icon
import { BsBoxArrowRight } from "react-icons/bs"; // Close Icon
import { OrderContext } from '../context/OrderContext'; // Import OrderContext
import LabelValue from '../global/LabelValue';

const OrderLanding = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Use OrderContext
  const { orders, archiveOrder, updateOrder } = useContext(OrderContext);

  // State to track search input
  const [searchQuery, setSearchQuery] = useState('');

  // State to manage active tab
  const [activeTab, setActiveTab] = useState('general'); // Default to 'general'

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setActiveTab('general'); // Reset to default tab when a new order is selected
  };

  const handleCloseModal = () => {
    setSelectedOrder(null); // Close order summary
  };

  const handleArchiveOrder = () => {
    if (selectedOrder) {
      archiveOrder(selectedOrder.id); // Ensure you're passing the correct 'id'
      alert(`Order #${selectedOrder.oid} has been archived.`);
      setSelectedOrder(null);
    }
  };

  const handleEditOrder = () => {
    if (selectedOrder) {
      navigate('/order-details', { state: { order: selectedOrder, isEdit: true } });
      setSelectedOrder(null);
    }
  };

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

  // Filter orders based on search query (title or oid)
  const filteredOrders = orders.filter((order) =>
    (order.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (`${order.oid || order.id}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="space-y-6 col-span-1">
            {['Order Status', 'Sort By', 'Order Delivery', 'Order Date'].map((label, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium mb-2">{label}</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gradient-to-r from-[#4B88A3] via-[#040405] to-[#4B88A3] border border-gray-700 rounded-md text-sm placeholder-gray-400"
                  placeholder="Lorem Ipsum Dolor"
                />
              </div>
            ))}
          </div>

          {/* Order List */}
          <div className="col-span-3 space-y-6">
            {/* Order Cards */}
            {filteredOrders.length === 0 ? (
              <div className="text-center text-gray-400">
                No orders found
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.oid || order.id}
                  className="bg-gradient-to-r from-[#040405] to-[#335C6E] rounded-lg p-6 shadow-lg cursor-pointer transition transform hover:scale-105 duration-300 ease-in-out"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white">{order.oid || `OID-${order.id}`}</h2>
                      <p className="text-lg text-white">{order.title || 'No Title'}</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {order.address || 'No Address'} | {order.customer || 'No Customer'} | {order.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">{order.price || 'PHP0.00'}</p>
                      <p className="text-sm font-semibold text-gray-400">{order.status || 'N/A'}</p>
                    </div>
                  </div>
                 
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-[#040405] p-6 rounded-lg shadow-lg max-w-3xl w-full h-auto flex flex-col">
            {/* Modal Header: Close, Edit, and Archive Buttons */}
            <div className="flex justify-between items-center mb-6">
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

            {/* Order Details Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">Order Details</h1>
              
              {/* Individual Detail Rows */}
              <div className="mt-4 space-y-4">
                <LabelValue label="ORDER DATE" value={selectedOrder.date} />
                <LabelValue label="DELIVERY OPTION" value={selectedOrder.deliveryOption} />
                {selectedOrder.deliveryOption === 'Pick Up' && (
                  <>
                    <LabelValue label="PICK UP DATE" value={selectedOrder.pickUpDate} />
                    <LabelValue label="PICK UP TIME" value={selectedOrder.pickUpTime} />
                  </>
                )}
                <LabelValue label="PAYMENT OPTION" value={selectedOrder.paymentOption} />
              </div>
            </div>

            {/* Product Ordered Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Product Ordered</h2>

              {/* Product List */}
              <div className="bg-[#1b1b1d] p-6 rounded-lg shadow-lg">
                {selectedOrder.products.map((product, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-600 pb-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden">
                        {/* Placeholder for product image */}
                        <img
                          src={selectedOrder.product?.image || '/path/to/placeholder.png'}
                          alt={product || 'Product'}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-lg text-white">{product || 'No Product Name'}</p>
                        <p className="text-sm text-gray-400">Lorem Ipsum</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">QTY: 1(Pcs)</p>
                      <p className="text-lg font-bold text-white">PHP 30,000</p>
                    </div>
                  </div>
                ))}

                {/* Subtotal and Delivery Fee */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Subtotal: <span className="text-white">PHP 30,000</span></p>
                  <p className="text-sm text-gray-400">Delivery Fee: <span className="text-white">FREE</span></p>
                </div>

                {/* Total */}
                <div className="flex justify-end mt-4">
                  <p className="text-lg font-bold text-white">TOTAL: PHP 30,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderLanding;
