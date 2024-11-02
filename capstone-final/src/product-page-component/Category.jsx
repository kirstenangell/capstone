import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Category = ({ onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle navigation
  const handleNavigate = (categoryName) => {
    navigate(`/category/${categoryName}`); // Navigate to the category page
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="category-container max-w-screen-xl mx-auto grid grid-cols-5 gap-8 text-center"
    >
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Car Audio System</h3>
        <ul>
          <li><button onClick={() => handleNavigate('car-audio-system/subwoofer')} className="text-white hover:text-gray-200">Subwoofer</button></li>
          <li><button onClick={() => handleNavigate('car-audio-system/amplifier')} className="text-white hover:text-gray-200">Amplifier</button></li>
          <li><button onClick={() => handleNavigate('car-audio-system/tweeter')} className="text-white hover:text-gray-200">Tweeter</button></li>
          <li><button onClick={() => handleNavigate('car-audio-system/speakers')} className="text-white hover:text-gray-200">Speakers</button></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Lighting</h3>
        <ul>
          <li><button onClick={() => handleNavigate('lighting/led')} className="text-white hover:text-gray-200">LED</button></li>
          <li><button onClick={() => handleNavigate('lighting/halogen')} className="text-white hover:text-gray-200">Halogen</button></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Car Security</h3>
        <ul>
          <li><button onClick={() => handleNavigate('car-security/dash-cam')} className="text-white hover:text-gray-200">Dash Cam</button></li>
          <li><button onClick={() => handleNavigate('car-security/reverse-camera')} className="text-white hover:text-gray-200">Reverse Camera</button></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Tires/Wheels</h3>
        <ul>
          <li><button onClick={() => handleNavigate('tires-wheels/sedan')} className="text-white hover:text-gray-200">Sedan</button></li>
          <li><button onClick={() => handleNavigate('tires-wheels/suv')} className="text-white hover:text-gray-200">SUV</button></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Car Gadgets</h3>
        <ul>
          <li><button onClick={() => handleNavigate('car-gadgets/car-multimedia')} className="text-white hover:text-gray-200">Car Multimedia</button></li>
          <li><button onClick={() => handleNavigate('car-gadgets/car-cooler')} className="text-white hover:text-gray-200">Car Cooler</button></li>
          <li><button onClick={() => handleNavigate('car-gadgets/car-horn')} className="text-white hover:text-gray-200">Car Horn</button></li>
        </ul>
      </div>
    </div>
  );
};

export default Category;
