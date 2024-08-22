import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircle } from 'react-icons/io5';

const ForgotPassword = ({ onSubmit }) => {
  const navigate = useNavigate();

  const handleBackToLoginClick = () => {
    navigate('/login');
  };

  console.log("ForgotPassword component is rendered");

  return (
    <div className="min-h-screen flex items-start justify-center bg-black text-white mt-[-50px] pt-[100px] pb-[50px]"> 
      <div className="w-full max-w-sm space-y-6 p-8 rounded-lg">
        <h1 className="text-2xl font-medium text-center mb-4">FORGOT PASSWORD?</h1>
        <p className="text-center text-xs bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent mb-6">
          Enter your email address below to receive a password reset link
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="relative">
            <label className="text-xs mb-1 block">EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="user@gmail.com"
              className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
              style={{
                background: 'linear-gradient(90deg, #040405, #335C6E)',
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-full text-sm font-semibold tracking-widest transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #040405, #335C6E)',
            }}
          >
            SUBMIT
          </button>
        </form>

        <div className="text-center mt-4 text-xs">
          <a
            href="#"
            onClick={handleBackToLoginClick}
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

        <div className="text-center mt-4 text-xs">
          <span>Don't have an account? </span>
          <a
            href="#"
            onClick={() => navigate('/signup')}
            className="hover:underline bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
