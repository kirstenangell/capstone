import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Category = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle navigation
  const handleNavigate = (path) => {
    navigate(`/products/${path}`); // Navigate to the category page
  };

  return (
    <div className="category-container max-w-screen-xl mx-auto grid grid-cols-5 gap-8 text-center">
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Car Audio System</h3>
        <ul>
          <li><button onClick={() => handleNavigate('subwoofer')} className="text-white hover:text-gray-200">Subwoofer</button></li>
          <li><button onClick={() => handleNavigate('amplifier')} className="text-white hover:text-gray-200">Amplifier</button></li>
          <li><button onClick={() => handleNavigate('tweeter')} className="text-white hover:text-gray-200">Tweeter</button></li>
          <li><button onClick={() => handleNavigate('speaker')} className="text-white hover:text-gray-200">Speakers</button></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Lighting</h3>
        <ul>
          <li><button onClick={() => handleNavigate('led')} className="text-white hover:text-gray-200">LED</button></li>
          <li><button onClick={() => handleNavigate('halogen')} className="text-white hover:text-gray-200">Halogen</button></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Car Security</h3>
        <ul>
          <li><button onClick={() => handleNavigate('dashcam')} className="text-white hover:text-gray-200">Dash Cam</button></li>
          <li><button onClick={() => handleNavigate('reversecamera')} className="text-white hover:text-gray-200">Reverse Camera</button></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Tires/Wheels</h3>
        <ul>
          <li><button onClick={() => handleNavigate('sedanwheel')} className="text-white hover:text-gray-200">Sedan</button></li>
          <li><button onClick={() => handleNavigate('suvwheel')} className="text-white hover:text-gray-200">SUV</button></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Car Gadgets</h3>
        <ul>
          <li><button onClick={() => handleNavigate('carmultimedia')} className="text-white hover:text-gray-200">Car Multimedia</button></li>
          <li><button onClick={() => handleNavigate('carcooler')} className="text-white hover:text-gray-200">Car Cooler</button></li>
          <li><button onClick={() => handleNavigate('carhorn')} className="text-white hover:text-gray-200">Car Horn</button></li>
        </ul>
      </div>
    </div>
  );
};

export default Category;
