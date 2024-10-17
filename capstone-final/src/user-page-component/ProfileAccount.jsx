import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios'; // Import Axios for API calls

const ProfileAccount = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profilePic, setProfilePic] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        address: '',
    });

    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // useNavigate hook for redirection

    // New state variables
    const [isEditing, setIsEditing] = useState(false);
    const [initialFormData, setInitialFormData] = useState({});

    // Fetch user data when the component loads
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Assuming the user's email is stored in localStorage after login
                const email = localStorage.getItem('email');
                if (email && email.includes('flacko1990')) {
                    const response = await axios.get(`http://localhost:5000/user-details?email=${email}`);
                    const { firstName, lastName, email: userEmail } = response.data;

                    // Set the fetched data to formData
                    setFormData((prevData) => ({
                        ...prevData,
                        firstName,
                        lastName,
                        email: userEmail,
                    }));

                    // Set initialFormData
                    setInitialFormData({
                        firstName,
                        lastName,
                        email: userEmail,
                    });
                } else {
                    alert('Access restricted');
                    navigate('/'); // Redirect to homepage if unauthorized
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData(); // Call the function to fetch data when the component mounts
    }, [navigate]);

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
        // Perform save operation here
        console.log('Form data saved:', formData);
        // You can add logic to save the data to the backend
    };

    const handleLogout = () => {
        // Perform any logout logic here (e.g., clearing tokens)
        console.log('User logged out');
        localStorage.clear(); // Clear localStorage on logout
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
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-8">
                {/* Profile Picture Section */}
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
                        <button
                            className="block px-4 py-2 bg-gradient-to-r from-[#335C6E] to-[#000000] text-sm rounded-md"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

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
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="House/Unit no., Street, Barangay, City, Region, Zip code"
                                        className="w-full p-3 text-xs bg-black border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                                        disabled={!isEditing}
                                    />
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
                                        onClick={() => {
                                            handleSaveChanges();
                                            setInitialFormData(formData);
                                            setIsEditing(false);
                                        }}
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

                {/* Logout Button - Below all the tabs */}
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

export default ProfileAccount;
