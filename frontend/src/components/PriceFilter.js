import React from "react";

const PriceFilter = ({
  minPrice,
  maxPrice,
  handleMinPriceChange,
  handleMaxPriceChange,
  togglePriceDropdown,
  isPriceDropdownOpen,
}) => {
  return (
    <div className="flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <button
        onClick={togglePriceDropdown}
        className="text-gray-700 focus:outline-none"
      >
        Filter by Price
      </button>
      {isPriceDropdownOpen && (
        <div
          className="absolute left-auto mt-2 w-48 top-16 z-10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="px-4 py-2">
            <label className="block text-gray-600">Min Price:</label>
            <input
              type="number"
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
          </div>
          <div className="px-4 py-2">
            <label className="block text-gray-600">Max Price:</label>
            <input
              type="number"
              className="border border-gray-300 rounded-md px-2 py-1 w-full"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
