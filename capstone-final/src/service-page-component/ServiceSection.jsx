import React from 'react';
import carImage1 from '../assets/services1.jpeg';
import carImage2 from '../assets/services2.jpeg';
import carImage3 from '../assets/services3.jpg';
import carImage4 from '../assets/services4.jpg';
import carImage5 from '../assets/services5.jpg';
import carImage6 from '../assets/services6.jpg';

const ServiceSection = () => {
  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center gap-4 pb-[100px]">
      {/* Top Rectangle with Text */}
      <div className="w-[1488px] h-[381px] flex justify-between items-center p-8">
        <div className="text-white text-[70px] font-semibold">
          OUR COMPANY SERVICE
        </div>
        <div className="text-white text-[17px] font-light max-w-[700px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla neque quam, maximus in sagittis quis, sollicitudin non nisi. Mauris aliquet, dolor eget laoreet.
        </div>
      </div>

      {/* Rectangle 1 */}
      <div className="relative w-[1488px] h-[381px] bg-cover bg-center rounded-[10px] overflow-hidden group">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${carImage1})` }} />
        <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-0 transition-opacity duration-300" />
        <div className="absolute bottom-8 left-12 text-white font-poppins text-[45px] font-light">
          CAR GLASS TINTS
        </div>
      </div>

      {/* Rectangle 2 */}
      <div className="relative w-[1488px] h-[381px] bg-cover bg-center rounded-[10px] overflow-hidden group">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${carImage2})` }} />
        <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-0 transition-opacity duration-300" />
        <div className="absolute bottom-8 left-12 text-white font-poppins text-[45px] font-light">
          AUDIO SET-UPS
        </div>
      </div>

      {/* Rectangle 3 */}
      <div className="relative w-[1488px] h-[381px] bg-cover bg-center rounded-[10px] overflow-hidden group">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${carImage3})` }} />
        <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-0 transition-opacity duration-300" />
        <div className="absolute bottom-8 left-12 text-white font-poppins text-[45px] font-light">
          CAR SEAT COVERS
        </div>
      </div>

      {/* Rectangle 4 */}
      <div className="relative w-[1488px] h-[381px] bg-cover bg-center rounded-[10px] overflow-hidden group">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${carImage4})` }} />
        <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-0 transition-opacity duration-300" />
        <div className="absolute bottom-8 left-12 text-white font-poppins text-[45px] font-light">
          CAR COVERS (WATER PROOF / DUST PROOF)
        </div>
      </div>

      {/* Rectangle 5 */}
      <div className="relative w-[1488px] h-[381px] bg-cover bg-center rounded-[10px] overflow-hidden group">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${carImage5})` }} />
        <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-0 transition-opacity duration-300" />
        <div className="absolute bottom-8 left-12 text-white font-poppins text-[45px] font-light">
          AUTOMATIC DOOR CENTRAL LOCKS
        </div>
      </div>

      {/* Rectangle 6 */}
      <div className="relative w-[1488px] h-[381px] bg-cover bg-center rounded-[10px] overflow-hidden group">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${carImage6})` }} />
        <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-0 transition-opacity duration-300" />
        <div className="absolute bottom-8 left-12 text-white font-poppins text-[45px] font-light">
          TIRES
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
