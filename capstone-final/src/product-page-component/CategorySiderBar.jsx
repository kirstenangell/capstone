import React from 'react';

const categories = [
  "Automotive",
  "Air Fresheners",
  "Auto Parts",
  "Car Electronics",
  "Dash Cam",
  "Exterior Accessories",
  "Interior Accessories",
  "Oil & Chemicals",
  "Performance",
  "Tires",
  "Tools & Equipment"
];

const CategorySidebar = () => {
  return (
    <div className="relative min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <div
        className="absolute inset-y-0 left-0 w-16 bg-black opacity-0 hover:opacity-100 hover:w-64 transition-all duration-300 ease-in-out group h-full"
      >
        <div className="p-6 h-full">
          {/* Categories Header */}
          <h2 className="text-xl font-semibold mb-4 relative">
            Categories
            <span className="absolute left-0 bottom-[-6px] w-full h-0.5 bg-gradient-to-r from-[#335C6E] to-[#62B1D4]"></span>
          </h2>
          <ul className="space-y-4">
            {categories.map((category, index) => (
              <li
                key={index}
                className="text-lg hover:bg-gradient-to-r from-[#335C6E] to-[#62B1D4] p-2 rounded cursor-pointer"
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-16 flex-1 p-6">
        <h1 className="text-3xl font-semibold text-white">Main Content Area</h1>
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default CategorySidebar;
