import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUser, FaTruck } from 'react-icons/fa';
import { IoMdPin } from 'react-icons/io';
import { MdPayments } from 'react-icons/md';
import { IoArrowForwardCircle } from 'react-icons/io5'; 

const CheckoutLanding = () => {
  const location = useLocation();
  const { cartItems = [], total = 0 } = location.state || {};

  const [expandedSection, setExpandedSection] = useState(null);
  const [addAddressExpanded, setAddAddressExpanded] = useState(false); 
  const [userInfo, setUserInfo] = useState({
    email: 'loremipsumdolor@gmail.com',
    phone: '912 456 7891',
    countryCode: '+63',
    firstName: 'Lorem',
    lastName: 'Ipsum',
  });

  const [addressInfo, setAddressInfo] = useState({
    houseNumber: '',
    streetName: '',
    barangay: '',
    city: '',
  });

  const [addresses, setAddresses] = useState([
    {
      houseNumber: '123',
      streetName: 'Main Street',
      barangay: 'Barangay 1',
      city: 'Cityname',
    },
  ]); // List to hold all addresses, starting with the default address

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

  return (
    <div className="min-h-screen flex bg-black text-white py-10">
      <div className="flex w-full max-w-6xl mx-auto">
        {/* Left Column */}
        <div className="flex-1 space-y-4 mr-4 max-w-lg">
          {/* Information Section */}
          <div className="p-6 rounded-lg shadow-lg bg-black border border-transparent cursor-pointer">
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
            className="p-6 rounded-lg shadow-lg bg-black border border-transparent cursor-pointer"
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
                  {address.houseNumber}, {address.streetName}, {address.barangay}, {address.city}
                </div>
                ))}
              </div>
            )}
            {expandedSection === 'address' && (
              
              <div className="mt-4">
                <div className="mt-4">
                {addresses.map((address, index) => (
                  <div key={index} className="text-sm mt-2">
                  {address.houseNumber}, {address.streetName}, {address.barangay}, {address.city}
                </div>
                ))}
              </div>
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="w-full p-4 bg-transparent border border-gray-700 rounded-md text-xs mt-2"
                    style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                  >
                    {address.houseNumber}, {address.streetName}, {address.barangay}, {address.city}
                  </div>
                ))}
                <div
                  className="w-full p-4 bg-transparent border border-gray-700 rounded-md text-center text-sm mt-4 cursor-pointer"
                  style={{ background: 'linear-gradient(90deg, #040405, #335C6E)', borderWidth: '0.5px', borderColor: 'white' }}
                  onClick={handleAddAddressClick}
                >
                  + Add Address
                </div>
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

          {/* Delivery, Payment Sections */}
          {['delivery', 'payment'].map((section) => (
            <div
              key={section}
              className="p-6 rounded-lg shadow-lg bg-black border border-transparent cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  {section === 'delivery' && <FaTruck className="text-lg align-middle" />}
                  {section === 'payment' && <MdPayments className="text-lg align-middle" />}
                  <div className="text-lg font-semibold align-middle">{section.charAt(0).toUpperCase() + section.slice(1)}</div>
                </div>
                <div className="text-sm font-medium cursor-pointer" onClick={() => handleEditClick(section)}>Edit</div>
              </div>
              {expandedSection === section && (
                <div className="mt-4">
                  <p>{section.charAt(0).toUpperCase() + section.slice(1)} Content</p>
                </div>
              )}
            </div>
          ))}
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
