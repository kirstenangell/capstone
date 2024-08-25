import React from 'react';
import Sidebar from './Sidebar'; // Ensure Sidebar is imported

const Shipping = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar /> 

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="max-w-3xl w-full text-left mb-12">
          <h1 className="text-left text-3xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-left text-lg mb-4">
            Learn more about our shipping process, including delivery times and shipping costs.
          </p>
        </div>
        
        <div className="max-w-3xl w-full text-left">
          <h2 className="text-2xl font-semibold mb-4">Shipping Times</h2>
          <p className="mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla neque quam, maximus in sagittis quis, sollicitudin non nisi.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Shipping Costs</h2>
          <p className="mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla neque quam, maximus in sagittis quis, sollicitudin non nisi.
          </p>

          <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
          <p className="mb-10">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla neque quam, maximus in sagittis quis, sollicitudin non nisi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
