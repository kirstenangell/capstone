import React from 'react';
import { FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const InventoryNavbar = ({ cartItemCount }) => {
  return (
    <nav
      className="p-4 flex justify-between items-center sticky top-[52px] z-40"
      style={{ backgroundColor: 'black' }} 
    >
      {/* Logo */}
      <NavLink to="/" className="text-white text-2xl font-bold">
        LOGO
      </NavLink>

      {/* Combined Links and Buttons with Gradient Background and Rounded Corners */}
      <div
        className="flex items-center py-2 px-4 rounded-full text-xs drop-shadow-2xl"
        style={{
          background: 'linear-gradient(0deg, #4B88A3 0%, #040405 0%, #4B88A3 180%)', // Apply background gradient only here
          boxShadow: '0px 10px 20px rgba(10, 10, 10, 0.7)', // Custom shadow 
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {/* Links with Extended Rounded Background Hover Animation and Drop Shadow */}
        <div className="flex items-center ml-8">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-white relative py-2 px-6 rounded-full mx-4 transition-all duration-300 transform ${
                isActive
                  ? 'active-gradient'
                  : 'bg-transparent border border-gray-800 hover:glowing-border'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%)',
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.9)' // Active button shadow
                  }
                : {}
            }
          >
            <span className="relative">DASHBOARD</span>
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `text-white relative py-2 px-6 rounded-full mx-4 transition-all duration-300 transform ${
                isActive
                  ? 'active-gradient'
                  : 'bg-transparent border border-gray-800 hover:glowing-border'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%)',
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.9)' // Active button shadow
                  }
                : {}
            }
          >
            <span className="relative">INVENTORY</span>
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              `text-white relative py-2 px-6 rounded-full mx-4 transition-all duration-300 transform ${
                isActive
                  ? 'active-gradient'
                  : 'bg-transparent border border-gray-800 hover:glowing-border'
              }`
            }
            style={({ isActive }) =>
              isActive
            ? {
                background: 'linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%)',
                boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.9)' // Active button shadow
              }
            : {}
            }
          >
            <span className="relative">ORDER</span>
          </NavLink>
          <NavLink
            to="/customer"
            className={({ isActive }) =>
              `text-white relative py-2 px-6 rounded-full mx-4 transition-all duration-300 transform ${
                isActive
                  ? 'active-gradient'
                  : 'bg-transparent border border-gray-800 hover:glowing-border'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%)',
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.9)' // Active button shadow
                  }
                : {}
            }
          >
            <span className="relative">CUSTOMER</span>
          </NavLink>
          <NavLink
            to="/supplier"
            className={({ isActive }) =>
              `text-white relative py-2 px-6 rounded-full mx-4 transition-all duration-300 transform ${
                isActive
                  ? 'active-gradient'
                  : 'bg-transparent border border-gray-800 hover:glowing-border'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%)',
                    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.9)' // Active button shadow
                  }
                : {}
            }
          >
            <span className="relative">SUPPLIER</span>
          </NavLink>
        </div>

        {/* User Icon and Username */}
        <div className="flex items-center ml-10 space-x-2">
          {/* User Icon */}
          <div className="bg-[rgba(0,0,0,0.7)] rounded-full p-2">
            <FaUser className="text-white w-5 h-5" />
          </div>

          {/* Username Redirect */}
          <NavLink to="/user" className="text-white cursor-pointer">
            Cruz, Juan
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default InventoryNavbar;
