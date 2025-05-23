import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaOpencart } from 'react-icons/fa';
import { OrderContext } from '../context/OrderContext';
import { BsBoxArrowRight } from 'react-icons/bs';
import { CiSearch } from 'react-icons/ci';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'; // Password Visibility Icons
import jsPDF from 'jspdf';

const OrderLanding = () => {
  const { orders = [], archiveOrder, fetchOrders } = useContext(OrderContext); // Default orders to an empty array
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('general'); // Default to 'general'
  const [activeStatus, setActiveStatus] = useState('All'); // Default status filter
  const [orderItems, setOrderItems] = useState([]); // State for order items
  const [loadingItems, setLoadingItems] = useState(false); // Loading indicator for order items

  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isPaymentStatusOpen, setIsPaymentStatusOpen] = useState(false);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const [isDeliveryOptionOpen, setIsDeliveryOptionOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  const pdfRef = useRef();



  const provinces = ['Metro Manila', 'Cavite', 'Laguna']; // Example provinces
  const cities = selectedProvince
    ? ['Makati', 'Taguig', 'Quezon City'] // Example cities for the selected province
    : [];

  // Fetch orders from the backend on component mount
  useEffect(() => {
    fetchOrders(); // Load orders from the context
  }, [fetchOrders]);

  const handleGeneratePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 10;

    doc.setFontSize(40);
    doc.setTextColor(200, 200, 200);
    doc.text('CONFIDENTIAL', pageWidth / 2, 150, { align: 'center', angle: 45 });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Order Report', 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFillColor(220, 220, 220);
    doc.rect(10, y, pageWidth - 20, 10, 'F');
    doc.text('Control #', 12, y + 7);
    doc.text('Customer', 50, y + 7);
    doc.text('Email', 100, y + 7);
    doc.text('Price', 150, y + 7);
    doc.text('Status', 180, y + 7);
    y += 10;

    orders.forEach((order, index) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      const controlNumber = `CN-${String(index + 1).padStart(4, '0')}`;
      doc.text(controlNumber, 12, y);
      doc.text(`${order.firstName} ${order.lastName}`, 50, y);
      doc.text(order.email, 100, y);
      doc.text(`₱${order.price}`, 150, y);
      doc.text(order.status, 180, y);
      y += 8;
    });
    doc.save('orders.pdf');
  };

  // Open modal with order details
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setActiveTab('general'); // Reset to default tab
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
    setOrderItems([]); // Clear order items when modal is closed
    setLoadingItems(false); // Reset loading state
  };

  const handlePasswordSubmit = async () => {
    if (password === '12345') { // Replace with actual password validation logic
      if (actionType === 'edit') {
        navigate('/order-details', { state: { order: selectedOrder, isEdit: true } });
      } else if (actionType === 'archive') {
        archiveOrder(selectedOrder.id);
        alert(`Order #${selectedOrder.id} has been archived.`);
      } else if (actionType === 'add') {
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
      }
      setShowPasswordModal(false);
      setPassword('');
    } else {
      alert('Incorrect Password');
    }
  };
  

  

  const handleEditClick = () => {
    setActionType('edit');
    setShowPasswordModal(true);
  };

  const handleArchiveClick = () => {
    setActionType('archive');
    setShowPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPassword('');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  

  // Navigate to OrderDetails for adding a new order
  const handleAddOrder = () => {
    setActionType('add'); // Set action to "add"
    setShowPasswordModal(true); // Show the password modal
  };
  

  // Fetch order items for the selected order
  const fetchOrderItems = async (orderId) => {
    setLoadingItems(true);
    try {
      const response = await fetch(`/api/order-items/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order items');
      }
      const items = await response.json();
      setOrderItems(items);
    } catch (error) {
      console.error('Error fetching order items:', error);
    } finally {
      setLoadingItems(false);
    }
  };
  
  
  // Trigger fetching order items when the "Product List" tab is clicked
  useEffect(() => {
    if (activeTab === 'products' && selectedOrder) {
      fetchOrderItems(selectedOrder.id);
    }
  }, [activeTab, selectedOrder]);

  // Filter orders based on search query and filters
  const filteredOrders = (orders || []).filter((order) => {
    const searchQueryLower = searchQuery.toLowerCase();
    const matchesSearchQuery =
      (`OID-${order.id}`.toLowerCase().includes(searchQueryLower) ||
        (order.firstName?.toLowerCase() || '').includes(searchQueryLower) ||
        (order.lastName?.toLowerCase() || '').includes(searchQueryLower));
    const matchesStatus =
      activeStatus === 'All' || order.status?.toLowerCase() === activeStatus.toLowerCase();
    const matchesPaymentStatus =
      selectedPaymentStatus === '' || order.paymentStatus?.toLowerCase() === selectedPaymentStatus.toLowerCase();
    const matchesPaymentMethod =
      selectedPaymentMethod === '' || order.paymentOption?.toLowerCase() === selectedPaymentMethod.toLowerCase();
    const matchesDeliveryOption =
      selectedDeliveryOption === '' || order.deliveryOption?.toLowerCase() === selectedDeliveryOption.toLowerCase();
    const matchesProvince = selectedProvince === '' || order.province === selectedProvince;
    const matchesCity = selectedCity === '' || order.city === selectedCity;

    return (
      !order.archived &&
      matchesSearchQuery &&
      matchesStatus &&
      matchesPaymentStatus &&
      matchesPaymentMethod &&
      matchesDeliveryOption &&
      matchesProvince &&
      matchesCity
    );
  });

  const handleExportClick = () => {
    // Prepare filtered orders data for CSV export
    const csvData = filteredOrders.map(order => ({
        OrderID: `OID-${order.id}`,
        CustomerName: `${order.firstName} ${order.lastName}`,
        Email: order.email,
        Phone: order.phone,
        Status: order.status,
        PaymentStatus: order.paymentStatus,
        DeliveryOption: order.deliveryOption || 'N/A',
        Province: order.province || 'N/A',
        City: order.city || 'N/A',
        DeliveryDate: order.pickUpDate || 'N/A',
    }));

    const csvContent = [
        Object.keys(csvData[0]).join(','), // Header row
        ...csvData.map(row => Object.values(row).join(',')), // Data rows
    ].join('\n');

    // Create a Blob for the CSV data and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders_export.csv'); // File name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


return (
    <div className="min-h-screen bg-black text-white pt-[120px] pb-10">
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
              onClick={handleGeneratePDF}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg text-sm"
            >
              Generate PDF
            </button>

          <button
            onClick={handleExportClick} // Trigger the export functionality
            className="ml-4 px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg text-sm"
        >
            Export
        </button>
          <button
          onClick={handleAddOrder} // Open password modal for adding a new order
          className="ml-4 px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg text-sm"
        >
          Add Order
        </button>

        </div>
      </div>

      {/* Filters and Order List */}
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="col-span-1">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-white mb-4">FILTERS</h2>

            {/* Order Status Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-2">ORDER STATUS</h3>
              <div className="flex space-x-2">
                {['All', 'Pending', 'Completed', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`text-sm px-4 py-2 rounded-lg ${
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

            {/* Payment Status and Method Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-2">PAYMENT</h3>
              <div className="relative mb-4">
                <button
                  onClick={() => setIsPaymentStatusOpen(!isPaymentStatusOpen)}
                  className="w-full text-sm px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
                >
                  {selectedPaymentStatus || 'PAYMENT STATUS'}
                </button>
                {isPaymentStatusOpen && (
                  <div className="absolute mt-2 w-full bg-[#040405] rounded-lg shadow-lg z-10">
                    <ul className="text-sm text-white">
                    {['All', 'Paid', 'Unpaid'].map((status) => (
                          <li
                            key={status}
                            className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                            onClick={() => {
                              setSelectedPaymentStatus(status);
                              setIsPaymentStatusOpen(false);
                            }}
                          >
                            {status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsPaymentMethodOpen(!isPaymentMethodOpen)}
                    className="w-full text-sm px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
                  >
                    {selectedPaymentMethod || 'PAYMENT METHOD'}
                  </button>
                  {isPaymentMethodOpen && (
                    <div className="absolute mt-2 w-full bg-[#040405] rounded-lg shadow-lg z-10">
                      <ul className="text-sm text-white">
                      {['Cash', 'GCash'].map((method) => (
                          <li
                            key={method}
                            className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                            onClick={() => {
                              setSelectedPaymentMethod(method);
                              setIsPaymentMethodOpen(false);
                            }}
                          >
                            {method}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Details Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white mb-2">DELIVERY</h3>
                <div className="relative mb-4">
                  <button
                    onClick={() => setIsDeliveryOptionOpen(!isDeliveryOptionOpen)}
                    className="w-full text-sm px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
                  >
                    {selectedDeliveryOption || 'DELIVERY OPTION'}
                  </button>
                  {isDeliveryOptionOpen && (
                    <div className="absolute mt-2 w-full bg-[#040405] rounded-lg shadow-lg z-10">
                      <ul className="text-sm text-white">
                        {['All', 'Via Courier', 'Pick Up'].map((option) => (
                          <li
                            key={option}
                            className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                            onClick={() => {
                              setSelectedDeliveryOption(option);
                              setIsDeliveryOptionOpen(false);
                            }}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg focus:outline-none"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              </div>
          </div>

          {/* Order List */}
          <div className="col-span-3">
            <div className="space-y-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center text-gray-400">No orders found</div>
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
                      <h2 className="text-xl font-semibold">{`${order.firstName} ${order.lastName}`}</h2>
                      <p className="text-gray-400 text-sm mt-2">
                        {order.email} | {order.phone} | {order.status} | {order.paymentStatus}
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
                    <h2 className="text-xl font-semibold">{`${selectedOrder.firstName} ${selectedOrder.lastName}`}</h2>
                    <p className="text-gray-400">{selectedOrder.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-x-4">
              <button onClick={handleEditClick} className="text-sm text-white hover:underline">
                  Edit
                </button>
                <button onClick={handleArchiveClick} className="text-sm text-white hover:underline">
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
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">General Information</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Customer Name:</strong> {selectedOrder.firstName} {selectedOrder.lastName}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Email:</strong> {selectedOrder.email}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Contact Number:</strong> {selectedOrder.phone}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Status:</strong> {selectedOrder.status}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
                  </p>
                </div>
              )}
              {activeTab === 'delivery' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Delivery Details</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Delivery Option:</strong> {selectedOrder.deliveryOption}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Pick-Up Date:</strong> {selectedOrder.pickUpDate}
                  </p>
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>Address:</strong> {selectedOrder.city}, {selectedOrder.province}
                  </p>
                </div>
              )}
              {activeTab === 'products' && (
                <>
                  {loadingItems ? (
                    <p>Loading...</p>
                  ) : orderItems.length === 0 ? (
                    <p>No products found.</p>
                  ) : (
                    <div>
                      {orderItems.map((item) => (
                        <div key={item.id}>
                          <p>Product: {item.product_name}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price: {item.unit_price}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
       {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-[#040405] p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 text-center">
              ACCESS ORDER TO {actionType === 'edit' ? `EDIT ORDER #${selectedOrder?.id}` : actionType === 'archive' ? `ARCHIVE ORDER #${selectedOrder?.id}` : 'ADD NEW ORDER'}
            </h2>
            <p className="mb-4 text-sm text-center">
              Enter your password to {actionType} the order.
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
              <div className="flex justify-between mt-6">
                <button
                  className="w-1/2 px-6 py-2 text-sm text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition mr-2"
                  onClick={handlePasswordSubmit}
                >
                  SUBMIT
                </button>
                <button
                  className="w-1/2 px-6 py-2 text-sm text-white rounded-lg bg-gray-600 hover:bg-gray-700 transition"
                  onClick={handleClosePasswordModal}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}


    </div>
  );
};

export const getOrderSummary = (orders) => {
  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'Pending').length,
    completedOrders: orders.filter(o => o.status === 'Completed').length,
  };
};


export default OrderLanding;