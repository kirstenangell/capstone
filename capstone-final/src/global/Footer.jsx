function Footer() {
  return (
    <footer className="w-full h-auto bg-gradient-to-b from-gray-900 to-gray-700 text-white flex items-center px-6 py-8 fixed bottom-0 left-0">
      <div className="max-w-screen-xl w-full flex justify-between space-x-12">
        
        {/* Left Section */}
        <div className="w-1/2 pl-20">
          <h2 className="text-lg font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white uppercase">
            FLACKO AUTO PARTS ACCESSORIES AND TRADING
          </h2>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua.
          </p>
        </div>
        
        {/* Center Section */}
        <div className="w-1/3 flex justify-center">
          <div className="flex space-x-12">
            <div className="flex flex-col pl-16 space-y-5 text-center">
              <a href="#about-us" className="text-white text-xs font-light uppercase hover:underline">ABOUT US</a>
              <a href="#services" className="text-white text-xs font-light uppercase hover:underline">SERVICES</a>
              <a href="#products" className="text-white text-xs font-light uppercase hover:underline">PRODUCTS</a>
              <a href="#contact-us" className="text-white text-xs font-light uppercase hover:underline">CONTACT US</a>
            </div>
            <div className="flex flex-col pl-12 space-y-5 text-center">
              <a href="#faqs" className="text-white text-xs font-light uppercase hover:underline">FAQS</a>
              <a href="#terms" className="text-white text-xs font-light uppercase hover:underline">TERMS OF SERVICE</a>
              <a href="#shipping-policy" className="text-white text-xs font-light uppercase hover:underline">SHIPPING POLICY</a>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 text-left pl-16">
          <h2 className="text-lg font-bold mb-4 uppercase">SOCIAL MEDIA</h2>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
