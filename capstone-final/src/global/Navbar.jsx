import React from 'react';
import { IoIosCart } from 'react-icons/io';

const Navbar = () => {
  return (
    <nav className="p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-black text-2xl font-bold">LOGO</div>

      {/* Combined Links and Buttons with Gradient Background and Rounded Corners */}
      <div
        className="flex items-center py-2 px-4 rounded-full text-xs drop-shadow-2xl"
        style={{
          background: 'linear-gradient(90deg, #4B88A3 0%, #040405 100%, #4B88A3 82%)',
        }}
      >
        {/* Links with Extended Rounded Background Hover Animation and Drop Shadow */}
        <div className="flex items-center ml-8">
          <a href="#" className="text-white mr-16 relative group transition-all duration-300 transform">
            <span
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 rounded-full group-hover:opacity-100 group-hover:drop-shadow-md transition-all duration-300"
              style={{
                padding: '0.75rem 2rem',
                width: 'calc(100% + 20px)',
                background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
              }}
            ></span>
            <span className="relative group-hover:translate-x-1">ABOUT</span> {/* Added sliding effect */}
          </a>
          <a href="#" className="text-white mr-20 relative group transition-all duration-300 transform">
            <span
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 rounded-full group-hover:opacity-100 group-hover:drop-shadow-md transition-all duration-300"
              style={{
                padding: '0.75rem 2rem',
                width: 'calc(100% + 20px)',
                background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
              }}
            ></span>
            <span className="relative group-hover:translate-x-1">SERVICES</span> {/* Added sliding effect */}
          </a>
          <div className="relative group mr-24 transition-all duration-300 transform">
            <a href="#" className="text-white flex items-center relative group-hover:text-gray-400">
              <span
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 rounded-full group-hover:opacity-100 group-hover:drop-shadow-md transition-all duration-300"
                style={{
                  padding: '0.75rem 2rem',
                  width: 'calc(100% + 20px)',
                  background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
                }}
              ></span>
              <span className="relative group-hover:translate-x-1">PRODUCTS</span> {/* Added sliding effect */}
              <svg
                className="ml-1 w-4 h-4 text-white transition-colors duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </a>
            {/* Dropdown content */}
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a href="#" className="block px-4 py-2 text-black hover:bg-gray-200 transition-colors duration-300">Product 1</a>
              <a href="#" className="block px-4 py-2 text-black hover:bg-gray-200 transition-colors duration-300">Product 2</a>
              <a href="#" className="block px-4 py-2 text-black hover:bg-gray-200 transition-colors duration-300">Product 3</a>
            </div>
          </div>
        </div>

        {/* Cart, Sign Up, and Log In with Hover Slide Animation */}
        <div className="flex items-center space-x-2 ml-10">
          <button className="flex items-center justify-center text-white px-4 py-2 relative group transition-all duration-300 transform">
            <IoIosCart className="text-white w-5 h-5" />
            <span className="absolute inset-0 opacity-0 transform translate-x-full group-hover:translate-x-0 group-hover:opacity-10 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
              }}
            ></span>
          </button>
          <button className="text-white relative group transition-all duration-300 transform">
            <span
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 rounded-full group-hover:opacity-100 group-hover:drop-shadow-md transition-all duration-300"
              style={{
                padding: '0.75rem 2rem',
                width: 'calc(100% + 20px)',
                background: 'linear-gradient(90deg, #4B88A3 0%, #040405 51%, #4B88A3 82%)',
              }}
            ></span>
            <span className="relative group-hover:translate-x-1">SIGN UP</span> {/* Added sliding effect */}
          </button>
          <button
            className="text-white py-1 px-4 rounded-full relative group overflow-hidden transition-all duration-300 transform"
            style={{
              background: 'linear-gradient(95deg, #4B88A3 0%, #040405 51%, #4B88A3 100%)',
            }}
          >
            LOG IN
            <span className="absolute inset-0 bg-white opacity-0 transform translate-x-full group-hover:translate-x-0 group-hover:opacity-10 transition-all duration-300 rounded-full"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
