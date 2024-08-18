import React from 'react';
import { IoIosCart } from 'react-icons/io';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="p-4 flex justify-between items-center">
      {/* Logo */}
      <NavLink to="/" className="text-black text-2xl font-bold">
        LOGO
      </NavLink>

      {/* Combined Links and Buttons with Gradient Background and Rounded Corners */}
      <div
        className="flex items-center py-2 px-4 rounded-full text-xs drop-shadow-2xl"
        style={{
            background: 'linear-gradient(90deg, #4B88A3 0%, #040405 100%, #4B88A3 82%)',
          }}
      >
        {/* Links with Extended Rounded Background Hover Animation and Drop Shadow */}
        <div className="flex items-center ml-8">
          <NavLink
            to="/about"
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
            <span className="relative">ABOUT US</span>
          </NavLink>
          <NavLink
            to="/services"
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
            <span className="relative">SERVICES</span>
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `relative group mr-24 transition-all duration-300 transform ${
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
            <span className="text-white flex items-center relative group-hover:text-gray-400">
              PRODUCTS
              <svg
                className="ml-1 w-4 h-4 text-white transition-colors duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </span>
          </NavLink>
        </div>

        {/* Cart, Sign Up, and Log In with Hover Slide Animation */}
        <div className="flex items-center space-x-2 ml-10">
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex items-center justify-center text-white px-4 py-2 relative group transition-all duration-300 transform ${
                isActive ? 'rounded-full' : ''
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
            <IoIosCart className="text-white w-5 h-5" />
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              `text-white relative group transition-all duration-300 transform ${
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
            SIGN UP
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `text-white py-2 px-4 rounded-full relative group overflow-hidden transition-all duration-300 transform ${
                isActive ? '' : ''
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(95deg, #4B88A3 0%, #040405 51%, #4B88A3 100%)',
                  }
                : {}
            }
          >
            LOG IN
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
