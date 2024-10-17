import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaLock, FaClipboardList } from 'react-icons/fa';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
        address: '',
    });
    const [activeDropdown, setActiveDropdown] = useState(null); // Single state to manage dropdowns
    const fileInputRef = useRef(null);

    // Fetch user data when the component loads
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get the email from localStorage
                const email = localStorage.getItem('email');
                if (email) {
                    // Fetch user details from the backend
                    const response = await axios.get(`http://localhost:5000/user-details?email=${email}`);
                    const { firstName, lastName, email: userEmail } = response.data;
    
                    // Update the formData state with fetched data
                    setFormData((prevData) => ({
                        ...prevData,
                        firstName,
                        lastName,
                        email: userEmail,
                    }));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
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

    const handleSaveChanges = () => {
        console.log('Form data saved:', formData);
        // Optional: You can add logic here to send updated data to the backend
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
                        className={`flex items-center p-2 cursor-pointer ${
                            activeTab === 'profile' ? 'bg-gray-800 rounded-md' : ''
                        }`}
                        onClick={() => handleTabClick('profile')}
                    >
                        <FaUser className="mr-2" />
                        Profile
                    </li>
                    <li
                        className={`flex items-center p-2 cursor-pointer ${
                            activeTab === 'password' ? 'bg-gray-800 rounded-md' : ''
                        }`}
                        onClick={() => handleTabClick('password')}
                    >
                        <FaLock className="mr-2" />
                        Password
                    </li>
                    <li
                        className={`flex items-center p-2 cursor-pointer ${
                            activeTab === 'orderHistory' ? 'bg-gray-800 rounded-md' : ''
                        }`}
                        onClick={() => handleTabClick('orderHistory')}
                    >
                        <FaClipboardList className="mr-2" />
                        Order History
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-8">
                {/* Profile Picture Section (visible only in Profile and Password tabs) */}
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
                            {/* Hidden file input */}
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
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="House/Unit no., Street, Barangay, City, Region, Zip code"
                                        className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                {/* Buttons */}
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gray-600 rounded-md text-xs"
                                        onClick={() =>
                                            setFormData({
                                                firstName: '',
                                                lastName: '',
                                                email: '',
                                                contactNumber: '',
                                                address: '',
                                            })
                                        }
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gradient-to-r from-[#335C6E] to-[#000000] text-xs rounded-md"
                                        onClick={handleSaveChanges}
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
                                <div>
                                    <label className="block text-sm font-medium mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="Current Password"
                                        className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                {/* Buttons */}
                                <div className="flex justify-between mt-6">
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gray-600 rounded-md text-xs"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="button"
                                        className="px-6 py-2 bg-gradient-to-r from-[#335C6E] to-[#000000] text-xs rounded-md"
                                    >
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