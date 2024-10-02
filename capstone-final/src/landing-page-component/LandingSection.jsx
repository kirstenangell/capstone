import React from 'react';
import carImage from '../assets/car.png'; // Adjust the path according to where the image is located

const LandingSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B0F13] to-[#213B53] overflow-hidden">
      {/* Main Content */}
      <div className="container mx-auto flex items-center justify-between h-screen px-8">
        {/* Text Section */}
        <div className="text-white max-w-lg space-y-6">
          <h1 className="text-5xl font-bold">Lorem ipsum dolor sit amet</h1>
          <p className="text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cras fermentum odio eu feugiat. Ut tristique et egestas quis.
          </p>
        </div>

        {/* Car Image with Animation */}
        <div className="absolute bottom-0 w-[40%] h-auto car-drive-animation">
          <img src={carImage} alt="Car" className="w-full h-auto object-contain" />
        </div>
      </div>

      {/* Car Road Animation */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-500 animate-road-move"></div>
    </div>
  );
};

export default LandingSection;
