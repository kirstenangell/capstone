import React from 'react';
import carImage from '../assets/car.png'; // Adjust the path according to your project structure

const LandingSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B0F13] to-[#213B53] overflow-hidden">
      {/* Main Content */}
      <div className="container mx-auto flex items-center justify-between h-screen px-8">
        {/* Text Section */}
        <div className="text-white max-w-lg space-y-6 z-10">
          <h1 className="text-5xl font-bold">Car Care Made Simple</h1>
          <p className="text-lg leading-relaxed">
          At Flacko Auto Parts, we’re here to simplify car care. Shop our premium collection of auto parts and take advantage of our expert services for a worry-free ride.
          </p>
        </div>
      </div>

      {/* Car Animation */}
      <div className="absolute w-[65%] h-auto car-animation">
        <img
          src={carImage}
          alt="Car"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Styles for Animation */}
      <style jsx>{`
        @keyframes carDriveForwardBackward {
          0% {
            transform: translateX(150%); /* Start off-screen to the right */
            opacity: 0; /* Invisible at the start */
          }
          10% {
            opacity: 1; /* Fade in */
          }
          35% {
            transform: translateX(50%); /* Move to the center */
          }
          55% {
            transform: translateX(50%); /* Stay at the center longer */
          }
          100% {
            transform: translateX(150%); /* Drive back out to the right */
            opacity: 20; /* Fade out */
          }
        }

        .car-animation {
          bottom: 5%; /* Position the car near the bottom */
          animation: carDriveForwardBackward 7s linear infinite; /* Infinite loop */
        }
      `}</style>
    </div>
  );
};

export default LandingSection;
