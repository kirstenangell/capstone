import React from 'react';

const Header = () => {
  const headerStyle = {
    background: 'linear-gradient(90deg, #4B88A3 0%, #040405 48%, #4B88A3 100%)',
  };

  return (
    <header style={headerStyle} className="text-center py-4">
      <h1 className="text-lg text-white tracking-widest">LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISCING ELIT</h1>
    </header>
  );
};

export default Header;
