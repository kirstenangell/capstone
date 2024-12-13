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
          We process and ship orders promptly to ensure timely delivery. We process and ship orders during our business hours, which are from 8:00 AM to 6:00 PM, Monday to Saturday. Orders placed outside these hours or on Sundays will be processed on the next business day. Please note that delivery times may vary based on your location and the availability of the items.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Shipping Costs</h2>
          <p className="mb-10">
          Shipping costs vary on the courier service you have selected. It may also base on the weight, size, and destination of your order. During checkout, the exact shipping fee will be displayed, ensuring transparency and convenience for our customers.
          </p>

          <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
          <p className="mb-10">
          We are pleased to offer international shipping to select locations. Additional fees and customs charges may apply based on the destination. Please contact us for more information or specific inquiries about international deliveries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
