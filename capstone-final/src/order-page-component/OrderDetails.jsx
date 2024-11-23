import React, { useState, useContext } from 'react';
import { IoIosInformationCircle, IoMdMail } from 'react-icons/io';
import { GiStorkDelivery, GiCardboardBoxClosed } from 'react-icons/gi';
import { FaProductHunt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';

const OrderDetails = () => {
  const { addOrder, updateOrder } = useContext(OrderContext); // Access order functions from context
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve order data and edit flag from navigation state
  const { order: existingOrder, isEdit } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    id: existingOrder?.id || null,
    firstName: existingOrder?.firstName || '',
    lastName: existingOrder?.lastName || '',
    email: existingOrder?.email || '',
    contactNumber: existingOrder?.contactNumber || '',
    streetName: existingOrder?.streetName || '',
    barangay: existingOrder?.barangay || '',
    city: existingOrder?.city || '',
    region: existingOrder?.region || '',
    zipCode: existingOrder?.zipCode || '',
    deliveryOption: existingOrder?.deliveryOption || '',
    courier: existingOrder?.courier || '',
    paymentOption: existingOrder?.paymentOption || '',
    pickUpTime: existingOrder?.pickUpTime || '',
    pickUpDate: existingOrder?.pickUpDate || '',
    products: existingOrder?.products ? [...existingOrder.products] : [''],
  });

  // Add a new product field
  const handleAddProduct = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      products: [...prevFormData.products, ''],
    }));
  };

  // Handle product changes
  const handleProductChange = (index, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = value;
    setFormData({ ...formData, products: updatedProducts });
  };

  // Remove a product field
  const handleRemoveProduct = (index) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  // Handle changes in the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Go to the next step
  const handleNextClick = (e) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0); // Scroll to top when moving to the next step
    }
  };

  // Go to the previous step
  const handleBackClick = (e) => {
    e.preventDefault();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0); // Scroll to top when moving to the previous step
    }
  };

  // Cancel and return to the orders page
  const handleCancelClick = () => {
    navigate('/order');
  };

  // Save the order
  const handleSaveClick = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const orderData = {
      id: formData.id || null, // Include ID for updates
      firstName: formData.firstName || 'N/A',
      lastName: formData.lastName || 'N/A',
      email: formData.email || 'N/A',
      contactNumber: formData.contactNumber || 'N/A',
      streetName: formData.streetName || 'N/A',
      barangay: formData.barangay || 'N/A',
      city: formData.city || 'N/A',
      region: formData.region || 'N/A',
      zipCode: formData.zipCode || 'N/A',
      deliveryOption: formData.deliveryOption || 'N/A',
      courier: formData.courier || '',
      paymentOption: formData.paymentOption || '',
      pickUpTime: formData.pickUpTime || '',
      pickUpDate: formData.pickUpDate || '',
      products: formData.products.filter(Boolean), // Remove empty products
      price: 1000 * formData.products.filter(Boolean).length, // Example price calculation
      status: 'PENDING', // Default status
      date: new Date().toISOString().split('T')[0], // Current date
    };

    try {
      let response;
      if (isEdit && formData.id) {
        // Update existing order
        response = await fetch(`http://localhost:5000/update-order/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
      } else {
        // Add new order
        response = await fetch('http://localhost:5000/add-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Failed to save order.');
      }

      const result = await response.json();

      if (isEdit) {
        updateOrder({ ...orderData, id: formData.id });
        alert('Order updated successfully.');
      } else {
        addOrder({ ...orderData, id: result.id });
        alert('Order added successfully.');
      }

      navigate('/order'); // Redirect after saving
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      {/* Header */}
      <div className="text-white text-center mb-10 mt-16">
        <h1 className="text-xl font-bold">{isEdit ? 'EDIT ORDER' : 'ADD NEW ORDER'}</h1>
        <h2 className="text-sm font-bold mt-2">{isEdit ? `Edit Order #${existingOrder?.id}` : 'Create a New Order'}</h2>
      </div>

      {/* Steps Sidebar */}
      <div className="absolute left-10 top-1/4">
        {[
          { step: 1, label: 'General Information', icon: IoIosInformationCircle },
          { step: 2, label: 'Address Details', icon: GiStorkDelivery },
          { step: 3, label: 'Delivery Details', icon: GiCardboardBoxClosed },
          { step: 4, label: 'Product', icon: FaProductHunt },
          { step: 5, label: 'Send Email', icon: IoMdMail },
        ].map(({ step, label, icon: Icon }) => (
          <div
            key={step}
            className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${currentStep === step ? 'bg-gray-800' : ''}`}
          >
            <Icon className={`text-2xl ${currentStep === step ? 'text-white' : 'text-gray-400'}`} />
            <div>
              <h3 className={`text-sm ${currentStep === step ? 'text-white' : 'text-gray-400'}`}>STEP {step}</h3>
              <h2 className={`text-sm ${currentStep === step ? 'text-white' : 'text-gray-400'}`}>{label}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="w-full max-w-2xl p-10 bg-gradient-to-b from-gray-800 to-black text-white rounded-lg shadow-lg h-full min-h-[600px] flex flex-col justify-between">
        <div className="flex-1 overflow-auto">
          <form onSubmit={handleSaveClick}>
            {currentStep === 1 && (
              <div>
                
                {/* First Name Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Last Name Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Email Address Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="user@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Contact Number Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="+63 9876 543 210"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Address Details */}
            {currentStep === 2 && (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Street Name</label>
                  <input
                    type="text"
                    name="streetName"
                    placeholder="Street name"
                    value={formData.streetName}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Barangay</label>
                  <input
                    type="text"
                    name="barangay"
                    placeholder="Barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <input
                    type="text"
                    name="region"
                    placeholder="Region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Zip Code"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Delivery Details */}
            {currentStep === 3 && (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Delivery Option</label>
                  <select
                    name="deliveryOption"
                    value={formData.deliveryOption}
                    onChange={handleChange}
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select option</option>
                    <option value="Via Courier">Via Courier</option>
                    <option value="Pick Up">Pick Up</option>
                  </select>
                </div>

                {formData.deliveryOption === 'Via Courier' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Courier</label>
                    <select
                      name="courier"
                      value={formData.courier}
                      onChange={handleChange}
                      className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select courier</option>
                      <option value="Grab Express">Grab Express</option>
                      <option value="Lalamove">Lalamove</option>
                      <option value="Angkas Padala">Angkas Padala</option>
                      <option value="Move It">Move It</option>
                    </select>
                  </div>
                )}

                {formData.deliveryOption === 'Pick Up' && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Pick-Up Date</label>
                      <input
                        type="date"
                        name="pickUpDate"
                        value={formData.pickUpDate}
                        onChange={handleChange}
                        className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Select a Pickup Time</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['09:00 AM', '10:00 AM', '02:00 PM', '04:30 PM'].map((time) => (
                          <button
                            key={time}
                            type="button"
                            className={`p-3 rounded-lg text-white bg-black border border-gray-600 ${formData.pickUpTime === time ? 'bg-gray-700' : ''}`}
                            onClick={() => setFormData({ ...formData, pickUpTime: time })}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {(formData.deliveryOption === 'Via Courier' || formData.deliveryOption === 'Pick Up') && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Payment Option</label>
                    <select
                      name="paymentOption"
                      value={formData.paymentOption}
                      onChange={handleChange}
                      className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select payment method</option>
                      <option value="GCash">GCash</option>
                      <option value="COD">COD</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Products */}
            {currentStep === 4 && (
              <div>
                {formData.products.map((product, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Product Name {index + 1}</label>
                      {formData.products.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 text-sm hover:text-red-700"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      name={`product${index + 1}`}
                      placeholder="Enter Product Name"
                      value={product}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="w-full py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
                  onClick={handleAddProduct}
                >
                  Add Product
                </button>

                <div className="mt-6">
                  <h3 className="text-lg font-medium">Summary</h3>
                  <div className="flex justify-between mt-4">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-sm">PHP 30,000</span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="text-sm">Delivery</span>
                    <span className="text-sm">FREE</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Order Summary */}
            {currentStep === 5 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-lg font-bold text-white">ORDER SUMMARY</h2>
                </div>

                <div className="bg-gradient-to-b from-gray-800 to-black p-6 rounded-lg text-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-gray-400">Name</h3>
                      <p className="text-white">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400">Email Address</h3>
                      <p className="text-white">{formData.email}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400">Contact No.</h3>
                      <p className="text-white">{formData.contactNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400">Address</h3>
                      <p className="text-white">
                        {formData.houseNumber} {formData.streetName}, {formData.barangay}, {formData.city}, {formData.region} {formData.zipCode}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-gray-400">Delivery Option</h3>
                      <p className="text-white">{formData.deliveryOption}</p>
                    </div>
                    {formData.deliveryOption === 'Pick Up' && (
                      <>
                        <div>
                          <h3 className="text-gray-400">Pick Up Date</h3>
                          <p className="text-white">{formData.pickUpDate}</p>
                        </div>
                        <div>
                          <h3 className="text-gray-400">Pick Up Time</h3>
                          <p className="text-white">{formData.pickUpTime}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <h3 className="text-gray-400">Payment Option</h3>
                      <p className="text-white">{formData.paymentOption}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {formData.products.map((product, index) => (
                      <div key={index} className="bg-black p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            checked={false}
                            readOnly
                          />
                          <p className="text-white">{product || `Product Name ${index + 1}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">PHP 30,000</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-400">Delivery</span>
                      <span className="text-white">FREE</span>
                    </div>
                    <div className="flex justify-between mt-4">
                      <span className="font-bold text-white">TOTAL</span>
                      <span className="font-bold text-white">PHP 30,000</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && currentStep < 5 && (
                <button
                  type="button"
                  className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={handleBackClick}
                >
                  BACK
                </button>
              )}
              {currentStep === 1 && (
                <button
                  type="button"
                  className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={handleCancelClick}
                >
                  CANCEL
                </button>
              )}
              {currentStep === 5 ? (
                <>
                  <button
                    type="button"
                    className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                    onClick={handleBackClick}
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
                  >
                    SAVE
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
                  onClick={handleNextClick}
                >
                  NEXT
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
