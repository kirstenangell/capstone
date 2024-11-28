import React from 'react';

const Header = () => {
  const headerStyle = {
    background: 'linear-gradient(90deg, #4B88A3 0%, #040405 48%, #4B88A3 100%)',
    fontFamily: 'Poppins, sans-serif',
  };

  return (
    <header style={headerStyle} className="text-center py-4 sticky top-0 z-50">
      <h1 className="text-sm text-white tracking-widest">Flacko Auto Parts and Accessories: Excellence in Every Detail</h1>
    </header>
  );
};

export default Header;
