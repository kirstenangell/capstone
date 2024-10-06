// src/order-page-component/OrderLanding.jsx
import React, { useState, useContext } from 'react';
import { IoMdClose } from 'react-icons/io'; // Close Icon
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci'; // Search icon
import { OrderContext } from '../context/OrderContext'; // Import OrderContext

const OrderLanding = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Use OrderContext
  const { orders, archiveOrder, updateOrder } = useContext(OrderContext);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleExit = () => {
    setSelectedOrder(null); // Close order summary
  };

  const handleArchiveClick = () => {
    if (selectedOrder) {
      archiveOrder(selectedOrder.id);
      alert(`Order #${selectedOrder.oid} has been archived.`);
      setSelectedOrder(null);
    }
  };

  const handleEditClick = () => {
    if (selectedOrder) {
      navigate('/order-details', { state: { order: selectedOrder, isEdit: true } });
      setSelectedOrder(null);
    }
  };

  const handleAddOrder = () => {
    const newOrder = {
      id: Date.now(), // Unique identifier
      // Remove oid here, let OrderContext handle it
      title: '',
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

    // Navigate to OrderDetails.jsx with the new order data for adding
    navigate('/order-details', { state: { order: newOrder, isEdit: false } });
  };

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">ORDER</h1>
          <div className="flex items-center">
            <div className="flex items-center border-b border-gray-600">
              <CiSearch className="text-gray-600 text-xl mr-2" /> {/* Icon before the input */}
              <input
                type="text"
                placeholder="Search product"
                className="bg-transparent text-gray-600 px-4 py-2 focus:outline-none"
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
            {/* Search Bar */}
          

            {/* Order Cards */}
            {orders.length === 0 ? (
              <div className="text-center text-gray-400">
                No orders found
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#0C0D0F] rounded-lg p-6 shadow-lg cursor-pointer transition transform hover:scale-105 duration-300 ease-in-out"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white">{order.oid}</h2>
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
                  <div className="mt-4 bg-gradient-to-r from-[#4B88A3] via-[#040405] to-[#4B88A3] p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-white">{order.title || 'No Title'}</p>
                      <p className="text-sm text-gray-400">{order.customer || 'No Customer'}</p>
                    </div>
                    <div className="mt-2 h-2 bg-[#2D3748] rounded-full">
                      <div className="h-full bg-[#62B1D4] rounded-full w-[50%]"></div> {/* Progress bar */}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal for Order Details */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-[#040405] p-10 rounded-lg shadow-xl max-w-4xl w-full relative">
              {/* Close Button */}
              <button
                onClick={handleExit}
                className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full text-white"
              >
                <IoMdClose size={24} />
              </button>

              {/* Order Details Section */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white">Order Details</h1>
                  <div className="mt-4 space-y-2 text-gray-400">
                    <p>ORDER DATE: <span className="text-white">{selectedOrder.date}</span></p>
                    <p>DELIVERY OPTION: <span className="text-white">{selectedOrder.deliveryOption}</span></p>
                    {selectedOrder.deliveryOption === 'Pick Up' && (
                      <>
                        <p>PICK UP DATE: <span className="text-white">{selectedOrder.pickUpDate}</span></p>
                        <p>PICK UP TIME: <span className="text-white">{selectedOrder.pickUpTime}</span></p>
                      </>
                    )}
                    <p>PAYMENT OPTION: <span className="text-white">{selectedOrder.paymentOption}</span></p>
                  </div>
                </div>

                {/* Edit and Archive Buttons */}
                <div className="space-x-4">
                  <button
                    onClick={handleEditClick}
                    className="px-6 py-2 bg-blue-600 rounded-lg text-sm text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleArchiveClick}
                    className="px-6 py-2 bg-red-600 rounded-lg text-sm text-white"
                  >
                    Archive
                  </button>
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
                        <div className="w-12 h-12 bg-gray-700 rounded-lg">
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
    </div>
  );
};

export default OrderLanding;
