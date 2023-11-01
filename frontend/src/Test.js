import React, { useState } from 'react';

const Test = () => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setLocation(inputValue);

    // Check if the input is empty
    if (inputValue === '') {
      setSuggestions([]);
      return;
    }

    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&apiKey=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.features);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocation(suggestion.properties.formatted);
    setSuggestions([]);
    setSelectedLocation(suggestion.properties.formatted);
    console.log('Selected Location:', suggestion.properties.formatted);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
        Location:
      </label>
      <div className="relative">
        <input
          type="text"
          id="location"
          value={location}
          onChange={handleInputChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {location !== '' && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.properties.osm_id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {suggestion.properties.formatted}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Test;