import React, { useState } from 'react';
import backgroundImage1 from '../assets/capBG.jpg';
import backgroundImage2 from '../assets/missionImage.jpg';
import backgroundImage3 from '../assets/visionImage.jpg';

const boxes = [
  {
    id: 1,
    title: 'ABOUT US',
    image: backgroundImage1,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cras fermentum odio eu feugiat. Duis at tellus at urna condimentum mattis pellentesque id nibh.',
  },
  {
    id: 2,
    title: 'MISSION',
    image: backgroundImage2,
    text: 'Our mission at Flacko Auto Parts and Accessories Trading is to provide our customers with high-quality car accessories and exceptional service, delivering value and satisfaction with every purchase.',
  },
  {
    id: 3,
    title: 'VISION',
    image: backgroundImage3,
    text: 'Our vision is to become the preferred choice for car enthusiasts and drivers seeking premium-quality auto parts and accessories, recognized for our commitment to excellence and customer satisfaction.',
  },
];

const AboutUs = () => {
  const [background, setBackground] = useState({
    image: backgroundImage1,
    title: 'ABOUT US',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cras fermentum odio eu feugiat. Duis at tellus at urna condimentum mattis pellentesque id nibh.',
  });

  const handleBoxClick = (box) => {
    setBackground({ image: box.image, title: box.title, text: box.text });
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-between overflow-hidden px-8">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${background.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3, // Low opacity for the background image
        }}
      />

      {/* Text Content */}
      <div
        className="relative text-white max-w-lg z-10 flex flex-col justify-center"
        style={{
          marginLeft: '2%',
          marginRight: '2%',
          height: 'auto',
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        <h2 className="text-6xl font-bold mb-10">{background.title}</h2>
        <p className="mt-4 text-MD leading-relaxed">{background.text}</p>
      </div>

      {/* Boxes */}
      <div
        className="relative z-10 flex space-x-6"
        style={{
          marginRight: '2%',
          marginLeft: '1%',
          alignItems: 'center',
          height: '450px',
        }}
      >
        {boxes.map((box) => (
          <div
            key={box.id}
            onClick={() => handleBoxClick(box)}
            className="cursor-pointer relative transition-transform duration-300 ease-in-out"
            style={{
              width: '330px', // Smaller image size
              height: '350px', // Smaller image size
              backgroundImage: `url(${box.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '25px',
              opacity: 1,
              transition: 'height 0.3s ease', // Add transition for height
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.height = '400px'; // Increase the height when hovered
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.height = '350px'; // Revert the height when not hovered
            }}
          >
            {/* Title */}
            <div
              className="absolute bottom-4 left-8 text-white text-2xl font-extra-light text-[28px]"
              style={{ zIndex: 2 }} // Ensure text is in front of the image
            >
              {box.title}
            </div>
          </div>
        ))}
      </div>

      {/* Media Queries for Responsive Adjustments */}
      <style jsx>{`
        @media (max-width: 1440px) {
          .text-6xl {
            font-size: 4rem;
          }
          .leading-relaxed {
            font-size: 0.875rem;
          }
        }
        @media (max-width: 1024px) {
          .text-6xl {
            font-size: 3.5rem;
          }
          .leading-relaxed {
            font-size: 0.75rem;
          }
          .relative {
            width: 300px;
            height: 300px;
          }
        }
        @media (max-width: 768px) {
          .text-6xl {
            font-size: 3rem;
          }
          .leading-relaxed {
            font-size: 0.7rem;
          }
          .relative {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
