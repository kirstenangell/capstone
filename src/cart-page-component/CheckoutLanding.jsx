import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaTruck } from 'react-icons/fa';
import { IoMdPin } from 'react-icons/io';
import { MdPayments } from 'react-icons/md';
import { IoArrowForwardCircle, IoArrowBackOutline } from 'react-icons/io5';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import QRCode from 'react-qr-code';
import axios from 'axios';

const CheckoutLanding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], total = 0 } = location.state || {};

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [addAddressExpanded, setAddAddressExpanded] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [bookingMethod, setBookingMethod] = useState(null);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMessageInput, setPaymentMessageInput] = useState('');
  const [selectedPickupLocation, setSelectedPickupLocation] = useState('');



  const [userInfo, setUserInfo] = useState({
    email: '',
    contactNumber: '',
    countryCode: '+63',
    firstName: '',
    lastName: '',
  });
  

  useEffect(() => {
    const fetchUserDetails = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await axios.get('http://localhost:5000/user-details', {
            params: { email },
          });
          const {
            firstName,
            lastName,
            email: userEmail,
            contactNumber,
            street,
            barangay,
            city,
            region,
            province,
            zipCode,
          } = response.data;

          // Populate user information
          setUserInfo({
            firstName,
            lastName,
            email: userEmail,
            contactNumber: contactNumber || '',
            countryCode: '+63',
          });

          // Populate addresses and set the default address
          const defaultAddress = {
            streetName: street || '',
            barangay: barangay || '',
            city: city || '',
            region: region || '',
            province: province || '',
            zipCode: zipCode || '',
          };

          setAddresses([defaultAddress]); // Set default address in addresses
          setSelectedAddress(defaultAddress); // Set the selected address as the default
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);
  
  
  
  
  



  const [addressInfo, setAddressInfo] = useState({
    streetName: '',
    barangay: '',
    city: '',
    region: '',
    province: '',
    zipCode: '',
  });
  

  const [addresses, setAddresses] = useState([
    {
      houseNumber: '123',
      streetName: 'Main Street',
      barangay: 'Barangay 1',
      city: 'Cityname',
    },
  ]);

  const addressSectionRef = useRef(null);

  const handleEditClick = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo({ ...addressInfo, [name]: value });
  };

  const handleProceedToAddress = () => {
    setExpandedSection('address');
    if (addressSectionRef.current) {
      addressSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddAddressClick = () => {
    setAddAddressExpanded(!addAddressExpanded);
  };
  
  const handleAddNewAddress = () => {
    setAddresses([...addresses, addressInfo]); // Add the new address to the addresses list
    setAddressInfo({ houseNumber: '', streetName: '', barangay: '', city: '' }); // Clear the input fields
    setAddAddressExpanded(false); // Collapse the add address section
  
  };
  const handleDeliveryOptionClick = (option) => {
    setSelectedDeliveryOption(option);
    setExpandedSection('delivery'); // Expand the delivery section when an option is selected
    setSelectedCourier(null);
    setBookingMethod(null);
    setPickupTime(null);
  };
  

  const handlePaymentOptionClick = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    const orderDetails = {
      id: `OID-${Math.floor(Math.random() * 10000)}`,
      items: cartItems.map((item) => ({
        ...item,
        price: parseFloat(item.price) || 0,
      })),
      createdAt: new Date().toLocaleDateString(),
      deliveryService:
        selectedDeliveryOption === "courier" ? selectedCourier : "Pickup",
      paymentMethod:
        selectedPaymentMethod === "gcash" ? "GCash" : "Physical Store",
      status: "Processing",
      customerName: `${userInfo.firstName} ${userInfo.lastName}`,
      userEmail: userInfo.email, // Ensure this field is passed
      phone: userInfo.contactNumber,
      paymentSummary: {
        subtotal: total,
        shippingFee: selectedDeliveryOption === "courier" ? 50 : 0,
        total: total + (selectedDeliveryOption === "courier" ? 50 : 0),
      },
      user: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        contactNumber: userInfo.contactNumber,
      },
      order: {
        address: selectedAddress,
        deliveryOption: selectedDeliveryOption,
        courier: selectedCourier,
        paymentOption: selectedPaymentMethod,
        pickUpTime: pickupTime,
        pickUpDate: pickupDate ? pickupDate.toISOString().split("T")[0] : null,
        products: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
        total: total + (selectedDeliveryOption === "courier" ? 50 : 0),
      },
      orderItems: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };
  
    console.log("Order Details Payload:", orderDetails); // Log for debugging
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/save-order",
        orderDetails
      );
  
      if (response.data.success) {
        alert("Order placed successfully!");
        fetchOrderHistory();
        setOrderPlaced(true);
        setTimeout(() => {
          navigate("/manage-account");
        }, 2000);
      } else {
        throw new Error("Order placement failed on server.");
      }
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert(
        error.response?.data?.message || "Failed to place order. Please try again."
      );
    }
  };
  
  

  const fetchOrderHistory = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/order-history", {
            params: { email: userInfo.email },
        });
        if (response.data.success) {
            console.log("Order history updated:", response.data.orders);
        }
    } catch (error) {
        console.error("Error fetching order history:", error);
    }
};

  
  
  const isFutureDate = (date) => {
    const today = new Date();
    return date >= today && date <= new Date(today.setMonth(today.getMonth() + 3));
  };

  // Validation for required fields
// Validation for required fields
const missingFields = [];

if (!userInfo.firstName || !userInfo.lastName || !userInfo.email || !userInfo.contactNumber) {
  missingFields.push('Information');
}
if (!addresses.length) {
  missingFields.push('Address');
}
if (!selectedDeliveryOption || (selectedDeliveryOption === 'courier' && !selectedCourier)) {
  missingFields.push('Delivery');
}
if (!selectedPaymentMethod) {
  missingFields.push('Payment');
}





  return (
    <div className="min-h-screen flex bg-black text-white py-10 relative">
      <div className="flex w-full max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="flex-1 space-y-4 mr-4 max-w-lg">
          {/* Back to Products Button */}
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-xs mb-2 p-2 rounded-md bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] hover:shadow-[0_0_15px_5px_rgba(0,255,255,0.3)] transition-shadow"
          >
            <IoArrowBackOutline className="mr-2" /> Back to Products
          </button>

          {/* Information Section */}
          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] border border-transparent cursor-pointer">
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <FaUser className="text-lg align-middle" />
      <div className="text-lg font-semibold align-middle">Information</div>
    </div>
    <div
    className="text-sm font-medium cursor-pointer"
    onClick={() => handleEditClick('information')}
  >
    {expandedSection === 'information' ? 'Done' : 'Edit'}
  </div>
  </div>
  {expandedSection !== 'information' && (
    <div className="mt-4">
      <div className="text-sm">{userInfo.firstName} {userInfo.lastName}</div>
      <div className="text-sm">{userInfo.email}</div>
      <div className="text-sm">{userInfo.contactNumber}</div>
    </div>
  )}
  {expandedSection === 'information' && (
    <div className="mt-4">
                <div className="mt-4">
                    <div className="text-sm">{userInfo.firstName} {userInfo.lastName}</div>
                    <div className="text-sm">{userInfo.email}</div>
                    <div className="text-sm">{userInfo.contactNumber}</div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="relative">
                    <label className="text-xs mb-1 block">First Name</label>
                    <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={userInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                    style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                  />
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter last name"
                      value={userInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
        <div className="relative">
          <label className="text-xs mb-1 block">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={userInfo.email}
            onChange={handleInputChange}
            className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
            style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
          />
        </div>
        <div className="relative">
          <label className="text-xs mb-1 block">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            placeholder="Enter contact number"
            value={userInfo.contactNumber}
            onChange={handleInputChange}
            className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
            style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
          />
        </div>
      </div>
                <button 
                  className="mt-4 w-full bg-black p-2 rounded-full text-sm bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent"
                  onClick={handleProceedToAddress}
                >
                  Proceed to Address
                  <IoArrowForwardCircle className="ml-2" />
                </button>
              </div>
            )}
          </div>

          {/* Address Section */}
          <div 
            ref={addressSectionRef} 
            className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] border border-transparent cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <IoMdPin className="text-lg align-middle" />
                <div className="text-lg font-semibold align-middle">Address</div>
              </div>
              <div
                className="text-sm font-medium cursor-pointer"
                onClick={() => handleEditClick('address')}
              >
                {expandedSection === 'address' ? 'Done' : 'Edit'}
              </div>
            </div>
            {expandedSection !== 'address' && (
              <div className="mt-4">
                {addresses.map((address, index) => (
                <div key={index} className="text-sm mt-2">
                 {address.streetName}, {address.barangay}, {address.city}, {address.region}, {address.province}, {address.zipCode}
                </div>
              ))}

              </div>
            )}
            {expandedSection === 'address' && (
              <div className="mt-4">
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="w-full p-4 bg-transparent border border-gray-700 rounded-md text-xs mt-2"
                    style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                  >
                     {address.streetName}, {address.barangay}, {address.city}, {address.region}, {address.province}, {address.zipCode}
                  </div>
                ))}
                {addAddressExpanded && (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <label className="text-xs mb-1 block">House Number</label>
                    <input
                      type="text"
                      name="houseNumber"
                      placeholder="Lorem"
                      value={addressInfo.houseNumber}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">Street Name</label>
                    <input
                      type="text"
                      name="streetName"
                      placeholder="Lorem"
                      value={addressInfo.streetName}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">Barangay</label>
                    <input
                      type="text"
                      name="barangay"
                      placeholder="Lorem"
                      value={addressInfo.barangay}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Lorem"
                      value={addressInfo.city}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                    />
                  </div>
                  <div className="col-span-2 mt-4">
                    <button
                      type="button"
                      className="w-full p-3 bg-black text-white rounded-md text-xs"
                      style={{ background: '#007BFF' }}
                      onClick={handleAddNewAddress}
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
          
          {/* Delivery Section */}
          {/* Delivery Section */}
<div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] border border-transparent cursor-pointer">
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <FaTruck className="text-lg align-middle" />
      <div className="text-lg font-semibold align-middle">Delivery</div>
    </div>
    <div
      className="text-sm font-medium cursor-pointer"
      onClick={() => handleEditClick('delivery')}
    >
      {expandedSection === 'delivery' ? 'Done' : 'Edit'}
    </div>
  </div>

  {expandedSection !== 'delivery' && selectedDeliveryOption && (
  <div className="mt-4 text-sm">
    {selectedDeliveryOption === 'courier' ? (
      <>
        <p>Via Courier</p>
        {selectedCourier && <p>{selectedCourier}</p>}
        {bookingMethod && <p>{bookingMethod === 'self' ? 'Self-Managed' : 'Flacko-Managed'}</p>}
        {selectedAddress && (
          <p>
            {selectedAddress.streetName}, {selectedAddress.barangay}, {selectedAddress.city}, {selectedAddress.province}, {selectedAddress.zipCode}
          </p>
        )}
      </>
    ) : (
      <>
        <p>Via Pickup</p>
        <p>{pickupDate.toDateString()}</p>
        {pickupTime && <p>{pickupTime}</p>}
        {selectedPickupLocation && <p>{selectedPickupLocation}</p>}
      </>
    )}
  </div>
)}


  {expandedSection === 'delivery' && (
    <div className="mt-4">
      <p className="mb-4 text-sm">Available Delivery Options</p>
      <div className="flex space-x-4">
        <button
          className={`w-full h-12 text-xs p-4 rounded-md ${selectedDeliveryOption === 'courier' ? 'bg-blue-600' : ''}`}
          style={{
            background: selectedDeliveryOption === 'courier' ? 'linear-gradient(90deg, #033649, #23394d)' : 'linear-gradient(90deg, #040405, #335C6E)',
            borderWidth: '0.5px',
            borderColor: 'white',
            border: '1px solid gray',
            transition: 'box-shadow 0.3s ease',
          }}
          onClick={() => handleDeliveryOptionClick('courier')}
        >
          Via Courier
        </button>
        <button
          className={`w-full h-12 text-xs p-4 rounded-md ${selectedDeliveryOption === 'pickup' ? 'bg-blue-600' : ''}`}
          style={{
            background: selectedDeliveryOption === 'pickup' ? 'linear-gradient(90deg, #033649, #23394d)' : 'linear-gradient(90deg, #040405, #335C6E)',
            borderWidth: '0.5px',
            borderColor: 'white',
            border: '1px solid gray',
            transition: 'box-shadow 0.3s ease',
          }}
          onClick={() => handleDeliveryOptionClick('pickup')}
        >
          Via Pickup
        </button>
      </div>

      {/* Courier Options */}
      {selectedDeliveryOption === 'courier' && (
        <div className="mt-4">
          <p className="text-sm mb-2">Select a courier</p>
          <div className="grid grid-cols-2 gap-4">
            {['Grab Express', 'Lalamove', 'Angkas Padala', 'Move It'].map((courier) => (
              <button
                key={courier}
                className={`w-full h-12 text-xs p-4 rounded-md ${selectedCourier === courier ? 'bg-blue-600' : ''}`}
                style={{
                  background: selectedCourier === courier ? 'linear-gradient(90deg, #033649, #23394d)' : 'linear-gradient(90deg, #040405, #335C6E)',
                  borderWidth: '0.5px',
                  borderColor: 'white',
                  border: '1px solid gray',
                  transition: 'box-shadow 0.3s ease',
                }}
                onClick={() => setSelectedCourier(courier)}
              >
                {courier}
              </button>
            ))}
          </div>

          {/* Address Selection */}
          {selectedCourier && (
            <div className="mt-4">
              <p className="text-sm mb-2">Select your Address</p>
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`p-4 bg-transparent rounded-md mb-4 cursor-pointer ${selectedAddress === address ? 'border-blue-500' : ''}`}
                  style={{
                    background: 'linear-gradient(90deg, #040405, #335C6E)',
                    borderWidth: '0.5px',
                    borderColor: selectedAddress === address ? 'blue' : 'white',
                    border: '1px solid gray',
                    transition: 'box-shadow 0.3s ease',
                  }}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className="text-xs flex justify-between items-center">
                    <span>{address.streetName}, {address.barangay}, {address.city}, {address.province}, {address.zipCode}</span>
                    {index === 0 && <span className="text-xs text-blue-400">Default</span>}
                  </div>
                </div>
              ))}
              <div
                className="p-4 bg-transparent rounded-md text-center text-xs cursor-pointer"
                style={{
                  background: 'linear-gradient(90deg, #040405, #335C6E)',
                  borderWidth: '0.5px',
                  borderColor: 'white',
                  border: '1px solid gray',
                  transition: 'box-shadow 0.3s ease',
                }}
                onClick={handleAddAddressClick}
              >
                + Add New Address
              </div>
              {addAddressExpanded && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <label className="text-xs mb-1 block">Street Name</label>
                    <input
                      type="text"
                      name="streetName"
                      placeholder="Enter street name"
                      value={addressInfo.streetName}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{
                        background: 'linear-gradient(90deg, #040405, #335C6E)',
                        borderWidth: '0.5px',
                        borderColor: 'white',
                      }}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">Barangay</label>
                    <input
                      type="text"
                      name="barangay"
                      placeholder="Enter barangay"
                      value={addressInfo.barangay}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{
                        background: 'linear-gradient(90deg, #040405, #335C6E)',
                        borderWidth: '0.5px',
                        borderColor: 'white',
                      }}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={addressInfo.city}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{
                        background: 'linear-gradient(90deg, #040405, #335C6E)',
                        borderWidth: '0.5px',
                        borderColor: 'white',
                      }}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">Region</label>
                    <input
                      type="text"
                      name="region"
                      placeholder="Enter region"
                      value={addressInfo.region}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{
                        background: 'linear-gradient(90deg, #040405, #335C6E)',
                        borderWidth: '0.5px',
                        borderColor: 'white',
                      }}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">Province</label>
                    <input
                      type="text"
                      name="province"
                      placeholder="Enter province"
                      value={addressInfo.province}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{
                        background: 'linear-gradient(90deg, #040405, #335C6E)',
                        borderWidth: '0.5px',
                        borderColor: 'white',
                      }}
                    />
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Enter zip code"
                      value={addressInfo.zipCode}
                      onChange={handleAddressInputChange}
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{
                        background: 'linear-gradient(90deg, #040405, #335C6E)',
                        borderWidth: '0.5px',
                        borderColor: 'white',
                      }}
                    />
                  </div>
                  <div className="col-span-2 mt-4">
                    <button
                      type="button"
                      className="w-full p-3 bg-black text-white rounded-md text-xs"
                      style={{ background: '#007BFF' }}
                      onClick={handleAddNewAddress}
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pickup Options */}
      {selectedDeliveryOption === 'pickup' && (
        <div className="mt-4">
          <p className="text-sm mb-2">Select a pickup date</p>
          <div
            className="cursor-pointer w-full flex justify-center"
            onClick={() => setCalendarOpen(!calendarOpen)}
          >
            <DatePicker
            selected={pickupDate}
            onChange={(date) => setPickupDate(date)}
            open={calendarOpen}
            inline
            filterDate={isFutureDate}
            calendarClassName="bg-transparent text-white border-none"
            dayClassName={(date) => {
              const isSelected =
                date.getDate() === pickupDate.getDate() &&
                date.getMonth() === pickupDate.getMonth() &&
                date.getFullYear() === pickupDate.getFullYear();

              return isSelected
                ? "text-white bg-gradient-to-r from-[#335C6E] to-[#62B1D4] rounded-full cursor-pointer"
                : "text-white hover:bg-[#335C6E] transition-all ease-in-out duration-200 rounded-lg cursor-pointer";
            }}
            dayStyle={(date) => ({
              color: "white", // Ensure all dates have white text
              background:
                date.getDate() === pickupDate.getDate() &&
                date.getMonth() === pickupDate.getMonth() &&
                date.getFullYear() === pickupDate.getFullYear()
                  ? "linear-gradient(90deg, #335C6E, #62B1D4)"
                  : "transparent",
            })}
            monthClassName="text-white border-none"
            todayButton="Today"
            className="p-4 text-xs w-full"
            style={{ width: "100%", maxWidth: "320px" }}
          />

          </div>
          <p className="text-sm mt-4 mb-2">Select a pickup time</p>
          <div className="grid grid-cols-2 gap-4">
            {['09:00 AM', '10:00 AM', '02:00 PM', '04:30 PM'].map((time) => (
              <button
                key={time}
                className={`w-full h-12 text-xs p-4 rounded-md ${pickupTime === time ? 'bg-blue-700' : ''}`}
                style={{
                  background: pickupTime === time ? 'linear-gradient(90deg, #033649, #23394d)' : 'linear-gradient(90deg, #040405, #335C6E)',
                  borderWidth: '0.5px',
                  borderColor: 'white',
                  border: '1px solid gray',
                  transition: 'box-shadow 0.3s ease',
                }}
                onClick={() => setPickupTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <p className="text-sm mt-4 mb-2">Flacko Pickup Location</p>
          <button
            className="text-xs p-4 rounded-md w-full text-center"
            style={{
              background: "linear-gradient(90deg, #040405, #335C6E)",
              border: "1px solid gray",
            }}
            onClick={() =>
              setSelectedPickupLocation(
                "Flacko Auto Parts and Accessories, Lorem Ipsum Dolor, Sit Amet Consectetur"
              )
            }
          >
            <p>Flacko Auto Parts and Accessories</p>
            <p>Lorem Ipsum Dolor, Sit Amet Consectetur</p>
          </button>
        </div>
      )}
    </div>
  )}
</div>

          {/* Payment Section */}
          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] border border-transparent cursor-pointer">
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <MdPayments className="text-lg align-middle" />
      <div className="text-lg font-semibold align-middle">Payment</div>
    </div>
    <div
    className="text-sm font-medium cursor-pointer"
    onClick={() => handleEditClick('payment')}
  >
    {expandedSection === 'payment' ? 'Done' : 'Edit'}
  </div>
  </div>
  {expandedSection !== 'payment' && selectedPaymentMethod && (
  <div className="mt-4 text-sm">
    <p>Payment Method: {selectedPaymentMethod === 'gcash' ? 'Via GCash' : 'Via Physical Store'}</p>
    {paymentMessageInput && (
      <p className="mt-2 text-gray-400">
        Note: {paymentMessageInput}
      </p>
    )}
  </div>
)}


  {expandedSection === 'payment' && (
    <div className="mt-4">
      <p className="text-sm mb-4">Select your Payment Method</p>
      <div className="flex space-x-4">
        <button
          className={`w-full h-12 text-xs p-4 rounded-md ${
            selectedPaymentMethod === 'gcash' ? 'bg-blue-600 text-white' : ''
          }`}
          style={{
            background:
              selectedPaymentMethod === 'gcash'
                ? 'linear-gradient(90deg, #033649, #23394d)'
                : 'linear-gradient(90deg, #040405, #335C6E)',
            borderWidth: '0.5px',
            borderColor: 'white',
            border: '1px solid gray',
            transition: 'box-shadow 0.3s ease',
          }}
          onClick={() => handlePaymentOptionClick('gcash')}
        >
          Via GCash
        </button>
        <button
          className={`w-full h-12 text-xs p-4 rounded-md ${
            selectedPaymentMethod === 'store' ? 'bg-blue-600 text-white' : ''
          }`}
          style={{
            background:
              selectedPaymentMethod === 'store'
                ? 'linear-gradient(90deg, #033649, #23394d)'
                : 'linear-gradient(90deg, #040405, #335C6E)',
            borderWidth: '0.5px',
            borderColor: 'white',
            border: '1px solid gray',
            transition: 'box-shadow 0.3s ease',
          }}
          onClick={() => handlePaymentOptionClick('store')}
        >
          Via Physical Store
        </button>
      </div>

      {/* Conditional Message Box */}
      {selectedPaymentMethod && (
  <div
    className="mt-6 p-4 rounded-md flex flex-col items-center justify-center"
    style={{
      background: 'linear-gradient(90deg, #040405, #335C6E)',
      border: '1px solid gray',
      textAlign: 'center', // Ensures text and content are centrally aligned
    }}
  >
    {selectedPaymentMethod === 'gcash' ? (
      <>
        <p className="mb-4 text-sm">Scan the QR code below to pay via GCash:</p>
        <div className="p-4 bg-white inline-block rounded-md">
          <QRCode value="GCash Payment Info" size={128} />
        </div>
      </>
    ) : (
      <>
        <p className="text-sm">Payment will be completed in-store.</p>
        <p className="text-xs text-gray-400">
          Thank you for choosing to pay at our physical store. Please visit us to complete your transaction.
        </p>
      </>
    )}
  </div>
)}


      {/* Note Box for Additional Message */}
      {selectedPaymentMethod && (
        <div className="mt-4">
          <label htmlFor="paymentMessageInput" className="text-xs mb-2 inline-block text-gray-400">
            Add Additional Notes or Instructions (Optional)
          </label>
          <textarea
            id="paymentMessageInput"
            rows="3"
            placeholder="Write a note or additional instructions..."
            value={paymentMessageInput}
            onChange={(e) => setPaymentMessageInput(e.target.value)}
            className="w-full p-3 rounded-md bg-gray-700 text-gray-300 text-xs "
            style={{
              background: 'linear-gradient(90deg, #040405, #335C6E)',
              borderWidth: '0.5px',
              borderColor: 'white',
            }}
          />
        </div>
      )}
    </div>
  )}
</div>
 

        </div>

        {/* Right Column: Summary */}
        <div className="w-full max-w-xl bg-black p-6 rounded-lg ml-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.length > 0 ? (
            <>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <img src={item.image.split(',')[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-400">PHP {item.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">x{item.quantity}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <h2 className="font-semibold text-lg mb-2">Summary</h2>
                <hr className="border-gray-700 mb-4" />
                <div className="flex justify-between text-gray-400 text-sm mb-2">
                  <span>Subtotal</span>
                  <span className="text-blue-400">PHP {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm mb-2">
                  <span>Delivery</span>
                  <span className="text-blue-400">FREE</span>
                </div>
                <hr className="border-gray-700 mb-2" />
                <div className="flex justify-between font-semibold text-sm mt-4">
                  <span>Total</span>
                  <span className="text-blue-400">PHP {total.toLocaleString()}</span>
                </div>
              </div>
              
                 {/* Insert the conditional checkout button and warning here */}
      {missingFields.length === 0 && cartItems.length > 0 && (
        <div className="flex justify-center">
          <button
          className="text-sm mt-4 w-36 h-10 p-2 rounded-full text-white flex items-center justify-center transition-shadow"
          style={{
            background: 'linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%)',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.9)',
          }}
          onClick={handlePlaceOrder}
        >
          CHECKOUT
        </button>

        </div>
      )}

      {/* Warning if fields are missing */}
      {missingFields.length > 0 && (
        <div className="text-red-500 text-sm mt-4 text-center">
          <p>Please fill in the following sections:</p>
          <ul>
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  ) : (
    <div className="text-center mt-10">
      <h2 className="text-lg font-medium">Your Cart is Empty</h2>
    </div>
  )}
</div>
      {/* Modal for Order Placed */}
      {orderPlaced && (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur">
    <div className="bg-gradient-to-r from-[rgba(75,136,163,0.4)] via-[rgba(4,4,5,0.7)] to-[rgba(75,136,163,0.3)] p-10 rounded-lg shadow-xl text-center">
      <h2 className="text-2xl font-bold mb-4">YOUR ORDER HAS BEEN PLACED</h2>
      <p className="text-sm mb-2">OID-0000</p>
      <p className="text-sm mb-6">Wait for your order confirmation.</p>
      <div className="w-16 h-28 mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex justify-center">
        <button
          className="text-xs p-4 rounded-md flex items-center justify-center transition-shadow"
          style={{
            background: 'linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%)',
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.9)',
          }}
          onClick={() => navigate('/manage-account')}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    </div>
  );
};

export default CheckoutLanding;
