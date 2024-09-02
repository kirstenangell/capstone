import React, { useState } from 'react';
import { FaUser, FaLock, FaClipboardList } from 'react-icons/fa';

const ManageAcc = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="min-h-screen flex bg-black text-white">
            {/* Sidebar */}
            <div className="w-1/4 p-6 bg-black">
                <h2 className="text-xl font-semibold mb-8">Manage Account</h2>
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
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
                                <FaUser className="text-4xl text-gray-300" />
                            </div>
                            <div>
                                <button className="block px-4 py-2 bg-black border border-gray-600 rounded-md mb-2">
                                    Upload Picture
                                </button>
                                <button className="block px-4 py-2 bg-gradient-to-r from-[#335C6E] to-[#62B1D4] rounded-md">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs mb-2">First Name</label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs mb-2">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="user@gmail.com"
                                    className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs mb-2">Contact Number</label>
                                <input
                                    type="text"
                                    placeholder="+63 9876 543 210"
                                    className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs mb-2">Address</label>
                                <input
                                    type="text"
                                    placeholder="House/Unit no., Street, Barangay, City, Region, Zip code"
                                    className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button className="px-6 py-2 bg-gray-600 rounded-md">CANCEL</button>
                            <button className="px-6 py-2 bg-gradient-to-r from-[#335C6E] to-[#62B1D4] rounded-md">
                                SAVE CHANGES
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs mb-2">Current Password</label>
                            <input
                                type="password"
                                placeholder="Current Password"
                                className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-2">New Password</label>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button className="px-6 py-2 bg-gray-600 rounded-md">CANCEL</button>
                            <button className="px-6 py-2 bg-gradient-to-r from-[#335C6E] to-[#62B1D4] rounded-md">
                                SAVE CHANGES
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'orderHistory' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Order History</h3>
                        <div className="bg-gray-800 p-4 rounded-md">Order #1 - Completed</div>
                        <div className="bg-gray-800 p-4 rounded-md">Order #2 - Pending</div>
                        <div className="bg-gray-800 p-4 rounded-md">Order #3 - Shipped</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAcc;
