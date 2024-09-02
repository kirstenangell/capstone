import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaTruck } from 'react-icons/fa';
import { IoMdPin } from 'react-icons/io';
import { MdPayments } from 'react-icons/md';
import { IoArrowForwardCircle } from 'react-icons/io5'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import QRCode from 'react-qr-code';

const CheckoutLanding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], total = 0 } = location.state || {};

  const [expandedSection, setExpandedSection] = useState(null);
  const [addAddressExpanded, setAddAddressExpanded] = useState(false);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [bookingMethod, setBookingMethod] = useState(null);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [userInfo, setUserInfo] = useState({
    email: 'loremipsumdolor@gmail.com',
    phone: '912 456 7891',
    countryCode: '+63',
    firstName: 'Lorem',
    lastName: 'Ipsum',
  });

  const addressSectionRef = useRef(null);

  const handleEditClick = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
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

  const handleDeliveryOptionClick = (option) => {
    setSelectedDeliveryOption(option);
    setSelectedCourier(null); // Reset courier selection when changing delivery option
    setBookingMethod(null); // Reset booking method selection when changing delivery option
    setPickupTime(null); // Reset pickup time when changing delivery option
  };

  const handlePaymentOptionClick = (method) => {
    setSelectedPaymentMethod(method);
  };

  const isFutureDate = (date) => {
    const today = new Date();
    return date >= today && date <= new Date(today.setMonth(today.getMonth() + 3)); // Limit to 3 months in the future
  };

  return (
    <div className="min-h-screen flex bg-black text-white py-10">
      <div className="flex w-full max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="flex-1 space-y-4 mr-4 max-w-lg">
          {/* Back to Products Button */}
          <button
            onClick={() => navigate('/products')}
            className="mb-4 p-4 rounded-md bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] hover:shadow-[0_0_15px_5px_rgba(0,255,255,0.3)] transition-shadow"
          >
            Back to Products
          </button>

          {/* Information Section */}
          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] border border-transparent cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FaUser className="text-lg align-middle" />
                <div className="text-lg font-semibold align-middle">Information</div>
              </div>
              <div className="text-sm font-medium cursor-pointer" onClick={() => handleEditClick('information')}>Edit</div>
            </div>
            {expandedSection !== 'information' && (
              <div className="mt-4">
                <div className="text-sm">{userInfo.firstName} {userInfo.lastName}</div>
                <div className="text-sm">{userInfo.email}</div>
                <div className="text-sm">{userInfo.countryCode} {userInfo.phone}</div>
              </div>
            )}
            {expandedSection === 'information' && (
              <div className="mt-4">
                <div className="mt-4">
                    <div className="text-sm">{userInfo.firstName} {userInfo.lastName}</div>
                    <div className="text-sm">{userInfo.email}</div>
                    <div className="text-sm">{userInfo.countryCode} {userInfo.phone}</div>
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
                <div className="relative mt-4">
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div className="relative">
                    <label className="text-xs mb-1 block">Country Code</label>
                    <div
                      className="w-full p-3 bg-transparent border border-gray-700 rounded-md text-xs"
                      style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                    >
                      {userInfo.countryCode}
                    </div>
                  </div>
                  <div className="relative">
                    <label className="text-xs mb-1 block">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Enter phone number"
                      value={userInfo.phone}
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
              <div className="text-sm font-medium cursor-pointer" onClick={() => handleEditClick('address')}>Edit</div>
            </div>
            {expandedSection === 'address' && (
              <div className="mt-4">
                <div
                  className="w-full p-4 bg-transparent border border-gray-700 rounded-md text-xs"
                  style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                >
                  Loren Ipsum Dolor, Sit Amet Consectetur
                </div>
                <div
                  className="w-full p-4 bg-transparent border border-gray-700 rounded-md text-center text-sm mt-4 cursor-pointer"
                  style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                  onClick={handleAddAddressClick}
                >
                  + Add Address
                </div>
                {addAddressExpanded && (
                  <div className="mt-4">
                    <p>Form for adding a new address goes here...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Delivery Section */}
          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] border border-transparent cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FaTruck className="text-lg align-middle" />
                <div className="text-lg font-semibold align-middle">Delivery</div>
              </div>
              <div className="text-sm font-medium cursor-pointer" onClick={() => handleEditClick('delivery')}>Edit</div>
            </div>
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
            onMouseDown={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #033649, #23394d)'}
            onMouseUp={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #040405, #335C6E)'}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
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
          onMouseDown={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #033649, #23394d)'}
          onMouseUp={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #040405, #335C6E)'}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
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
          onMouseDown={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #033649, #23394d)'}
          onMouseUp={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #040405, #335C6E)'}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          {courier}
        </button>
      ))}
    </div>

    {/* Booking Method */}
    {selectedCourier && (
      <div className="mt-4">
        <p className="text-sm mb-2">Choose your Booking Method</p>
        <div className="flex space-x-4">
          <button 
            className={`w-1/2 h-12 text-xs p-4 rounded-md ${bookingMethod === 'self' ? 'bg-blue-600' : ''}`}
            style={{ 
              background: bookingMethod === 'self' ? 'linear-gradient(90deg, #033649, #23394d)' : 'linear-gradient(90deg, #040405, #335C6E)',
              borderWidth: '0.5px', 
              borderColor: 'white', 
              border: '1px solid gray',
              transition: 'box-shadow 0.3s ease',
            }}
            onClick={() => setBookingMethod('self')}
            onMouseDown={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #033649, #23394d)'}
            onMouseUp={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #040405, #335C6E)'}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            Self-Managed Booking
          </button>
          <button 
            className={`w-1/2 h-12 text-xs p-4 rounded-md ${bookingMethod === 'flacko' ? 'bg-blue-600' : ''}`}
            style={{ 
              background: bookingMethod === 'flacko' ? 'linear-gradient(90deg, #033649, #23394d)' : 'linear-gradient(90deg, #040405, #335C6E)',
                    borderWidth: '0.5px', 
                    borderColor: 'white', 
                    border: '1px solid gray',
                    transition: 'box-shadow 0.3s ease',
                  }}
                  onClick={() => setBookingMethod('flacko')}
                  onMouseDown={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #033649, #23394d)'}
                  onMouseUp={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #040405, #335C6E)'}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            Flacko-Managed Booking
          </button>
        </div>
      </div>
    )}

  {/* Address Selection */}
{bookingMethod && (
  <div className="mt-4">
    <p className="text-sm mb-2">Select your Address</p>
    <div 
      className="p-4 bg-transparent rounded-md mb-4 cursor-pointer"
      style={{ 
        background: 'linear-gradient(90deg, #040405, #335C6E)', 
        borderWidth: '0.5px', 
        borderColor: 'white', 
        border: '1px solid gray',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div className="text-xs flex justify-between items-center">
        <span>Current Address</span>
        <span className="text-xs text-blue-400">Default</span>
      </div>
      <p className="text-xs text-gray-400">Loren Ipsum Dolor, Sit Amet Consectetur</p>
    </div>
    <div 
      className="p-4 bg-transparent rounded-md text-center text-xs cursor-pointer"
      style={{ 
        background: 'linear-gradient(90deg, #040405, #335C6E)', 
        borderWidth: '0.5px', 
        borderColor: 'white', 
        border: '1px solid gray',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      + Add New Address
    </div>
  </div>
)}
  </div>
)}

               {/* Pickup Options */}
{selectedDeliveryOption === 'pickup' && (
  <div className="mt-4">
    <p className="text-sm mb-2">Select a pickup date</p>
    <DatePicker
      selected={pickupDate}
      onChange={(date) => setPickupDate(date)}
      inline
      filterDate={isFutureDate}
      calendarClassName="bg-[#333] text-white rounded-lg border border-gray-900" // Tailwind-style classes for calendar
      dayClassName={date => "text-white hover:bg-[#335C6E] rounded-lg"} // Day styles
      monthClassName="text-white bg-[#040405] border-b border-gray-700" // Month styles
      todayButton="Today"
      className="w-full p-4 bg-transparent border border-gray-700 rounded-md text-xs" // Custom input styling
    />
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
      onClick={() => setPickupTime(time)} // Update the state to keep the selected time highlighted
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      {time}
    </button>
  ))}
</div>
    <p className="text-sm mt-4 mb-2">Flacko Pickup Location</p>
    <div 
      className="text-xs p-4 rounded-md"
      style={{ 
        background: 'linear-gradient(90deg, #040405, #335C6E)', 
        border: '1px solid gray',
        cursor: 'default' // This removes the hover pointer
      }}
    >
      <p>Flacko Auto Parts and Accessories</p>
      <p>Loren Ipsum Dolor, Sit Amet Consectetur</p>
    </div>
  </div>
)}

              </div>
            )}
          </div>

{/* Payment Section */}
<div 
  className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] border border-transparent cursor-pointer"
>
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <MdPayments className="text-lg align-middle" />
      <div className="text-lg font-semibold align-middle">Payment</div>
    </div>
    <div className="text-sm font-medium cursor-pointer" onClick={() => handleEditClick('payment')}>Edit</div>
  </div>
  {expandedSection === 'payment' && (
    <div className="mt-4">
      <p className="text-sm mb-4">Select your Payment Method</p>
      <div className="flex space-x-4">
        <button 
          className={`w-full h-12 text-xs p-4 rounded-md ${selectedPaymentMethod === 'gcash' ? 'bg-blue-600' : ''}`}
          style={{ 
            background: selectedPaymentMethod === 'gcash' ? 'linear-gradient(90deg, #033649, #23394d)' : 'linear-gradient(90deg, #040405, #335C6E)', 
            borderWidth: '0.5px', 
            borderColor: 'white', 
            border: '1px solid gray',
            transition: 'box-shadow 0.3s ease',
          }}
          onClick={() => handlePaymentOptionClick('gcash')}
          onMouseDown={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #033649, #23394d)'}
          onMouseUp={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #040405, #335C6E)'}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          Via GCash
        </button>
        <button 
          className={`w-full h-12 text-xs p-4 rounded-md ${selectedPaymentMethod === 'store' ? 'bg-blue-600' : ''}`}
          style={{ 
            background: selectedPaymentMethod === 'store' ? 'linear-gradient(90deg, #033649, #23394d)' : 'linear-gradient(90deg, #040405, #335C6E)', 
            borderWidth: '0.5px', 
            borderColor: 'white', 
            border: '1px solid gray',
            transition: 'box-shadow 0.3s ease',
          }}
          onClick={() => handlePaymentOptionClick('store')}
          onMouseDown={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #033649, #23394d)'}
          onMouseUp={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #040405, #335C6E)'}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          Via Physical Store
        </button>
      </div>

      {/* Display QR Code for GCash */}
{selectedPaymentMethod === 'gcash' && (
  <div 
    className="mt-4 p-6 rounded-md text-center"
    style={{ 
      background: 'linear-gradient(90deg, #040405, #335C6E)', 
      border: '1px solid gray',
      cursor: 'default' // This removes the hover pointer
    }}
  >
    <p className="mb-4">Scan the QR code below to pay via GCash:</p>
    <div 
      className="p-4 inline-block rounded-md" 
      style={{ 
        background: 'white', 
        border: '1px solid gray',
      }}
    >
      <QRCode value="GCash Payment Info" size={128} />
    </div>
  </div>
)}


 {/* Display confirmation for Physical Store */}
{selectedPaymentMethod === 'store' && (
  <div 
    className="text-xs mt-4 p-6 rounded-md text-left"
    style={{ 
      background: 'linear-gradient(90deg, #040405, #335C6E)', 
      cursor: 'default' // This removes the hover pointer
    }}
  >
    <p>Payment will be completed in store.</p>
    <p>Thank you for choosing to pay at our physical store. Please visit us to complete your transaction.</p>
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
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <div className="font-medium">{item.name}</div> {/* Updated to show product name */}
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
            </>
          ) : (
            <div className="text-center mt-10">
              <h2 className="text-lg font-medium">Your Cart is Empty</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutLanding;
