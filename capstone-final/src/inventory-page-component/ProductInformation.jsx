import React, { useState } from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaBoxes, FaRulerCombined } from 'react-icons/fa';
import { useParams } from 'react-router-dom'; // Import useParams to get the product id

const ProductInformation = () => {
  const [step, setStep] = useState(1);
  const { id } = useParams(); // Get the product ID from the URL
  console.log('Product ID:', id);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      {/* Header */}
      <div className="text-white text-center mb-10 mt-16">
        <h1 className="text-xl font-bold">GENERAL INFORMATION</h1>
        <h2 className="text-sm font-bold mt-2">Viewing details for Product ID: {id}</h2>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto">
        {/* Step Sidebar */}
        <div className="space-y-4 pr-4">
          <div className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${step === 1 ? 'bg-gray-800' : 'bg-gray-700'}`}>
            <IoIosInformationCircle className={`text-2xl ${step === 1 ? 'text-white' : 'text-gray-400'}`} />
            <div>
              <h3 className={`text-sm ${step === 1 ? 'text-white' : 'text-gray-400'}`}>STEP 1</h3>
              <h2 className={`text-sm ${step === 1 ? 'text-white' : 'text-gray-400'}`}>General Information</h2>
            </div>
          </div>
          <div className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${step === 2 ? 'bg-gray-800' : 'bg-gray-700'}`}>
            <GiStorkDelivery className={`text-2xl ${step === 2 ? 'text-white' : 'text-gray-400'}`} />
            <div>
              <h3 className={`text-sm ${step === 2 ? 'text-white' : 'text-gray-400'}`}>STEP 2</h3>
              <h2 className={`text-sm ${step === 2 ? 'text-white' : 'text-gray-400'}`}>Sales Information</h2>
            </div>
          </div>
          <div className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${step === 3 ? 'bg-gray-800' : 'bg-gray-700'}`}>
            <FaBoxes className={`text-2xl ${step === 3 ? 'text-white' : 'text-gray-400'}`} />
            <div>
              <h3 className={`text-sm ${step === 3 ? 'text-white' : 'text-gray-400'}`}>STEP 3</h3>
              <h2 className={`text-sm ${step === 3 ? 'text-white' : 'text-gray-400'}`}>Quantity</h2>
            </div>
          </div>
          <div className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${step === 4 ? 'bg-gray-800' : 'bg-gray-700'}`}>
            <FaRulerCombined className={`text-2xl ${step === 4 ? 'text-white' : 'text-gray-400'}`} />
            <div>
              <h3 className={`text-sm ${step === 4 ? 'text-white' : 'text-gray-400'}`}>STEP 4</h3>
              <h2 className={`text-sm ${step === 4 ? 'text-white' : 'text-gray-400'}`}>Measurement</h2>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full md:w-3/4 bg-gradient-to-b from-gray-800 to-black rounded-lg p-10 shadow-lg text-white ml-12">
          <div className="flex-1">
            {step === 1 && (
              <div>
                {/* General Information Form */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Product Name"
                  />
                </div>

                <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
                  <div className="flex-1 mb-6 md:mb-0">
                    <label className="block text-sm font-medium mb-1">Product Type</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Product Type"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Product Brand</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Product Brand"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Product Category</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Product Category"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Product Description</label>
                  <textarea
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Product Description"
                    style={{ height: '242px' }}
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-4">Attachments (4)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex flex-col items-center justify-center">
                        <div className="bg-black border border-gray-600 rounded-lg h-44 w-full mb-2 flex items-center justify-center">
                          <span>Image {index + 1}</span>
                        </div>
                        <span className="text-center">Lorem ipsum dolor sit amet</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                {/* Sales Information Form */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Retail Sale Price</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="P 0.00"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Tax</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="P 00.00"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Discount</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="P 00.00"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Total Price</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="P 00.00"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                {/* Quantity Form */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Total Quantity</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Total Quantity"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Quantity"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Status"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                {/* Measurement Form */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Measurement Details</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Measurement"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                onClick={nextStep}
                className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
              >
                Next
              </button>
            )}
            {step === 4 && (
              <button className="w-32 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-500">
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
