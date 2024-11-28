import React, { useState, useContext, useEffect } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import tweeterImage from '../assets/tweeterImage.webp'; // Replace with the path to your image
import { ProductContext } from '../context/ProductContext';

const Tweeter = () => {
  const { products } = useContext(ProductContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ensure all products display by default
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const searchResults = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(searchResults);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilter = (type) => {
    let sortedProducts = [];
    switch (type) {
      case 'A-Z':
        sortedProducts = [...filteredProducts].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      case 'Z-A':
        sortedProducts = [...filteredProducts].sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;
      case 'Price ↑':
        sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
        break;
      case 'Price ↓':
        sortedProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
        break;
      default:
        sortedProducts = filteredProducts;
    }
    setFilteredProducts(sortedProducts);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="relative w-full h-[700px] bg-no-repeat bg-center bg-cover">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-no-repeat bg-center bg-cover"
            style={{ backgroundImage: `url(${tweeterImage})`, opacity: 0.2, zIndex: -1 }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <h1 className="text-4xl font-bold">Tweeter</h1>
          <p className="mt-4 text-lg text-gray-400">
            Lorem Ipsum blah blah blah
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative mt-10 px-6 md:px-12 lg:px-64">
        <form onSubmit={handleSearch} className="flex items-center space-x-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="italic w-full bg-black text-white py-2 pl-10 pr-4 rounded-md focus:outline-none placeholder-gray-500 bg-opacity-75 border border-gray-700 shadow-none"
            />
          </div>
          <button
            type="button"
            onClick={toggleDropdown}
            className="italic bg-black text-white py-2 px-4 rounded-md flex items-center space-x-2 focus:outline-none border border-gray-700 shadow-none"
          >
            Filter <FaChevronDown />
          </button>
        </form>

        {isDropdownOpen && (
          <div className="absolute right-64 mt-2 w-46 bg-black text-white rounded-md shadow-lg border border-cyan-900 shadow-cyan-900/50 z-10">
            <ul className="py-2">
              <li
                onClick={() => handleFilter('A-Z')}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Alphabetical (A-Z)
              </li>
              <li
                onClick={() => handleFilter('Z-A')}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Alphabetical (Z-A)
              </li>
              <li
                onClick={() => handleFilter('Price ↑')}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Price ↑
              </li>
              <li
                onClick={() => handleFilter('Price ↓')}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                Price ↓
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Product List */}
      <div className="relative mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 lg:px-24">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gradient-to-t from-[#000000] to-[#62B1D4]/[0.2] rounded-lg p-4 shadow-lg cursor-pointer"
            >
              <div className="w-full h-80 rounded-t-lg flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain h-full rounded-md"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-sm font-light italic text-gray-400">LOREM IPSUM</h2>
                <p className="text-lg font-bold text-white mt-1">{product.name}</p>
                <p className="text-lg font-semibold text-gray-400 mt-1">
                  PHP {product.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="italic text-gray-400 text-center col-span-full">
            No products found matching your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Tweeter;
