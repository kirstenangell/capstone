import React from 'react';

const Header = () => {
  const headerStyle = {
    background: 'linear-gradient(90deg, #4B88A3 0%, #040405 48%, #4B88A3 100%)',
    fontFamily: 'Poppins, sans-serif',
    overflow: 'hidden', // Ensure the animation stays within the header bounds
  };

  const textStyle = {
    display: 'block', // Changed from inline-block to block for continuous flow
    whiteSpace: 'nowrap', // Prevents the text from wrapping
    fontWeight: 'bold', // Makes text bold
    fontStyle: 'italic', // Makes text italicized
    textTransform: 'uppercase', // Converts text to uppercase
    color: '#FFFFFF', // Sets text color to white
    textShadow: '0 0 5px #FFFFFF, 0 0 10px #007BFF', // Adds glowing effect with white and light blue
    animation: 'marquee 15s linear infinite', // Animation name, duration, timing, iteration
  };

  return (
    <header style={headerStyle} className="text-center py-4 sticky top-0 z-50">
      <h1 style={textStyle} className="text-sm tracking-widest">
        Shop Now and Enjoy Complimentary Installation with Every Purchase at our shop!
      </h1>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
