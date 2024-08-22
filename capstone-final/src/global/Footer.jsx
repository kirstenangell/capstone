import React from 'react';
import { NavLink } from 'react-router-dom';

function Footer() {
  return (
    <footer
      className="w-full h-auto bg-gradient-to-b from-gray-900 to-black text-white flex items-center px-6 py-8"
      style={{
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div className="max-w-screen-xl w-full flex justify-between space-x-12">
        {/* Left Section */}
        <div className="w-1/2 pl-20">
          <NavLink
            to="/"
            className="text-md font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r"
            style={{
              backgroundImage:
                'linear-gradient(to right, #C9CACA, #335C6E, #62B1D4, #C9CACA)',
            }}
          >
            FLACKO AUTO PARTS ACCESSORIES AND TRADING
          </NavLink>

          {/* Added space */}
          <div className="mb-4"></div>

          <p className="text-xs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Center Section */}
        <div className="w-1/3 flex justify-center">
          <div className="flex space-x-12">
            <div className="flex flex-col pl-4 space-y-4 text-center">
              <NavLink
                to="/about"
                className="text-white text-xs font-light uppercase hover:underline"
              >
                ABOUT US
              </NavLink>
              <NavLink
                to="/services"
                className="text-white text-xs font-light uppercase hover:underline"
              >
                SERVICES
              </NavLink>
              <NavLink
                to="/products"
                className="text-white text-xs font-light uppercase hover:underline"
              >
                PRODUCTS
              </NavLink>
              <NavLink
                to="/contact"
                className="text-white text-xs font-light uppercase hover:underline"
              >
                CONTACT US
              </NavLink>
            </div>
            <div className="flex flex-col pl-12 space-y-4 text-center">
              <NavLink
                to="/faqs"
                className="text-white text-xs font-light uppercase hover:underline"
              >
                FAQS
              </NavLink>
              <NavLink
                to="/terms"
                className="text-white text-xs font-light uppercase hover:underline"
              >
                TERMS OF SERVICE
              </NavLink>
              <NavLink
                to="/shipping"
                className="text-white text-xs font-light uppercase hover:underline"
              >
                SHIPPING POLICY
              </NavLink>
              <NavLink
                to="/returns"
                className="text-white text-xs font-light uppercase hover:underline"
              >
                RETURNS AND REFUND
              </NavLink>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 text-left pl-16">
          <h2 className="text-xs font-bold mb-4 uppercase">SOCIAL MEDIA</h2>
          <p className="text-xs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
