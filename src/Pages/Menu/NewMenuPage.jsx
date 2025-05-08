import React, { useState } from "react";
import menu_one from "../../assets/Images/menu_one.jpeg";
import menu_two from "../../assets/Images/menu_two.jpeg";
import { AiOutlineClose, AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // Importing icons

const menuImages = [menu_one, menu_two];

const NewMenuPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handlePrev = () => {
    setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : menuImages.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex < menuImages.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      {menuImages.map((src, index) => (
        <div key={index} className="overflow-hidden rounded-lg">
          <img
            src={src}
            alt={`menu-item-${index}`}
            className="w-full lg:h-[520px] h-auto cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => setSelectedIndex(index)}
          />
        </div>
      ))}

      {/* Fullscreen Image View */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-6 md:p-8">
          {/* Close Button */}
          <button
            className="absolute top-5 right-5 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-300 transition"
            onClick={() => setSelectedIndex(null)}
          >
            <AiOutlineClose size={24} className="text-mainColor"/>
          </button>

          {/* Previous Button */}
          <button
            className="absolute left-1 xl:left-24 bg-white text-black p-1 rounded-full shadow-lg hover:bg-gray-300 transition"
            onClick={handlePrev}
          >
            <AiOutlineLeft size={20} className="text-mainColor" />
          </button>

          {/* Display Image */}
          <img src={menuImages[selectedIndex]} className="max-w-full max-h-full rounded-lg" alt="Enlarged" />

          {/* Next Button */}
          <button
            className="absolute right-1 xl:right-24 bg-white text-black p-1 rounded-full shadow-lg hover:bg-gray-300 transition"
            onClick={handleNext}
          >
            <AiOutlineRight size={20} className="text-mainColor"/>
          </button>
        </div>
      )}
    </div>
  );
};

export default NewMenuPage;
