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
    <div className="relative w-full min-h-screen overflow-hidden pt-[120px] flex items-center justify-center">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${background.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col xl:flex-row items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1440px] w-full space-y-12 xl:space-y-0 xl:space-x-12">
        {/* Text Content */}
        <div className="text-white max-w-lg flex flex-col justify-center text-center xl:text-left">
          <h1 className="font-bold mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-[64px]">
            {background.title}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            {background.text}
          </p>
        </div>

        {/* Scrollable Boxes */}
        <div
          className="flex space-x-6 overflow-x-auto scrollbar-hide px-2"
          style={{
            height: '450px',
            scrollSnapType: 'x mandatory',
          }}
        >
          {boxes.map((box) => (
            <div
              key={box.id}
              onClick={() => handleBoxClick(box)}
              className="cursor-pointer relative transition-all duration-300 ease-in-out shrink-0 snap-start"
              style={{
                width: '330px',
                height: background.title === box.title ? '400px' : '350px',
                backgroundImage: `url(${box.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '25px',
                opacity: 1,
              }}
            >
              <div
                className="absolute bottom-4 left-8 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-extralight"
                style={{ zIndex: 2 }}
              >
                {box.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
