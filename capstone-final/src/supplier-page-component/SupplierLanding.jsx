import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci'; // Search icon
import { BsBoxArrowRight } from 'react-icons/bs'; // Close Icon
import { IoIosInformationCircle } from 'react-icons/io';
import { GiStorkDelivery } from 'react-icons/gi';
import { FaOpencart } from 'react-icons/fa';
import { SupplierContext } from '../context/SupplierContext'; // Import SupplierContext
 
const SupplierLanding = () => {
  const { suppliers, archiveSupplier } = useContext(SupplierContext);
  const navigate = useNavigate();
 
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
 
  // State to track search input
  const [searchQuery, setSearchQuery] = useState('');
 
  // Handle supplier click to show modal
  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
    setActiveTab('general');
    setShowModal(true);
  };
 
  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
  };
 
  // Redirect to Add Supplier page when the "Add Supplier" button is clicked
  const handleAddSupplierClick = () => {
    navigate('/supplier/supplier-information');
  };
 
  // Archive supplier
  const handleArchiveSupplier = (supplierToArchive) => {
    const confirmArchive = window.confirm(`Are you sure you want to archive Supplier #${supplierToArchive.oid}?`);
    if (confirmArchive) {
      archiveSupplier(supplierToArchive.id);
      alert(`Supplier #${supplierToArchive.oid} has been archived.`);
      setShowModal(false);
    }
  };
 
  // Handle Edit button click
  const handleEditSupplier = () => {
    navigate('/supplier/supplier-information', { state: { supplier: selectedSupplier, isEdit: true } });
    setShowModal(false);
  };
 
  // Filter suppliers based on search query (name or OID)
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `OID-${supplier.id}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const [activeStatus, setActiveStatus] = useState('All'); // Default is 'All'
 
  // Function to handle status button click
  const handleStatusClick = (status) => {
    setActiveStatus(status); // Set the active status
  };
 
  const [isOpen, setIsOpen] = useState(false);
 
  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
 
  return (
    <div className="min-h-screen bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">SUPPLIERS</h1>
          <div className="flex items-center">
            <div className="flex items-center border-b border-gray-600">
              <CiSearch className="text-gray-600 text-xl mr-2" /> {/* Icon before the input */}
              <input
                type="text"
                placeholder="Search supplier"
                className="bg-transparent text-gray-600 px-4 py-2 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Track input changes
              />
            </div>
            <button
              onClick={handleAddSupplierClick}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-[#040405] to-[#122127] text-white rounded-lg text-sm"
            >
              Add Supplier
            </button>
          </div>
        </div>
 
        {/* Filters and Sidebar */}
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1">
            {/* Example Filters */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-white mb-2">FILTER BY</h2>
              
              {/* Dropdown Button */}
              <button
                onClick={toggleDropdown}
                className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
              >
                SUPPLIER TYPE
              </button>
 
              {/* Dropdown Menu */}
              {isOpen && (
                <div className="mt-2 w-full bg-[#040405] rounded-lg shadow-lg">
                  <ul className="text-sm text-white">
                    <li className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer">Wholesale</li>
                    <li className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer">Retail</li>
                    <li className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer">Distributor</li>
                  </ul>
                </div>
              )}
            </div>
 
            {/* Status Filters */}
            <div className="mb-6 mt-2">
              <h2 className="text-sm font-bold text-white mb-2">STATUS</h2>
              <div className="flex space-x-2">
                {/* 'All' Button */}
                <button
                  onClick={() => handleStatusClick('All')}
                  className={`text-sm px-6 py-2 rounded-lg ${
                    activeStatus === 'All'
                      ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white'
                      : 'bg-gradient-to-r from-[#000000] to-[#000000] text-white hover:from-[#040405] hover:to-[#122127]'
                  }`}
                >
                  All
                </button>
 
                {/* 'Active' Button */}
                <button
                  onClick={() => handleStatusClick('Active')}
                  className={`text-sm px-6 py-2 rounded-lg ${
                    activeStatus === 'Active'
                      ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white'
                      : 'bg-gradient-to-r from-[#000000] to-[#000000] text-white hover:from-[#040405] hover:to-[#122127]'
                  }`}
                >
                  Active
                </button>
 
                {/* 'Inactive' Button */}
                <button
                  onClick={() => handleStatusClick('Inactive')}
                  className={`text-sm px-6 py-2 rounded-lg ${
                    activeStatus === 'Inactive'
                      ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white'
                      : 'bg-gradient-to-r from-[#000000] to-[#000000] text-white hover:from-[#040405] hover:to-[#122127]'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>
 
          {/* Supplier List */}
          <div className="col-span-3">
            <div className="space-y-6">
              {/* If no suppliers are found, display the message */}
              {filteredSuppliers.length === 0 ? (
                <div className="text-center text-gray-400">
                  No suppliers found
                </div>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className="bg-gradient-to-r from-[#040405] to-[#335C6E] p-6 rounded-lg shadow-md flex items-center cursor-pointer"
                    onClick={() => handleSupplierClick(supplier)}
                  >
                    <div className="w-16 h-16 flex items-center justify-center text-white text-lg font-bold">
                      {`OID-${supplier.id}`}
                    </div>
                    <div className="ml-6">
                      <h2 className="text-xl font-semibold">{supplier.name}</h2>
                      <p className="text-gray-400 text-sm mt-2">
                        {supplier.supplyID} | {supplier.phone} | {supplier.email} |{' '}
                        {supplier.status}
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
      {showModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#040405] p-6 rounded-lg shadow-lg max-w-3xl w-full h-auto flex flex-col">
            {/* Supplier Info Section */}
            <div className="flex justify-between items-start mb-4">
              {/* Left Section: Icon above the entire supplier information */}
              <div className="flex flex-col items-start">
                <button
                  onClick={handleCloseModal}
                  className="bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg p-2 mb-2 shadow-md"
                >
                  <BsBoxArrowRight className="text-white text-md" />
                </button>
 
                {/* Supplier Information */}
                <div className="flex items-center">
                  <div className="w-24 h-24 flex justify-center items-center text-white text-lg font-bold">
                    {`OID-${selectedSupplier.id}`}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold">{selectedSupplier.name}</h2>
                    <p className="text-gray-400">Manually Added</p>
                  </div>
                </div>
              </div>
 
              {/* Right Section: Edit and Archive buttons */}
              <div className="space-x-4">
                <button
                  onClick={handleEditSupplier}
                  className="text-sm text-white hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleArchiveSupplier(selectedSupplier)}
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
 
              {/* Supply Details Button */}
              <button
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-300 ${
                  activeTab === 'supply'
                    ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white text-sm'
                    : 'bg-gradient-to-r from-[#000000] to-[#000000] text-gray-400 text-sm hover:text-white'
                }`}
                onClick={() => setActiveTab('supply')}
              >
                <GiStorkDelivery className="mr-2 text-xl" />
                Supplier Address
              </button>
 
              {/* Supply Lists Button */}
              <button
                className={`flex items-center px-4 py-2 rounded-md transition-colors duration-300 ${
                  activeTab === 'supplies'
                    ? 'bg-gradient-to-r from-[#040405] to-[#122127] text-white text-sm'
                    : 'bg-gradient-to-r from-[#000000] to-[#000000] text-gray-400 text-sm hover:text-white'
                }`}
                onClick={() => setActiveTab('supplies')}
              >
                <FaOpencart className="mr-2 text-xl" />
                Product Lists
              </button>
            </div>
 
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 gap-4">
                  {/* Supplier Details Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">
                      Supplier Details
                    </h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        SUPPLIER NAME:
                      </span>
                      <span className="text-xs">{selectedSupplier.name}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        SUPPLIER TYPE:
                      </span>
                      <span className="text-xs">{selectedSupplier.type}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        PAYMENT STATUS:
                      </span>
                      <span className="text-xs">
                        {selectedSupplier.paymentStatus || 'N/A'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        PAYMENT REFERENCE:
                      </span>
                      <span className="text-xs">
                        {selectedSupplier.paymentReference || 'N/A'}
                      </span>
                    </div>
                  </div>
 
                  {/* Contact Information Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">
                      Contact Information
                    </h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">EMAIL:</span>
                      <span className="text-xs">{selectedSupplier.email}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">PHONE:</span>
                      <span className="text-xs">{selectedSupplier.phone}</span>
                    </div>
                  </div>
                </div>
              )}
 
              {activeTab === 'supply' && (
                <div className="grid grid-cols-1 gap-4">
                  {/* Supply Details Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">
                      Supply Details
                    </h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        SUPPLY DETAILS:
                      </span>
                      <span className="text-xs">{selectedSupplier.supplyDetails}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">
                        SUPPLY PRICE:
                      </span>
                      <span className="text-xs">{selectedSupplier.supplyPrice}</span>
                    </div>
                  </div>
                </div>
              )}
 
              {activeTab === 'supplies' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Supplies</h3>
                    {selectedSupplier.supplies.length > 0 ? (
                      selectedSupplier.supplies.map((supply) => (
                        <div key={supply.id} className="mb-4">
                          <p>
                            <strong>Supply ID:</strong> {supply.id}
                          </p>
                          <p>
                            <strong>Item:</strong> {supply.item}
                          </p>
                          <p>
                            <strong>Price:</strong> {supply.price}
                          </p>
                          <p>
                            <strong>Status:</strong> {supply.status}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No supplies available.</p>
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
 
export default SupplierLanding;
