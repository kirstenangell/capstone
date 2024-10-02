import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const orders = [
  {
    id: 1,
    oid: 'OID12345',
    title: 'Lorem Ipsum Dolor Sit Amet Onsectetur Adipiscing',
    customer: 'Quis Nostrud Exercitation',
    address: 'Ut enim ad minim',
    price: 'PHP80,000.00',
    status: 'DELIVERY',
    date: 'May 21, 2024',
    deliveryOption: 'Pick Up',
    pickUpDate: 'May 25, 2024',
    pickUpTime: '2:00 PM',
    paymentOption: 'GCASH',
    product: {
      name: 'Product Name',
      quantity: 4,
      subtotal: 'PHP80,000',
      deliveryFee: '0',
      total: 'PHP80,000',
    },
  },
  // Add more orders if needed
];

const OrderLanding = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleExit = () => {
    setSelectedOrder(null);
  };

  const handleArchive = () => {
    alert(`Order #${selectedOrder.oid} has been archived.`);
    setSelectedOrder(null);
  };

  const handleEdit = () => {
    alert(`Editing Order #${selectedOrder.oid}`);
  };

  // Add this function to navigate to OrderDetails
  const handleAddOrder = () => {
    navigate('/order-details'); // Navigate to the order details page
  };

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">ORDER</h1>
          <button
            onClick={handleAddOrder} // Add onClick to trigger navigation
            className="px-4 py-2 bg-gradient-to-r from-[#335C6E] to-[#000000] text-white rounded-lg text-sm"
          >
            Add Order
          </button>
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
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-3 bg-transparent border border-gray-600 rounded-md text-sm placeholder-gray-400"
                placeholder="Search order"
              />
            </div>

            {/* Order Cards */}
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#0C0D0F] rounded-lg p-6 shadow-lg cursor-pointer transition transform hover:scale-105 duration-300 ease-in-out"
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">{order.oid}</h2>
                    <p className="text-lg text-white">{order.title}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {order.address} (Address) | {order.customer} (Customer Name) | Stock
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">{order.price}</p>
                    <p className="text-sm font-semibold text-gray-400">{order.status}</p>
                  </div>
                </div>
                <div className="mt-4 bg-gradient-to-r from-[#4B88A3] via-[#040405] to-[#4B88A3] p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-white">{order.title}</p>
                    <p className="text-sm text-gray-400">{order.customer}</p>
                  </div>
                  <div className="mt-2 h-2 bg-[#2D3748] rounded-full">
                    <div className="h-full bg-[#62B1D4] rounded-full w-[50%]"></div> {/* Progress bar */}
                  </div>
                </div>
              </div>
            ))}
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
                    <p>PICK UP DATE: <span className="text-white">{selectedOrder.pickUpDate}</span></p>
                    <p>PICK UP TIME: <span className="text-white">{selectedOrder.pickUpTime}</span></p>
                    <p>PAYMENT OPTION: <span className="text-white">{selectedOrder.paymentOption}</span></p>
                  </div>
                </div>

                {/* Edit and Archive Buttons */}
                <div className="space-x-4">
                  <button
                    onClick={handleEdit}
                    className="px-6 py-2 bg-blue-600 rounded-lg text-sm text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleArchive}
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
                  <div className="flex justify-between items-center border-b border-gray-600 pb-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg"></div> {/* Placeholder for product image */}
                      <div>
                        <p className="text-lg text-white">{selectedOrder.product.name}</p>
                        <p className="text-sm text-gray-400">Lorem Ipsum</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">QTY: {selectedOrder.product.quantity}(Pcs)</p>
                      <p className="text-lg font-bold text-white">{selectedOrder.product.subtotal}</p>
                    </div>
                  </div>

                  {/* Subtotal and Delivery Fee */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400">Subtotal: <span className="text-white">{selectedOrder.product.subtotal}</span></p>
                    <p className="text-sm text-gray-400">Delivery Fee: <span className="text-white">{selectedOrder.product.deliveryFee}</span></p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-end mt-4">
                    <p className="text-lg font-bold text-white">TOTAL: {selectedOrder.product.total}</p>
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
