import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaLock, FaClipboardList } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios for making API requests

const ManageAcc = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate(); // useNavigate hook for redirection
    const [profilePic, setProfilePic] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        street: '',
        barangay: '',
        city: '',
        region: '',
        province: '',
        zipCode: '',
    });
      
    const [activeDropdown, setActiveDropdown] = useState(null); // Single state to manage dropdowns
    const fileInputRef = useRef(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [initialFormData, setInitialFormData] = useState({});

    // Fetch user data when the component loads
    useEffect(() => {
        const fetchUserData = async () => {
            const email = localStorage.getItem('email');
            if (email) {
                try {
                    const response = await axios.get(`http://localhost:5000/user-details?email=${email}`);
                    if (response.status === 200) {
                        const userData = response.data;
                        setFormData({
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            email: userData.email,
                            contactNumber: userData.contactNumber || '',
                            street: userData.street || '',
                            barangay: userData.barangay || '',
                            city: userData.city || '',
                            region: userData.region || '',
                            province: userData.province || '',
                            zipCode: userData.zipCode || '',
                        });
                        setInitialFormData(userData);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);
    


    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const response = await axios.put('http://localhost:5000/update-user-details', {
                email: formData.email,
                contactNumber: formData.contactNumber,
                street: formData.street,
                barangay: formData.barangay,
                city: formData.city,
                region: formData.region,
                province: formData.province,
                zipCode: formData.zipCode,
            });

            if (response.status === 200) {
                console.log('User details updated successfully');
                setInitialFormData(formData);
                setIsEditing(false);

                // Update localStorage with new data
                localStorage.setItem('contactNumber', formData.contactNumber);
                localStorage.setItem('street', formData.street);
                localStorage.setItem('barangay', formData.barangay);
                localStorage.setItem('city', formData.city);
                localStorage.setItem('region', formData.region);
                localStorage.setItem('province', formData.province);
                localStorage.setItem('zipCode', formData.zipCode);
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };
    
      
      
    const toggleDropdown = (dropdown) => {
        if (activeDropdown === dropdown) {
            setActiveDropdown(null); // Close dropdown if it's already open
        } else {
            setActiveDropdown(dropdown); // Open the clicked dropdown and close others
        }
    };

    const handleLogout = () => {
        // Perform any logout logic here (e.g., clearing tokens)
        console.log('User logged out');
        navigate('/'); // Redirect to the landing page
    };
    
    return (
        <div className="min-h-screen flex bg-black text-white px-8">
            <div className="w-1/4 p-6 bg-black">
                <h2 className="text-xl font-semibold mb-10">Manage Account</h2>
                <ul className="space-y-4">
                    <li
                        className={`flex items-center p-2 cursor-pointer ${activeTab === 'profile' ? 'bg-gray-800 rounded-md' : ''}`}
                        onClick={() => handleTabClick('profile')}
                    >
                        <FaUser className="mr-2" />
                        Profile
                    </li>
                    <li
                        className={`flex items-center p-2 cursor-pointer ${activeTab === 'password' ? 'bg-gray-800 rounded-md' : ''}`}
                        onClick={() => handleTabClick('password')}
                    >
                        <FaLock className="mr-2" />
                        Password
                    </li>
                    <li
                        className={`flex items-center p-2 cursor-pointer ${activeTab === 'orderHistory' ? 'bg-gray-800 rounded-md' : ''}`}
                        onClick={() => handleTabClick('orderHistory')}
                    >
                        <FaClipboardList className="mr-2" />
                        Order History
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-8">
                {(activeTab === 'profile' || activeTab === 'password') && (
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FaUser className="text-4xl text-gray-300" />
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <button
                                className="block px-4 py-2 bg-black border border-gray-600 text-xs rounded-md mb-2"
                                onClick={handleUploadClick}
                            >
                                Upload Picture
                            </button>
                            <button
                                className="block px-4 py-2 bg-gradient-to-r from-[#335C6E] to-[#000000] text-sm rounded-md"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                )}
                {/* Conditional Tab Content */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <div className="w-full max-w-2xl text-white rounded-lg shadow-lg">
                            <form className="space-y-6">
                                <div>
                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label className="block text-sm font-medium mb-1">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="First Name"
                                                className="w-full text-xs p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <label className="block text-sm font-medium mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Last Name"
                                                className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Email Address"
                                            className="w-full text-xs p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium mb-1">Contact Number</label>
                                        <input
                                            type="text"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleInputChange}
                                            placeholder="+63 912 345 6789"
                                            className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium mb-1">Street</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            placeholder="Street"
                                            className="w-full text-xs p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium mb-1">Barangay</label>
                                        <input
                                            type="text"
                                            name="barangay"
                                            value={formData.barangay}
                                            onChange={handleInputChange}
                                            placeholder="Barangay"
                                            className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium mb-1">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="City"
                                            className="w-full text-xs p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="w-1/2">
                                            <label className="block text-sm font-medium mb-1">Region</label>
                                            <select
                                                name="region"
                                                value={formData.region}
                                                onChange={handleInputChange}
                                                className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                                disabled={!isEditing}
                                            >
                                                <option value="">Select a region</option>
                                                <option value="Region I - Ilocos Region">Region I - Ilocos Region</option>
                                                <option value="Region II - Cagayan Valley">Region II - Cagayan Valley</option>
                                                <option value="Region III - Central Luzon">Region III - Central Luzon</option>
                                                <option value="Region IV-A - CALABARZON">Region IV-A - CALABARZON</option>
                                                <option value="Region IV-B - MIMAROPA">Region IV-B - MIMAROPA</option>
                                                <option value="Region V - Bicol Region">Region V - Bicol Region</option>
                                                <option value="Region VI - Western Visayas">Region VI - Western Visayas</option>
                                                <option value="Region VII - Central Visayas">Region VII - Central Visayas</option>
                                                <option value="Region VIII - Eastern Visayas">Region VIII - Eastern Visayas</option>
                                                <option value="Region IX - Zamboanga Peninsula">Region IX - Zamboanga Peninsula</option>
                                                <option value="Region X - Northern Mindanao">Region X - Northern Mindanao</option>
                                                <option value="Region XI - Davao Region">Region XI - Davao Region</option>
                                                <option value="Region XII - SOCCSKSARGEN">Region XII - SOCCSKSARGEN</option>
                                                <option value="Region XIII - Caraga">Region XIII - Caraga</option>
                                                <option value="NCR - National Capital Region">NCR - National Capital Region</option>
                                                <option value="CAR - Cordillera Administrative Region">CAR - Cordillera Administrative Region</option>
                                                <option value="BARMM - Bangsamoro Autonomous Region in Muslim Mindanao">BARMM - Bangsamoro Autonomous Region in Muslim Mindanao</option>
                                            </select>
                                        </div>

                                </div>

                                <div className="flex space-x-4">
                                <div className="w-1/2">
                                                <label className="block text-sm font-medium mb-1">Province</label>
                                                <select
                                                    name="province"
                                                    value={formData.province}
                                                    onChange={handleInputChange}
                                                    className="w-full text-xs p-3 bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                                    disabled={!isEditing}
                                                >
                                                    <option value="">Select a province</option>
                                                    <option value="Abra">Abra</option>
                                                    <option value="Agusan del Norte">Agusan del Norte</option>
                                                    <option value="Agusan del Sur">Agusan del Sur</option>
                                                    <option value="Aklan">Aklan</option>
                                                    <option value="Albay">Albay</option>
                                                    <option value="Antique">Antique</option>
                                                    <option value="Apayao">Apayao</option>
                                                    <option value="Aurora">Aurora</option>
                                                    <option value="Basilan">Basilan</option>
                                                    <option value="Bataan">Bataan</option>
                                                    <option value="Batanes">Batanes</option>
                                                    <option value="Batangas">Batangas</option>
                                                    <option value="Benguet">Benguet</option>
                                                    <option value="Biliran">Biliran</option>
                                                    <option value="Bohol">Bohol</option>
                                                    <option value="Bukidnon">Bukidnon</option>
                                                    <option value="Bulacan">Bulacan</option>
                                                    <option value="Cagayan">Cagayan</option>
                                                    <option value="Camarines Norte">Camarines Norte</option>
                                                    <option value="Camarines Sur">Camarines Sur</option>
                                                    <option value="Camiguin">Camiguin</option>
                                                    <option value="Capiz">Capiz</option>
                                                    <option value="Catanduanes">Catanduanes</option>
                                                    <option value="Cavite">Cavite</option>
                                                    <option value="Cebu">Cebu</option>
                                                    <option value="Cotabato">Cotabato</option>
                                                    <option value="Davao de Oro">Davao de Oro</option>
                                                    <option value="Davao del Norte">Davao del Norte</option>
                                                    <option value="Davao del Sur">Davao del Sur</option>
                                                    <option value="Davao Occidental">Davao Occidental</option>
                                                    <option value="Davao Oriental">Davao Oriental</option>
                                                    <option value="Dinagat Islands">Dinagat Islands</option>
                                                    <option value="Eastern Samar">Eastern Samar</option>
                                                    <option value="Guimaras">Guimaras</option>
                                                    <option value="Ifugao">Ifugao</option>
                                                    <option value="Ilocos Norte">Ilocos Norte</option>
                                                    <option value="Ilocos Sur">Ilocos Sur</option>
                                                    <option value="Iloilo">Iloilo</option>
                                                    <option value="Isabela">Isabela</option>
                                                    <option value="Kalinga">Kalinga</option>
                                                    <option value="La Union">La Union</option>
                                                    <option value="Laguna">Laguna</option>
                                                    <option value="Lanao del Norte">Lanao del Norte</option>
                                                    <option value="Lanao del Sur">Lanao del Sur</option>
                                                    <option value="Leyte">Leyte</option>
                                                    <option value="Maguindanao del Norte">Maguindanao del Norte</option>
                                                    <option value="Maguindanao del Sur">Maguindanao del Sur</option>
                                                    <option value="Marinduque">Marinduque</option>
                                                    <option value="Masbate">Masbate</option>
                                                    <option value="Metro Manila">Metro Manila</option>
                                                    <option value="Misamis Occidental">Misamis Occidental</option>
                                                    <option value="Misamis Oriental">Misamis Oriental</option>
                                                    <option value="Mountain Province">Mountain Province</option>
                                                    <option value="Negros Occidental">Negros Occidental</option>
                                                    <option value="Negros Oriental">Negros Oriental</option>
                                                    <option value="Northern Samar">Northern Samar</option>
                                                    <option value="Nueva Ecija">Nueva Ecija</option>
                                                    <option value="Nueva Vizcaya">Nueva Vizcaya</option>
                                                    <option value="Occidental Mindoro">Occidental Mindoro</option>
                                                    <option value="Oriental Mindoro">Oriental Mindoro</option>
                                                    <option value="Palawan">Palawan</option>
                                                    <option value="Pampanga">Pampanga</option>
                                                    <option value="Pangasinan">Pangasinan</option>
                                                    <option value="Quezon">Quezon</option>
                                                    <option value="Quirino">Quirino</option>
                                                    <option value="Rizal">Rizal</option>
                                                    <option value="Romblon">Romblon</option>
                                                    <option value="Samar">Samar</option>
                                                    <option value="Sarangani">Sarangani</option>
                                                    <option value="Siquijor">Siquijor</option>
                                                    <option value="Sorsogon">Sorsogon</option>
                                                    <option value="South Cotabato">South Cotabato</option>
                                                    <option value="Southern Leyte">Southern Leyte</option>
                                                    <option value="Sultan Kudarat">Sultan Kudarat</option>
                                                    <option value="Sulu">Sulu</option>
                                                    <option value="Surigao del Norte">Surigao del Norte</option>
                                                    <option value="Surigao del Sur">Surigao del Sur</option>
                                                    <option value="Tarlac">Tarlac</option>
                                                    <option value="Tawi-Tawi">Tawi-Tawi</option>
                                                    <option value="Zambales">Zambales</option>
                                                    <option value="Zamboanga del Norte">Zamboanga del Norte</option>
                                                    <option value="Zamboanga del Sur">Zamboanga del Sur</option>
                                                    <option value="Zamboanga Sibugay">Zamboanga Sibugay</option>
                                                </select>
                                            </div>

                                    <div className="w-1/2">
                                        <label className="block text-sm font-medium mb-1">Zip Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            placeholder="Zip Code"
                                            className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                
                                {/* Buttons */}
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gray-600 rounded-md text-xs"
                                        onClick={() => {
                                            setFormData(initialFormData);
                                            setIsEditing(false);
                                        }}
                                        disabled={!isEditing}
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gradient-to-r from-[#335C6E] to-[#000000] text-xs rounded-md"
                                        onClick={handleSaveChanges}
                                        disabled={!isEditing}
                                    >
                                        SAVE CHANGES
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                 {activeTab === 'password' && (
                    <div className="space-y-6">
                        <div className="w-full max-w-2xl text-white rounded-lg shadow-lg">
                            <form className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            placeholder="Current Password"
                                            className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg"
                                        />
                                        <div
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? <IoIosEyeOff /> : <IoIosEye />}
                                        </div>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="New Password"
                                            className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg"
                                        />
                                        <div
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <IoIosEyeOff /> : <IoIosEye />}
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg"
                                        />
                                        <div
                                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <IoIosEyeOff /> : <IoIosEye />}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-6">
                                    <button type="button" className="px-6 py-2 bg-gray-600 rounded-md text-xs">
                                        CANCEL
                                    </button>
                                    <button type="button" className="px-6 py-2 bg-gradient-to-r from-[#335C6E] to-[#000000] text-xs rounded-md">
                                        SAVE CHANGES
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                 {activeTab === 'orderHistory' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Order History</h3>
                            <div className="relative flex space-x-4">
                                {/* Filter Dropdown */}
                                <button
                                    className="relative flex items-center p-2 rounded-md text-sm text-white bg-gray-700"
                                    onClick={() => toggleDropdown('filter')}
                                    style={{ background: 'linear-gradient(90deg, #122229,#040405)' }}
                                >
                                    <span className="mr-2">All Status</span>
                                    {activeDropdown === 'filter' ? <FaChevronUp className="text-xs ml-2" /> : <FaChevronDown className="text-xs ml-2" />}
                                </button>
                                {activeDropdown === 'filter' && (
                                    <div className="absolute top-full left-[-18px] text-white mt-1 text-sm rounded-md shadow-lg p-2 w-full"
                                        style={{ background: 'linear-gradient(90deg, #122229,#040405)' }}>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            All Status
                                        </p>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            Payment Pending
                                        </p>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            Completed
                                        </p>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            Processing
                                        </p>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            Pre-ordered
                                        </p>
                                    </div>
                                )}

                                {/* Sort Dropdown */}
                                <button
                                    className="relative flex items-center p-2 rounded-md text-sm text-white bg-gray-700"
                                    onClick={() => toggleDropdown('sort')}
                                    style={{ background: 'linear-gradient(90deg, #040405, #122229)' }}
                                >
                                    <span className="mr-1">Last 3 Months</span>
                                    {activeDropdown === 'sort' ? <FaChevronUp className="text-xs ml-2" /> : <FaChevronDown className="text-xs ml-2" />}
                                </button>
                                {activeDropdown === 'sort' && (
                                    <div className="absolute top-full right-0 mt-1 bg-white text-white rounded-md shadow-lg p-2 text-sm"
                                        style={{ background: 'linear-gradient(90deg, #122229,#040405)' }}>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            Last 30 Days
                                        </p>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            Last 3 Months
                                        </p>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            Last 6 Months
                                        </p>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            All in 2024
                                        </p>
                                        <p className="cursor-pointer p-2 rounded-md"
                                            style={{ background: 'linear-gradient(90deg, #122229, #040405)' }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #335C6E, #122229)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #122229, #040405)'}
                                        >
                                            All
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order History Content */}
                        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md"
                            style={{ background: 'linear-gradient(90deg, #335C6E, #040405)' }}>
                            <div>
                                <h4 className="font-semibold">Order #12345</h4>
                                <p className="text-sm">Placed on June 1, 2023</p>
                            </div>
                            <div className="font-semibold">PHP 30,000</div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-black">
                                DELIVERED
                            </span>
                        </div>

                        <div className="flex justify-between items-center bg-gray-800 p-4 rounded-md"
                            style={{ background: 'linear-gradient(90deg, #040405, #335C6E)' }}>
                            <div>
                                <h4 className="font-semibold">Order #12345</h4>
                                <p className="text-sm">Placed on June 1, 2023</p>
                            </div>
                            <div className="font-semibold">PHP 30,000</div>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-black">
                                CANCELLED
                            </span>
                        </div>
                    </div>
                )}
                  <div className="mt-10">
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-all"
                    >
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageAcc;
