import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaOpencart } from 'react-icons/fa';
import { OrderContext } from '../context/OrderContext';
import { BsBoxArrowRight } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';

const OrderLanding = () => {
  const { orders = [], archiveOrder, fetchOrders } = useContext(OrderContext); // Default orders to an empty array
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('general'); // Default to 'general'
  const [isOpen, setIsOpen] = useState(false); // Dropdown for delivery options
  const [activeStatus, setActiveStatus] = useState('All'); // Default status filter

  // Fetch orders from the backend on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Open modal with order details
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setActiveTab('general'); // Reset to default tab
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // Archive the selected order
  const handleArchiveOrder = () => {
    if (selectedOrder) {
      archiveOrder(selectedOrder.id);
      alert(`Order #${selectedOrder.id} has been archived.`);
      setSelectedOrder(null);
    }
  };

  // Navigate to OrderDetails for editing
  const handleEditOrder = () => {
    if (selectedOrder) {
      navigate('/order-details', { state: { order: selectedOrder, isEdit: true } });
      setSelectedOrder(null);
    }
  };

  // Navigate to OrderDetails for adding a new order
  const handleAddOrder = () => {
    const newOrder = {
      title: '',
      customer: '',
      address: '',
      price: '',
      status: 'PENDING',
      date: new Date().toLocaleDateString(),
      deliveryOption: '',
      pickUpDate: '',
      pickUpTime: '',
      paymentOption: '',
      products: [],
    };
    navigate('/order-details', { state: { order: newOrder, isEdit: false } });
  };

  // Filter orders based on search query and status
  const filteredOrders = (orders || []).filter((order) => {
    const searchQueryLower = searchQuery.toLowerCase();

    return (
      !order.archived && // Exclude archived orders
      (`OID-${order.id}`.toLowerCase().includes(searchQueryLower) ||
        (order.title?.toLowerCase() || '').includes(searchQueryLower)) &&
      (activeStatus === 'All' || order.status === activeStatus)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">ORDER</h1>
          <div className="flex items-center">
            <div className="flex items-center border-b border-gray-600">
              <CiSearch className="text-gray-600 text-xl mr-2" />
              <input
                type="text"
                placeholder="Search order"
                className="bg-transparent text-gray-600 px-4 py-2 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddOrder}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg text-sm"
            >
              Add Order
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
                DELIVERY OPTION
              </button>

              {isOpen && (
                <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                  <ul className="text-sm text-white">
                    <li className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer">Courier</li>
                    <li className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer">Pick-Up</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="mb-6 mt-2">
              <h2 className="text-sm font-bold text-white mb-2">STATUS</h2>
              <div className="flex space-x-2">
                {['All', 'Pending', 'Completed'].map((status) => (
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
              {filteredOrders.length === 0 ? (
                <div className="text-center text-gray-400">No customer found</div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-gradient-to-r from-[#040405] to-[#335C6E] p-6 rounded-lg shadow-md flex items-center cursor-pointer"
                    onClick={() => handleOrderClick(order)}
                  >
                    <div className="w-16 h-16 flex items-center justify-center text-white text-lg font-bold">
                      {`OID-${order.id}`}
                    </div>
                    <div className="ml-6">
                      <h2 className="text-xl font-semibold">
                        {`${order.first_name || 'N/A'} ${order.last_name || 'N/A'}`}
                      </h2>
                      <p className="text-gray-400 text-sm mt-2">
                        {order.email} | {order.phone} | {order.status}
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
          <div className="bg-[#040405] p-6 rounded-lg shadow-lg max-w-3xl w-full h-[600px] flex flex-col">
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
                    {`OID-${selectedOrder.id}`}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold">
                      {`${selectedOrder.first_name || 'N/A'} ${selectedOrder.last_name || 'N/A'}`}
                    </h2>
                    <p className="text-gray-400">Customer Type: {selectedOrder.type || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="space-x-4">
                <button onClick={handleEditOrder} className="text-sm text-white hover:underline">
                  Edit
                </button>
                <button
                  onClick={() => handleArchiveOrder(selectedOrder)}
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
                  activeTab === 'products'
                    ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white text-sm'
                    : 'bg-gradient-to-r from-[#000000] to-[#000000] text-gray-400 text-sm hover:text-white'
                }`}
                onClick={() => setActiveTab('products')}
              >
                <FaOpencart className="mr-2 text-xl" />
                Product List
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 gap-4">
                   <div>
                    <h3 className="text-white text-md font-semibold mb-2">Customer Details</h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">First Name:</span>
                      <span className="text-xs">{selectedOrder.first_name || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Last Name:</span>
                      <span className="text-xs">{selectedOrder.last_name || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Email:</span>
                      <span className="text-xs">{selectedOrder.email || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Phone:</span>
                      <span className="text-xs">{selectedOrder.phone || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Status:</span>
                      <span className="text-xs">{selectedOrder.status || 'N/A'}</span>
                    </div>
                    </div>
                </div>
              )}
              {activeTab === 'delivery' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">Current Address</h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Street:</span>
                      <span className="text-xs">{selectedOrder?.currentAddress?.street || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Barangay:</span>
                      <span className="text-xs">{selectedOrder?.currentAddress?.barangay || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">City:</span>
                      <span className="text-xs">{selectedOrder?.currentAddress?.city || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Region:</span>
                      <span className="text-xs">{selectedOrder?.currentAddress?.region || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Province:</span>
                      <span className="text-xs">{selectedOrder?.currentAddress?.province || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">Zip Code:</span>
                      <span className="text-xs">{selectedOrder?.currentAddress?.zipCode || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
                  {activeTab === 'products' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Product List</h3>
                      {Array.isArray(selectedOrder?.products) && selectedOrder.products.length > 0 ? (
                        selectedOrder.products.map((product) => (
                          <div key={product.id} className="mb-4">
                            <p>
                              <strong>Product ID:</strong> {product.id}
                            </p>
                            <p>
                              <strong>Product Name:</strong> {product.name}
                            </p>
                            <p>
                              <strong>Quantity:</strong> {product.quantity}
                            </p>
                            <p>
                              <strong>Status:</strong> {product.status}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No products available.</p>
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
