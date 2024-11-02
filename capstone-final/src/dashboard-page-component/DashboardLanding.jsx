import React from 'react';
import { BsBoxSeam, BsPeople } from 'react-icons/bs';
import { AiOutlineStock } from 'react-icons/ai';
import { GiSpeedometer } from 'react-icons/gi';
import { SlSocialDropbox } from 'react-icons/sl';
import { FaOpencart } from 'react-icons/fa';
import { MdOutlinePendingActions, MdOutlineReviews } from 'react-icons/md';
import { FiUserPlus, FiTruck } from 'react-icons/fi';
import { RiFolderUserLine } from 'react-icons/ri';
import { LuUserPlus } from 'react-icons/lu';

const DashboardLanding = () => {
  return (
    <div className="min-h-screen p-8 bg-black font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Product Inventory */}
        <div className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] text-white rounded-lg p-6 shadow-[0_10px_30px_rgba(255,255,255,0.15),0_10px_20px_rgba(0,0,0,0.7)]">
          <h2 className="text-xl font-bold mb-4">Product Inventory</h2>
          <div className="flex items-center mb-2">
            <BsBoxSeam className="mr-2 text-3xl" />
            <div>
              <p className="text-sm">Total Products</p>
              <p className="text-3xl font-bold">1,234</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <AiOutlineStock className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">In Stock</p>
              <p className="text-2xl font-bold">819</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <GiSpeedometer className="mr-2 text-2xl" />
            <div>
              <p className="text-xs">Low Stock</p>
              <p className="text-xl font-bold">400</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <SlSocialDropbox className="mr-2 text-2xl" />
            <div>
              <p className="text-xs">Out of Stock</p>
              <p className="text-md font-bold">15</p>
            </div>
          </div>
        </div>

        {/* Order Inventory */}
        <div className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] text-white rounded-lg p-6 shadow-[0_10px_30px_rgba(255,255,255,0.15),0_10px_20px_rgba(0,0,0,0.7)]">
          <h2 className="text-xl font-bold mb-4">Order Inventory</h2>
          <div className="flex items-center mb-2">
            <FaOpencart className="mr-2 text-3xl" />
            <div>
              <p className="text-sm">Total Orders</p>
              <p className="text-3xl font-bold">2,345</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <FaOpencart className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">Total Orders</p>
              <p className="text-2xl font-bold">819</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <MdOutlinePendingActions className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">Pending Orders</p>
              <p className="text-xl font-bold">400</p>
            </div>
          </div>
        </div>

        {/* Customer Inventory */}
        <div className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] text-white rounded-lg p-6 shadow-[0_10px_30px_rgba(255,255,255,0.15),0_10px_20px_rgba(0,0,0,0.7)]">
          <h2 className="text-xl font-bold mb-4">Customer Inventory</h2>
          <div className="flex items-center mb-2">
            <BsPeople className="mr-2 text-3xl" />
            <div>
              <p className="text-sm">Total Customers</p>
              <p className="text-3xl font-bold">3,456</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <FiUserPlus className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">New Customers</p>
              <p className="text-2xl font-bold">231</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <MdOutlineReviews className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">Customer Satisfaction (out of 5)</p>
              <p className="text-xl font-bold">4.5</p>
            </div>
          </div>
        </div>

        {/* Supplier Inventory */}
        <div className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] text-white rounded-lg p-6 shadow-[0_10px_30px_rgba(255,255,255,0.15),0_10px_20px_rgba(0,0,0,0.7)]">
          <h2 className="text-xl font-bold mb-4">Supplier Inventory</h2>
          <div className="flex items-center mb-2">
            <FiTruck className="mr-2 text-3xl" />
            <div>
              <p className="text-sm">Total Suppliers</p>
              <p className="text-3xl font-bold">876</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <RiFolderUserLine className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">Active Suppliers</p>
              <p className="text-2xl font-bold">45</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <LuUserPlus className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">Pending Shipments</p>
              <p className="text-xl font-bold">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
