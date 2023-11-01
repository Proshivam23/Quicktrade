import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
const AddProduct = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);
  const user = cookies.user;
  const location = useLocation();
  const autocompleteRef = useRef(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
 

  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    location: "", // Location field
    images: [],
  });
  const [suggestions, setSuggestions] = useState([]); // Suggestions for location
 
  useEffect(() => {
    if (!user) {
      
      navigate("/");
      toast.error("Please login to add product", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000, // Close the toast after 2 seconds
      });
    }
  }, [user, navigate]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, images: files });
  };

  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    setProduct({ ...product, location: inputValue });

    // Check if the input is empty
    if (inputValue === "") {
      setSuggestions([]);
      return;
    }

    const apiKey = "9f9d7710983d4ad4b9672d305f97be02";
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&apiKey=${apiKey}`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      setSuggestions(data.features);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setProduct({ ...product, location: suggestion.properties.formatted });
    setSuggestions([]);
    const latitude1 = suggestion.properties.lat;
    const longitude1 = suggestion.properties.lon;
    setLatitude(latitude1);
    setLongitude(longitude1);
    console.log("Selected Location:", suggestion.properties.formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(latitude);
    console.log(longitude);
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("category", product.category);
    formData.append("location", product.location);
    formData.append("seller_id", user.id);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    product.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      const response = await axios.post(
        "http://localhost:8081/addpdt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Product added successfully", response.data);

      navigate("/Home");
    } catch (error) {
      console.error("Error adding product", error);
    }
  };
  const categories = ["Electronics", "Clothing", "Books", "Furniture", "Toys" ,"Stationary"];
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="title"
                onChange={handleInput}
                value={product.title}
                id="title"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Price:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="price"
                onChange={handleInput}
                value={product.price}
                id="price"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="category"
              >
                Category:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="category"
                onChange={handleInput}
                value={product.category}
                id="category"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2 ">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="location"
              >
                Location:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                name="location"
                onChange={handleInputChange}
                value={product.location}
                id="location"
                ref={autocompleteRef}
              />
              {product.location !== "" && suggestions.length > 0 && (
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
            <div className="mb-2 col-span-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description:
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="description"
                onChange={handleInput}
                value={product.description}
                id="description"
                rows="4"
              />
            </div>
            <div className="mb-2 col-span-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="images"
              >
                Images:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="file"
                multiple
                accept=".jpg, .jpeg, .png"
                onChange={handleImageUpload}
                id="images"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
