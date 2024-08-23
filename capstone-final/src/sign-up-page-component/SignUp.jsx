import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { IoInformationCircle } from 'react-icons/io5';
import { IoArrowBackCircle } from 'react-icons/io5'; // Back icon import
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    // Add your signup logic here
    // After signup, you can navigate to a different page if necessary
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-black text-white mt-[-50px] pt-[100px] pb-[50px]">
      <div className="w-full max-w-sm space-y-6 p-8 rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-4">CREATE ACCOUNT</h1>

        <form className="space-y-4" onSubmit={handleSignupSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
              style={{
                background: 'linear-gradient(90deg, #040405, #335C6E)',
              }}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
              style={{
                background: 'linear-gradient(90deg, #040405, #335C6E)',
              }}
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
            style={{
              background: 'linear-gradient(90deg, #040405, #335C6E)',
            }}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
              style={{
                background: 'linear-gradient(90deg, #040405, #335C6E)',
              }}
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer mt-1"
            >
              {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </div>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
              style={{
                background: 'linear-gradient(90deg, #040405, #335C6E)',
              }}
            />
            <div
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer mt-1"
            >
              {showConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-2 flex items-center">
            <IoInformationCircle className="mr-1 text-blue-500" /> Must be at least 8 characters
          </p>

          <div className="flex items-center mt-4 space-x-2">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className="text-xs text-gray-400">
              By creating an account you agree with our{' '}
              <a href="#" className="text-blue-400 hover:underline">
                Terms of Service
              </a>
              ,{' '}
              <a href="#" className="text-blue-400 hover:underline">
                Shipping Policy
              </a>
              , and our default{' '}
              <a href="#" className="text-blue-400 hover:underline">
                Notification Settings
              </a>
              .
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-full text-sm font-semibold tracking-widest transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #040405, #335C6E)',
            }}
            disabled={!agreedToTerms} // Disable button if terms not agreed
          >
            SIGN UP
          </button>
        </form>

        <div className="text-center mt-4 text-xs">
          <a
            href="#"
            onClick={() => navigate('/login')}
            className="flex items-center justify-center hover:underline bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent"
          >
            <IoArrowBackCircle
              className="mr-1"
              style={{
                fill: 'url(#grad1)',
                width: '16px',
                height: '16px',
              }}
            />
            Back to Login
          </a>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%">
                <stop offset="0%" style={{ stopColor: '#62B1D4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#335C6E', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
