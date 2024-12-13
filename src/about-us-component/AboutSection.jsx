import React, { useState } from 'react';
import backgroundImage1 from '../assets/capBG.jpg';
import backgroundImage2 from '../assets/missionImage.jpg';
import backgroundImage3 from '../assets/visionImage.jpg';

const boxes = [
  {
    id: 1,
    title: 'ABOUT US',
    image: backgroundImage1,
    text: 'Established in 1990 by Mrs. Veneranda Villafuerte Francisco, our family-owned business began as Franville Car Accessories in Cubao, offering quality car accessories and exceptional service. Despite challenges, including the loss of our founder in 2021, we rebranded as Flacko Auto Parts and Accessories Trading under the leadership of Rhea Villafuerte Francisco, continuing our commitment to excellence and our customers.',
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
    text: 'Flacko Auto Parts and Accessories Trading is your trusted source for quality car parts and accessories. Built on a legacy of dedication and exceptional service, we strive to provide solutions tailored to every need. From our humble beginnings to a trusted industry name, we remain committed to reliability, innovation, and customer satisfaction.',
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
        className="relative z-10 flex space-x-6 flex-wrap justify-center md:space-x-4"
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

      {/* Responsive Styling */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .text-6xl {
            font-size: 3.5rem;
          }
          .leading-relaxed {
            font-size: 0.85rem;
          }
          .max-w-lg {
            max-width: 80%;
          }
        }
        @media (max-width: 768px) {
          .text-6xl {
            font-size: 3rem;
          }
          .leading-relaxed {
            font-size: 0.8rem;
          }
          .max-w-lg {
            max-width: 90%;
          }
          .flex-wrap {
            flex-wrap: wrap;
          }
        }
        @media (max-width: 480px) {
          .text-6xl {
            font-size: 2.5rem;
          }
          .leading-relaxed {
            font-size: 0.75rem;
          }
          .relative {
            width: 200px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
