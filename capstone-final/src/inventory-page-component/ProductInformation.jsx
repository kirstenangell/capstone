// src/inventory-page-component/ProductInformation.jsx
import React, { useState, useContext, useEffect } from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaBoxes, FaRulerCombined } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import Wheel1 from '../assets/wheel1.png'; // Import placeholder image
import { ProductContext } from '../context/ProductContext'; // Import ProductContext

const ProductInformation = () => {
  const [step, setStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { addProduct, updateProduct } = useContext(ProductContext);

  // Check if we're editing an existing product
  const isEdit = location.state?.isEdit || false;
  const existingProduct = location.state?.product || {};

  // State to store form data
  const [formData, setFormData] = useState({
    id: existingProduct.id || null,
    productName: existingProduct.name || '',
    productType: existingProduct.type || '',
    productBrand: existingProduct.brand || '',
    productCategory: existingProduct.category || '',
    productDescription: existingProduct.description || '',
    // Sales Information
    retailSalePrice: existingProduct.price || '',
    discount: existingProduct.discount || '',
    totalPrice: existingProduct.totalPrice || '',
    // Quantity
    totalQuantity: existingProduct.totalQuantity || '',
    quantity: existingProduct.quantity || '',
    status: existingProduct.status || '',
    // Measurement
    dimensions: {
      length: existingProduct.dimensions?.split(' x ')[0] || '',
      width: existingProduct.dimensions?.split(' x ')[1] || '',
      height: existingProduct.dimensions?.split(' x ')[2] || '',
      weight: existingProduct.dimensions?.split(' x ')[3] || '',
    },
    color: existingProduct.color || '',
    finish: existingProduct.finish ? existingProduct.finish.split(', ') : [], // array of selected finishes
    material: existingProduct.material || '',
    model: existingProduct.model || '',
  });

  useEffect(() => {
    // If editing, set the uploadedImages to include the existing image
    if (isEdit && existingProduct.image) {
      // Assuming existingProduct.image is a URL
      setUploadedImages([existingProduct.image]);
    }
  }, [isEdit, existingProduct]);

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0); // Scroll to top when moving to the next step
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0); // Scroll to top when moving to the previous step
  };

  const handleCancelClick = () => {
    window.scrollTo(0, 0);
    navigate('/inventory');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && uploadedImages.length < 4) {
      setUploadedImages([...uploadedImages, file]);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
  };

  // Handle Save button click
  const handleSave = () => {
    // Collect all form data
    const productData = {
      ...existingProduct,
      id: existingProduct.id || Date.now(),
      name: formData.productName || 'Untitled Product',
      image: uploadedImages[0] ? (typeof uploadedImages[0] === 'string' ? uploadedImages[0] : URL.createObjectURL(uploadedImages[0])) : Wheel1,
      price: formData.retailSalePrice || 'PHP 0.00',
      type: formData.productType || 'N/A',
      brand: formData.productBrand || 'N/A',
      category: formData.productCategory || 'N/A',
      description: formData.productDescription || 'No description provided.',
      dimensions: `${formData.dimensions.length || '0'} x ${formData.dimensions.width || '0'} x ${formData.dimensions.height || '0'} x ${formData.dimensions.weight || '0'}`,
      color: formData.color || 'N/A',
      finish: formData.finish.length > 0 ? formData.finish.join(', ') : 'N/A',
      material: formData.material || 'N/A',
      model: formData.model || 'N/A',
      tax: formData.tax || 'N/A', // Placeholder
      discount: formData.discount || 'PHP 0.00',
      totalPrice: formData.totalPrice || 'PHP 0.00',
      // Add more fields as necessary
    };

    if (isEdit) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    // Navigate back to InventoryLanding
    navigate('/inventory');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center relative">
      {/* Header */}
      <div className="text-white text-center mb-10 mt-16">
        <h1 className="text-xl font-bold">{isEdit ? 'EDIT PRODUCT' : 'GENERAL INFORMATION'}</h1>
        <h2 className="text-sm font-bold mt-2">{isEdit ? `Edit Product #${existingProduct.id}` : 'Add New Product'}</h2>
      </div>

      {/* Steps Sidebar */}
      <div className="absolute left-10 top-1/4">
        <div className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${step === 1 ? 'bg-gray-800' : ''}`}>
          <IoIosInformationCircle className={`text-2xl ${step === 1 ? 'text-white' : 'text-gray-400'}`} />
          <div>
            <h3 className={`text-sm ${step === 1 ? 'text-white' : 'text-gray-400'}`}>STEP 1</h3>
            <h2 className={`text-sm ${step === 1 ? 'text-white' : 'text-gray-400'}`}>General Information</h2>
          </div>
        </div>
        <div className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${step === 2 ? 'bg-gray-800' : ''}`}>
          <GiStorkDelivery className={`text-2xl ${step === 2 ? 'text-white' : 'text-gray-400'}`} />
          <div>
            <h3 className={`text-sm ${step === 2 ? 'text-white' : 'text-gray-400'}`}>STEP 2</h3>
            <h2 className={`text-sm ${step === 2 ? 'text-white' : 'text-gray-400'}`}>Sales Information</h2>
          </div>
        </div>
        <div className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${step === 3 ? 'bg-gray-800' : ''}`}>
          <FaBoxes className={`text-2xl ${step === 3 ? 'text-white' : 'text-gray-400'}`} />
          <div>
            <h3 className={`text-sm ${step === 3 ? 'text-white' : 'text-gray-400'}`}>STEP 3</h3>
            <h2 className={`text-sm ${step === 3 ? 'text-white' : 'text-gray-400'}`}>Quantity</h2>
          </div>
        </div>
        <div className={`mb-4 flex items-center space-x-2 p-4 rounded-lg ${step === 4 ? 'bg-gray-800' : ''}`}>
          <FaRulerCombined className={`text-2xl ${step === 4 ? 'text-white' : 'text-gray-400'}`} />
          <div>
            <h3 className={`text-sm ${step === 4 ? 'text-white' : 'text-gray-400'}`}>STEP 4</h3>
            <h2 className={`text-sm ${step === 4 ? 'text-white' : 'text-gray-400'}`}>Measurement</h2>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-2xl p-10 bg-gradient-to-b from-gray-800 to-black text-white rounded-lg shadow-lg h-full min-h-[600px] flex flex-col justify-between">
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
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                />
              </div>

              <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
                <div className="flex-1 mb-6 md:mb-0">
                  <label className="block text-sm font-medium mb-1">Product Type</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Product Type"
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Product Brand</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Product Brand"
                    value={formData.productBrand}
                    onChange={(e) => setFormData({ ...formData, productBrand: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Product Category</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Product Category"
                  value={formData.productCategory}
                  onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Product Description</label>
                <textarea
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Product Description"
                  style={{ height: '242px' }}
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                ></textarea>
              </div>

              {/* Attachment Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Attachments (4)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Plus box to add images */}
                  {uploadedImages.length < 4 && (
                    <label className="w-full h-40 bg-gray-900 border border-gray-600 rounded-lg flex justify-center items-center cursor-pointer">
                      <span className="text-white text-4xl">+</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                  )}

                  {/* Uploaded images */}
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative w-full h-40 bg-gray-900 border border-gray-600 rounded-lg flex flex-col justify-center items-center">
                      {/* Image preview */}
                      <div className="w-full h-full rounded-lg overflow-hidden">
                        <img src={typeof image === 'string' ? image : URL.createObjectURL(image)} alt={`attachment-${index}`} className="object-cover w-full h-full" />
                      </div>

                      {/* Display file name */}
                      <div className="text-center text-white text-xs mt-2">
                        <p>{typeof image === 'string' ? 'Existing Image' : image.name}</p>
                      </div>

                      {/* Remove icon on hover */}
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-gradient-to-r from-[#040405] to-[#122127] p-1 rounded-full text-white opacity-20 hover:opacity-100 transition-opacity"
                      >
                        <IoMdClose size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel and Next Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={nextStep}
                  className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
                >
                  Next
                </button>
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
                  value={formData.retailSalePrice}
                  onChange={(e) => setFormData({ ...formData, retailSalePrice: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Discount</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="P 00.00"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Total Price</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="P 00.00"
                  value={formData.totalPrice}
                  onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
                >
                  Next
                </button>
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
                  value={formData.totalQuantity}
                  onChange={(e) => setFormData({ ...formData, totalQuantity: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Status</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              {/* Measurement Form */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Dimensions</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Length"
                    value={formData.dimensions.length}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensions: { ...formData.dimensions, length: e.target.value },
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Width"
                    value={formData.dimensions.width}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensions: { ...formData.dimensions, width: e.target.value },
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Height"
                    value={formData.dimensions.height}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensions: { ...formData.dimensions, height: e.target.value },
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Weight"
                    value={formData.dimensions.weight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dimensions: { ...formData.dimensions, weight: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Color (optional)</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Color (optional)"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Finish</label>
                <div className="p-3 bg-black border border-gray-600 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    {['Matte', 'Powder Coated', 'Glossy', 'Metallic', 'Satin', 'Textured'].map((finishOption) => (
                      <label key={finishOption} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600"
                          checked={formData.finish.includes(finishOption)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData((prevState) => {
                              let newFinish = [...prevState.finish];
                              if (isChecked) {
                                newFinish.push(finishOption);
                              } else {
                                newFinish = newFinish.filter((item) => item !== finishOption);
                              }
                              return { ...prevState, finish: newFinish };
                            });
                          }}
                        />
                        <span className="ml-2 text-white">{finishOption}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Material (optional)</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Material (optional)"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  className="w-full p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Make / Model / Year Compatibility"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={prevStep}
                  className="w-32 py-2 text-sm bg-transparent border border-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-32 py-2 text-sm bg-gradient-to-r from-gray-700 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-500"
                >
                  {isEdit ? 'UPDATE' : 'SAVE'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInformation;
