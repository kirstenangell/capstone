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
          background: 'linear-gradient(90deg, #4B88A3 0%, #040405 100%, #4B88A3 82%)',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {/* Links with Extended Rounded Background Hover Animation and Drop Shadow */}
        <div className="flex items-center ml-8">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-white mr-16 relative group transition-all duration-300 transform ${
                isActive ? 'rounded-full py-2 px-4' : ''
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
                  }
                : {}
            }
          >
            <span className="relative">DASHBOARD</span>
          </NavLink>
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `text-white mr-20 relative group transition-all duration-300 transform ${
                isActive ? 'rounded-full py-2 px-4' : ''
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
                  }
                : {}
            }
          >
            <span className="relative">INVENTORY</span>
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              `text-white mr-20 relative group transition-all duration-300 transform ${
                isActive ? 'rounded-full py-2 px-4' : ''
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
                  }
                : {}
            }
          >
            <span className="relative">ORDER</span>
          </NavLink>
          <NavLink
            to="/customer"
            className={({ isActive }) =>
              `text-white mr-20 relative group transition-all duration-300 transform ${
                isActive ? 'rounded-full py-2 px-4' : ''
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
                  }
                : {}
            }
          >
            <span className="relative">CUSTOMER</span>
          </NavLink>
          <NavLink
            to="/supplier"
            className={({ isActive }) =>
              `text-white mr-20 relative group transition-all duration-300 transform ${
                isActive ? 'rounded-full py-2 px-4' : ''
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
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
