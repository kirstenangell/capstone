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
    setSelectedCourier(null);
    setBookingMethod(null);
    setPickupTime(null);
  };

  const handlePaymentOptionClick = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true); // Show the modal when checkout is clicked
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
    <div className="text-sm font-medium cursor-pointer" onClick={() => handleEditClick('information')}>Edit</div>
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
              <div className="text-sm font-medium cursor-pointer" onClick={() => handleEditClick('address')}>Edit</div>
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
          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] border border-transparent cursor-pointer">
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <FaTruck className="text-lg align-middle" />
      <div className="text-lg font-semibold align-middle">Delivery</div>
    </div>
    <div className="text-sm font-medium cursor-pointer" onClick={() => handleEditClick('delivery')}>Edit</div>
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
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
      >
        <div className="text-xs flex justify-between items-center">
          <span>{address.streetName}, {address.barangay}, {address.city}, {address.region}, {address.province}, {address.zipCode}</span>
          {index === 0 && <span className="text-xs text-blue-400">Default</span>}
        </div>
        <p className="text-xs text-gray-400">
          {address.streetName}, {address.barangay}, {address.city}
        </p>
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
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 255, 255, 0.2)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
      onClick={handleAddAddressClick} // Toggles the "Add Address" form
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


                {/* Pickup Options */}
                {selectedDeliveryOption === 'pickup' && (
                  <div className="mt-4">
          <p className="text-sm mb-2">Select a pickup date</p>
          <div className="cursor-pointer w-full flex justify-center" onClick={() => setCalendarOpen(!calendarOpen)}>
        <DatePicker
          selected={pickupDate}
          onChange={(date) => setPickupDate(date)}
          open={calendarOpen} // Controls calendar visibility
          inline
          filterDate={isFutureDate}
          calendarClassName="bg-transparent text-white border-none" // Transparent background for the calendar
          dayClassName={(date) => {
            const isSelected =
              date.getDate() === pickupDate.getDate() &&
              date.getMonth() === pickupDate.getMonth() &&
              date.getFullYear() === pickupDate.getFullYear();
            
            return isSelected
              ? "text-white rounded-full cursor-pointer" // Keeping the class minimal and applying the gradient below
              : "text-white hover:bg-[#040405] transition-all ease-in-out duration-200 rounded-lg cursor-pointer";
          }}
          dayStyle={(date) => {
            const isSelected =
              date.getDate() === pickupDate.getDate() &&
              date.getMonth() === pickupDate.getMonth() &&
              date.getFullYear() === pickupDate.getFullYear();
            
            return isSelected
              ? { background: "linear-gradient(90deg, #040405, #335C6E)", color: "white" }
              : {};
          }}
          monthClassName="text-white border-none" // Transparent background for month header
          todayButton="Today"
          className="p-4 text-xs w-full"
          style={{ width: '100%', maxWidth: '320px' }} // Restrict width and center calendar
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
                        cursor: 'default'
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
            )}
            </div>

          {/* Payment Section */}
          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-[rgba(75,136,163,0.3)] via-[rgba(4,4,5,0.5)] to-[rgba(75,136,163,0.3)] border border-transparent cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MdPayments className="text-lg align-middle" />
                <div className="text-lg font-semibold align-middle">Payment</div>
              </div>
              <div className="text-sm font-medium cursor-pointer" onClick={() => handleEditClick('payment')}>Edit</div>
            </div>
            {expandedSection !== 'payment' && selectedPaymentMethod && (
  <div className="mt-4 text-sm">
    <p>Payment Method: {selectedPaymentMethod === 'gcash' ? 'Via GCash' : 'Via Physical Store'}</p>
  </div>
)}

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
                      cursor: 'default'
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
                      cursor: 'default'
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
            className="text-sm mt-4 w-36 h-10 p-2 rounded-full text-white bg-gradient-to-r from-[#4B88A3] via-[#040405] to-[#4B88A3] hover:shadow-[0_0_15px_5px_rgba(0,255,255,0.3)] transition-shadow"
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
            <button
              className="text-xs p-4 rounded-md bg-gradient-to-r from-[#4B88A3] via-[#040405] to-[#4B88A3] hover:shadow-[0_0_15px_5px_rgba(0,255,255,0.3)] transition-shadow"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CheckoutLanding;
