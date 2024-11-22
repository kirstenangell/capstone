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

  // State for filters
  const [activeStatus, setActiveStatus] = useState('All'); // Default is 'All'
  const [isSupplierTypeOpen, setIsSupplierTypeOpen] = useState(false);
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [selectedSupplierType, setSelectedSupplierType] = useState('');

  // Get unique supplier types from suppliers
  const supplierTypes = [...new Set(suppliers.map(supplier => supplier.type).filter(Boolean))];

  // Array of all provinces in the Philippines
  const provinces = [
    'Abra',
    'Agusan del Norte',
    'Agusan del Sur',
    'Aklan',
    'Albay',
    'Antique',
    'Apayao',
    'Aurora',
    'Basilan',
    'Bataan',
    'Batanes',
    'Batangas',
    'Benguet',
    'Biliran',
    'Bohol',
    'Bukidnon',
    'Bulacan',
    'Cagayan',
    'Camarines Norte',
    'Camarines Sur',
    'Camiguin',
    'Capiz',
    'Catanduanes',
    'Cavite',
    'Cebu',
    'Compostela Valley',
    'Cotabato',
    'Davao del Norte',
    'Davao del Sur',
    'Davao Occidental',
    'Davao Oriental',
    'Dinagat Islands',
    'Eastern Samar',
    'Guimaras',
    'Ifugao',
    'Ilocos Norte',
    'Ilocos Sur',
    'Iloilo',
    'Isabela',
    'Kalinga',
    'La Union',
    'Laguna',
    'Lanao del Norte',
    'Lanao del Sur',
    'Leyte',
    'Maguindanao',
    'Marinduque',
    'Masbate',
    'Misamis Occidental',
    'Misamis Oriental',
    'Mountain Province',
    'Negros Occidental',
    'Negros Oriental',
    'Northern Samar',
    'Nueva Ecija',
    'Nueva Vizcaya',
    'Occidental Mindoro',
    'Oriental Mindoro',
    'Palawan',
    'Pampanga',
    'Pangasinan',
    'Quezon',
    'Quirino',
    'Rizal',
    'Romblon',
    'Samar',
    'Sarangani',
    'Siquijor',
    'Sorsogon',
    'South Cotabato',
    'Southern Leyte',
    'Sultan Kudarat',
    'Sulu',
    'Surigao del Norte',
    'Surigao del Sur',
    'Tarlac',
    'Tawi-Tawi',
    'Zambales',
    'Zamboanga del Norte',
    'Zamboanga del Sur',
    'Zamboanga Sibugay',
  ];

  // Get unique cities based on selected province
  let cities = [];

  if (selectedProvince) {
    // If you have a mapping of provinces to cities, you can use it here.
    // For now, we will get the cities from the suppliers data where the province matches the selected province.
    cities = [...new Set(
      suppliers
        .filter(supplier => supplier.currentAddress?.province === selectedProvince)
        .map(supplier => supplier.currentAddress?.city)
        .filter(Boolean)
    )];
  } else {
    // If no province is selected, get all cities from suppliers data
    cities = [...new Set(suppliers.map(supplier => supplier.currentAddress?.city).filter(Boolean))];
  }

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

  // Function to handle status button click
  const handleStatusClick = (status) => {
    setActiveStatus(status); // Set the active status
  };

  // Toggle functions for dropdowns
  const toggleSupplierTypeDropdown = () => {
    setIsSupplierTypeOpen(!isSupplierTypeOpen);
  };

  const toggleProvinceDropdown = () => {
    setIsProvinceOpen(!isProvinceOpen);
  };

  const toggleCityDropdown = () => {
    setIsCityOpen(!isCityOpen);
  };

  // Filter suppliers based on search query, status, supplier type, location, and contact information
  const filteredSuppliers = suppliers.filter((supplier) => {
    const supplierName = supplier.name?.toLowerCase() || '';
    const supplierOid = `OID-${supplier.id}`.toLowerCase();

    // Apply search query
    const matchesSearchQuery =
      supplierName.includes(searchQuery.toLowerCase()) ||
      supplierOid.includes(searchQuery.toLowerCase());

    // Apply status filter
    const matchesStatus =
      activeStatus === 'All' ||
      supplier.status === activeStatus;

    // Apply supplier type filter
    const matchesSupplierType =
      !selectedSupplierType || supplier.type === selectedSupplierType;

    // Apply LOCATION filter
    const supplierProvince = supplier.currentAddress?.province || '';
    const supplierCity = supplier.currentAddress?.city || '';

    const matchesLocation =
      (!selectedProvince || supplierProvince === selectedProvince) &&
      (!selectedCity || supplierCity === selectedCity);

    // Apply contact search query
    const matchesContactQuery =
      !contactSearchQuery ||
      (supplier.email?.toLowerCase().includes(contactSearchQuery.toLowerCase())) ||
      (supplier.phone?.toLowerCase().includes(contactSearchQuery.toLowerCase()));

    // Return true if supplier matches all filters
    return matchesSearchQuery && matchesStatus && matchesSupplierType && matchesLocation && matchesContactQuery;
  });

  const [selectedAddressType, setSelectedAddressType] = useState('');
  const [isAddressTypeOpen, setIsAddressTypeOpen] = useState(false);

  // Toggle function for Address Type dropdown
  const toggleAddressTypeDropdown = () => {
    setIsAddressTypeOpen(!isAddressTypeOpen);
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
            {/* FILTER BY */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-white mb-2">FILTER BY</h2>

              {/* Supplier Type Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleSupplierTypeDropdown}
                  className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
                >
                  {selectedSupplierType || 'SUPPLIER TYPE'}
                </button>

                {/* Dropdown Menu */}
                {isSupplierTypeOpen && (
                  <div className="absolute mt-2 w-full bg-[#040405] rounded-lg shadow-lg z-10">
                    <ul className="text-sm text-white">
                      <li
                        className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                        onClick={() => {
                          setSelectedSupplierType('');
                          setIsSupplierTypeOpen(false);
                        }}
                      >
                        All Types
                      </li>
                      {supplierTypes.map((type) => (
                        <li
                          key={type}
                          className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                          onClick={() => {
                            setSelectedSupplierType(type);
                            setIsSupplierTypeOpen(false);
                          }}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="relative mt-4">
              <button
                onClick={toggleAddressTypeDropdown}
                className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
              >
                {selectedAddressType || 'ADDRESS TYPE'}
              </button>

              {/* Dropdown Menu */}
              {isAddressTypeOpen && (
                <div className="absolute mt-2 w-full bg-[#040405] rounded-lg shadow-lg z-10">
                  <ul className="text-sm text-white">
                    <li
                      className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                      onClick={() => {
                        setSelectedAddressType('');
                        setIsAddressTypeOpen(false);
                      }}
                    >
                      All Types
                    </li>
                    {['Headquarters', 'Billing', 'Shipping'].map((type) => (
                      <li
                        key={type}
                        className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                        onClick={() => {
                          setSelectedAddressType(type);
                          setIsAddressTypeOpen(false);
                        }}
                      >
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              </div>
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

            {/* LOCATION Filter */}
            <div className="mb-6 mt-2">
              <h2 className="text-sm font-bold text-white mb-2">LOCATION</h2>

              {/* Province Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProvinceDropdown}
                  className="mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left"
                >
                  {selectedProvince || 'PROVINCE'}
                </button>

                {/* Dropdown Menu */}
                {isProvinceOpen && (
                  <div className="absolute mt-2 w-full bg-[#040405] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    <ul className="text-sm text-white">
                      <li
                        className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                        onClick={() => {
                          setSelectedProvince('');
                          setSelectedCity('');
                          setIsProvinceOpen(false);
                        }}
                      >
                        All Provinces
                      </li>
                      {provinces.map((province) => (
                        <li
                          key={province}
                          className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                          onClick={() => {
                            setSelectedProvince(province);
                            setSelectedCity('');
                            setIsProvinceOpen(false);
                          }}
                        >
                          {province}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>


              {/* City Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleCityDropdown}
                  className={`mt-2 text-sm w-full p-2 bg-gradient-to-r from-[#040405] to-[#122127] rounded-lg text-left ${
                    !selectedProvince ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!selectedProvince}
                >
                  {selectedCity || 'CITY'}
                </button>

                {/* Dropdown Menu */}
                {isCityOpen && selectedProvince && (
                  <div className="absolute mt-2 w-full bg-[#040405] rounded-lg shadow-lg z-10">
                    <ul className="text-sm text-white">
                      <li
                        className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                        onClick={() => {
                          setSelectedCity('');
                          setIsCityOpen(false);
                        }}
                      >
                        All Cities
                      </li>
                      {cities.map((city) => (
                        <li
                          key={city}
                          className="p-2 hover:bg-gradient-to-r from-[#040405] to-[#122127] cursor-pointer"
                          onClick={() => {
                            setSelectedCity(city);
                            setIsCityOpen(false);
                          }}
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* CONTACT INFORMATION Filter */}
            <div className="mb-6 mt-2">
              <h2 className="text-sm font-bold text-white mb-2">CONTACT INFORMATION</h2>
              <div className="flex items-center border-b border-gray-600">
                <CiSearch className="text-gray-600 text-xl mr-2" /> {/* Icon before the input */}
                <input
                  type="text"
                  placeholder="Search by email or phone"
                  className="bg-transparent text-gray-600 text-sm px-4 py-2 focus:outline-none w-full"
                  value={contactSearchQuery}
                  onChange={(e) => setContactSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Supplier List with Scrolling */}
          <div className="col-span-3">
            <div className="space-y-6 overflow-y-auto h-[500px]">
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
                        {supplier.supplyID} | {supplier.phone} | {supplier.email} | {supplier.status}
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
                  <h3 className="text-white text-md font-semibold mb-2">Supplier Details</h3>
                  <div className="flex">
                    <span className="text-xs text-gray-400 w-40">CONTACT NAME:</span>
                    <span className="text-xs">{selectedSupplier.contactName || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-xs text-gray-400 w-40">SUPPLIER TYPE:</span>
                    <span className="text-xs">{selectedSupplier.type || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-xs text-gray-400 w-40">STATUS:</span>
                    <span className="text-xs">{selectedSupplier.status || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-xs text-gray-400 w-40">ADDITIONAL NOTES:</span>
                    <span className="text-xs">{selectedSupplier.additionalNotes || 'N/A'}</span>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h3 className="text-white text-md font-semibold mb-2">Contact Information</h3>
                  <div className="flex">
                    <span className="text-xs text-gray-400 w-40">EMAIL:</span>
                    <span className="text-xs">{selectedSupplier.email || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-xs text-gray-400 w-40">PHONE:</span>
                    <span className="text-xs">{selectedSupplier.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}


             {activeTab === 'supply' && (
                <div className="grid grid-cols-1 gap-4">
                  {/* Current Address Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">Current Address</h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">ADDRESS TYPE:</span>
                      <span className="text-xs">{selectedSupplier.currentAddress?.addressType || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">STREET:</span>
                      <span className="text-xs">{selectedSupplier.currentAddress?.street || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">CITY:</span>
                      <span className="text-xs">{selectedSupplier.currentAddress?.city || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">PROVINCE:</span>
                      <span className="text-xs">{selectedSupplier.currentAddress?.province || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">ZIP CODE:</span>
                      <span className="text-xs">{selectedSupplier.currentAddress?.zipCode || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">LANDMARK:</span>
                      <span className="text-xs">{selectedSupplier.currentAddress?.landmark || 'N/A'}</span>
                    </div>
                  </div>

                  {/* New Address Section */}
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">New Address</h3>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">ADDRESS TYPE:</span>
                      <span className="text-xs">{selectedSupplier.newAddress?.addressType || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">STREET:</span>
                      <span className="text-xs">{selectedSupplier.newAddress?.street || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">CITY:</span>
                      <span className="text-xs">{selectedSupplier.newAddress?.city || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">PROVINCE:</span>
                      <span className="text-xs">{selectedSupplier.newAddress?.province || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">ZIP CODE:</span>
                      <span className="text-xs">{selectedSupplier.newAddress?.zipCode || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-xs text-gray-400 w-40">LANDMARK:</span>
                      <span className="text-xs">{selectedSupplier.newAddress?.landmark || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'supplies' && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-white text-md font-semibold mb-2">Product Lists</h3>
                    {selectedSupplier.productLists && selectedSupplier.productLists.length > 0 ? (
                      selectedSupplier.productLists.map((product, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="text-white text-md font-semibold mb-2">{`Product #${index + 1}`}</h3>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">PRODUCT ID:</span>
                            <span className="text-xs">{product.productId || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">PRODUCT NAME:</span>
                            <span className="text-xs">{product.productName || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">CATEGORY:</span>
                            <span className="text-xs">{product.category || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">DESCRIPTION:</span>
                            <span className="text-xs">{product.productDescription || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">QUANTITY AVAILABLE:</span>
                            <span className="text-xs">{product.quantityAvailable || 'N/A'}</span>
                          </div>
                          <div className="flex">
                            <span className="text-xs text-gray-400 w-40">UNIT PRICE:</span>
                            <span className="text-xs">{product.unitPrice || 'N/A'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No products available.</p>
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
