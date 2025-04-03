import React from 'react';
import carImage1 from '../assets/services1.jpeg';
import carImage2 from '../assets/services2.jpeg';
import carImage3 from '../assets/services3.jpg';
import carImage4 from '../assets/services4.jpg';
import carImage5 from '../assets/services5.jpg';
import carImage6 from '../assets/services6.jpg';

const ServiceSection = () => {
  const services = [
    { image: carImage1, title: 'CAR GLASS TINTS', description: 'Provides top-tier glass tints for enhanced privacy and UV protection.' },
    { image: carImage2, title: 'AUDIO SET-UPS', description: 'High-quality audio systems designed to boost your car sound experience.' },
    { image: carImage3, title: 'CAR SEAT COVERS', description: 'Durable and stylish car seat covers for your comfort and style.' },
    { image: carImage4, title: 'CAR COVERS', description: 'Waterproof and dustproof car covers to protect your vehicle in any condition.' },
    { image: carImage5, title: 'AUTOMATIC DOOR CENTRAL LOCKS', description: 'Upgrade your car security with automatic door central locking systems.' },
    { image: carImage6, title: 'TIRES', description: 'Top-of-the-line tires offering durability and performance for all conditions.' },
  ];

  return (
    <div className="min-h-screen pt-[150px] pb-[100px] flex flex-col items-center gap-12 bg-black">
      
      {/* Header */}
      <div className="max-w-[1440px] w-full px-6 lg:px-12 flex flex-col xl:flex-row justify-between items-center text-white gap-8">
        <h1 className="text-[40px] sm:text-[50px] md:text-[60px] lg:text-[70px] font-semibold text-center xl:text-left">
          OUR COMPANY SERVICE
        </h1>
        <p className="text-[16px] sm:text-[17px] font-light max-w-[700px] text-center xl:text-left leading-relaxed">
          At Flacko Auto Parts and Accessories Trading, we are dedicated to providing high-quality car parts and accessories tailored to meet your needs. Our commitment to exceptional service ensures a seamless experience, from browsing our catalog to receiving your order. Whether you're upgrading your vehicle or maintaining its performance, we are here to support you every step of the way.
        </p>
      </div>

      {/* Service Items */}
      <div className="flex flex-col items-center gap-10 w-full px-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative max-w-[1440px] w-full h-[381px] bg-cover bg-center rounded-[10px] overflow-hidden group"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:brightness-50"
              style={{ backgroundImage: `url(${service.image})` }}
            />

            {/* Title (Disappears on Hover) */}
            <div className="absolute bottom-8 left-12 text-white font-poppins text-[45px] font-light transition-opacity duration-500 group-hover:opacity-0">
              {service.title}
            </div>

            {/* Description (Visible on Hover) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="text-white font-poppins text-[30px] font-light text-center px-8">
                {service.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;
