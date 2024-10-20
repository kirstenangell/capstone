import React from 'react';

const Category = ({ onMouseEnter, onMouseLeave }) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="category-container max-w-screen-xl mx-auto grid grid-cols-5 gap-8 text-center"
    >
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Car Audio System</h3>
        <ul>
          <li><a href="#subwoofer" className="text-white hover:text-gray-200">Subwoofer</a></li>
          <li><a href="#amplifier" className="text-white hover:text-gray-200">Amplifier</a></li>
          <li><a href="#tweeter" className="text-white hover:text-gray-200">Tweeter</a></li>
          <li><a href="#speakers" className="text-white hover:text-gray-200">Speakers</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Lighting</h3>
        <ul>
          <li><a href="#led" className="text-white hover:text-gray-200">LED</a></li>
          <li><a href="#halogen" className="text-white hover:text-gray-200">Halogen</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Car Security</h3>
        <ul>
          <li><a href="#dash-cam" className="text-white hover:text-gray-200">Dash Cam</a></li>
          <li><a href="#reverse-camera" className="text-white hover:text-gray-200">Reverse Camera</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Tires/Wheels</h3>
        <ul>
          <li><a href="#sedan" className="text-white hover:text-gray-200">Sedan</a></li>
          <li><a href="#suv" className="text-white hover:text-gray-200">SUV</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2 text-white">Car Gadgets</h3>
        <ul>
          <li><a href="#multimedia" className="text-white hover:text-gray-200">Car Multimedia</a></li>
          <li><a href="#cooler" className="text-white hover:text-gray-200">Car Cooler</a></li>
          <li><a href="#horn" className="text-white hover:text-gray-200">Car Horn</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Category;
