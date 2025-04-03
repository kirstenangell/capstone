import React, { useEffect, useState } from 'react';
import { BsBoxSeam } from 'react-icons/bs';
import { AiOutlineStock } from 'react-icons/ai';
import { GiSpeedometer } from 'react-icons/gi';
import { SlSocialDropbox } from 'react-icons/sl';
import { FaOpencart } from 'react-icons/fa';
import { MdOutlinePendingActions } from 'react-icons/md';
import { FiTruck } from 'react-icons/fi';
import { RiFolderUserLine } from 'react-icons/ri';

// Import summary functions
import { getInventorySummary } from '../inventory-page-component/InventoryLanding';
import { getOrderSummary } from '../order-page-component/OrderLanding';
import { getSupplierSummary } from '../supplier-page-component/SupplierLanding';

const DashboardLanding = () => {
  const [inventorySummary, setInventorySummary] = useState({});
  const [orderSummary, setOrderSummary] = useState({});
  const [supplierSummary, setSupplierSummary] = useState({});

  useEffect(() => {
    // Fetch data for inventory
    const fetchInventory = async () => {
      const products = [
        { id: 1, name: 'Product A', status: 'In Stock', quantity: 50 },
        { id: 2, name: 'Product B', status: 'Out of Stock', quantity: 0 },
        { id: 3, name: 'Product C', status: 'In Stock', quantity: 5 },
      ];
      setInventorySummary(getInventorySummary(products));
    };

    // Fetch data for orders
    const fetchOrders = async () => {
      const orders = [
        { id: 1, status: 'Pending' },
        { id: 2, status: 'Completed' },
        { id: 3, status: 'Pending' },
      ];
      setOrderSummary(getOrderSummary(orders));
    };

    // Fetch data for suppliers
    const fetchSuppliers = async () => {
      const suppliers = [
        { id: 1, isActive: true },
        { id: 2, isActive: false },
        { id: 3, isActive: true },
      ];
      setSupplierSummary(getSupplierSummary(suppliers));
    };

    fetchInventory();
    fetchOrders();
    fetchSuppliers();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-[120px] pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Product Inventory */}
        <div className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] text-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Product Inventory</h2>
          <div className="flex items-center mb-2">
            <BsBoxSeam className="mr-2 text-3xl" />
            <div>
              <p className="text-sm">Total Products</p>
              <p className="text-3xl font-bold">{inventorySummary.totalProducts || 0}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <AiOutlineStock className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">In Stock</p>
              <p className="text-2xl font-bold">{inventorySummary.inStock || 0}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <GiSpeedometer className="mr-2 text-2xl" />
            <div>
              <p className="text-xs">Low Stock</p>
              <p className="text-xl font-bold">{inventorySummary.lowStock || 0}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <SlSocialDropbox className="mr-2 text-2xl" />
            <div>
              <p className="text-xs">Out of Stock</p>
              <p className="text-md font-bold">{inventorySummary.outOfStock || 0}</p>
            </div>
          </div>
        </div>

        {/* Order Inventory */}
        <div className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] text-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Order Inventory</h2>
          <div className="flex items-center mb-2">
            <FaOpencart className="mr-2 text-3xl" />
            <div>
              <p className="text-sm">Total Orders</p>
              <p className="text-3xl font-bold">{orderSummary.totalOrders || 0}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <MdOutlinePendingActions className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">Pending Orders</p>
              <p className="text-xl font-bold">{orderSummary.pendingOrders || 0}</p>
            </div>
          </div>
        </div>

        {/* Supplier Inventory */}
        <div className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] text-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Supplier Inventory</h2>
          <div className="flex items-center mb-2">
            <FiTruck className="mr-2 text-3xl" />
            <div>
              <p className="text-sm">Total Suppliers</p>
              <p className="text-3xl font-bold">{supplierSummary.totalSuppliers || 0}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <RiFolderUserLine className="mr-2 text-2xl" />
            <div>
              <p className="text-sm">Active Suppliers</p>
              <p className="text-2xl font-bold">{supplierSummary.activeSuppliers || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
