import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EachProdPage from "../ProdPage/EachPodPage";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
  button,
} from "@material-tailwind/react";
import PriceFilter from "../components/PriceFilter";

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const user = cookies.user;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [suggestionSelected, setSuggestionSelected] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!user);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(null);
  const handleCategorySelect = (category) => {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.filter((c) => c !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
  };

  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);

  const togglePriceDropdown = () => {
    setIsPriceDropdownOpen(!isPriceDropdownOpen);
  };

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const filterProductsByPrice = (product) => {
    return product.price >= minPrice && product.price <= maxPrice;
  };

  const handleLogOut = () => {
    removeCookie("user", { path: "/", domain: "localhost" }); // Clear the user cookie
    toast.success("Logged out successfully", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });

    navigate("/"); // Navigate to the home page
  };

  const getUniqueCategories = (products) => {
    const categories = new Set();
    products.forEach((product) => {
      categories.add(product.category);
    });
    return Array.from(categories);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsCategoryDropdownOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:8081/allproducts");
        if (res.status === 200) {
          setProducts(res.data);
          console.log(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchData();

  }, []);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await axios.get(
          `http://localhost:8081/favorites/${user.id}`
        );
        if (res.status === 200) {
          setFavorites(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchFavorites();
  }, [favorites]);

  const fetchLocationSuggestions = async (text) => {
    if (text.trim() !== "") {
      const apiKey = "9f9d7710983d4ad4b9672d305f97be02";
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&apiKey=${apiKey}`;

      try {
        const response = await axios.get(url);
        const data = response.data;
        setLocationSuggestions(data.features);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    }
  };

  const handleInput = (e) => {
    const text = e.target.value;
    setSearchQuery(text);
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
    setSuggestionSelected(false);
  };

  const handleLocationInputChange = (e) => {
    const text = e.target.value;
    setSelectedLocation(text);
    fetchLocationSuggestions(text);
  };

  const handleLocationSuggestionClick = (suggestion) => {
    setSelectedLocation(suggestion.properties.formatted);
    setSuggestionSelected(true);
    setLocationSuggestions([]); // Clear location suggestions to collapse the box
  };

  const filterProducts = (products) => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory.length === 0 ||
        selectedCategory.includes(product.category);

      const matchesSearch =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        !suggestionSelected || product.location.includes(selectedLocation);
      const isSold = product.sold === 0;
      const active = product.active === 1;
      return matchesCategory && matchesSearch && matchesLocation && isSold && active;
    });
  };
  //favorite clicks
  const isProductFavorite = (productId) => {
    return (
      favorites &&
      favorites.some((favorite) => favorite.product_id === productId)
    );
    // return favorites && favorites.includes(productId);
  };

  const handleFavorite = async (productId) => {
    if (!user) {
      toast.error("log in to add favorites", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    } else {
      try {
        await axios.post("http://localhost:8081/addfav", {
          userId: user.id,
          productId,
        });
        setFavorites((prevFavorites) => [...prevFavorites, productId]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUnFavorite = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8081/delfav/${user.id}/${productId}`
      );
      setFavorites((prevFavorites) =>
        prevFavorites.filter((id) => id !== productId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-blue-400">
      
      <ToastContainer />
      <div className="bg-blue-300 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex flex-auto">
            <img src="store.png" alt="store" className="h-5 w-5" />
            <a
              href="#"
              className="text-lg font-semibold text-gray-900 no-underline hover:text-blue-600 ml-2 "
            >
              Quick Trade
            </a>
          </div>

          <div className="hidden md:flex relative">
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="border border-gray-300 rounded-md px-4 py-2 mr-4 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter location"
                onInput={handleLocationInputChange}
                value={selectedLocation}
              />
              {locationSuggestions.length > 0 && (
                <div
                  className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-full"
                  style={{ top: "100%", zIndex: 999 }}
                >
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                      onClick={() => handleLocationSuggestionClick(suggestion)}
                    >
                      {suggestion.properties.formatted}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Link to="/AddProduct">
              <button
                className="bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                onClick={handleSearchClick}
              >
                Sell Products
              </button>
            </Link>

            {loggedIn ? (
              <div className="relative group inline-block text-gray-600 ml-4">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={user.profile_pic}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                {isUserDropdownOpen && (
                  <div
                    className="p-2 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                  >
                    <div className="bg-blue-400 flex justify-center rounded-xl py-1 items-center" role="none">
                      <p className="  text-black items-center m-auto">
                        Welcome {user.username}
                      </p>
                    </div>
                    <div className="py-1 font-bold" role="none">
                      <Link
                        to="/profile"
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        Account settings
                      </Link>
                      <Link
                        to="/purchase"
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-1"
                      >
                        Purchases
                      </Link>
                      <Link
                        to="/favourites"
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-1"
                      >
                        Favourites
                      </Link>
                      <Link
                        to={`/listed`}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-2"
                      >
                        Listed Items
                      </Link>
                      <Link
                        to={`/chat`}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-2"
                      >
                        Chat
                      </Link>
                      <button
                        type="submit"
                        className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-3"
                        onClick={handleLogOut}
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative group inline-block text-gray-600 ml-4">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src="user.png"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      <p className="text-gray-700 block px-4 py-2 text-sm">
                        Sign in to view
                      </p>
                      <Link
                        to="/"
                        className="text-gray-700 block w-full px-4 py-2 text-left text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-3"
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className=" border-b border-gray-300 py-4 relative">
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                className="border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Search for products"
                onInput={handleInput}
              />
              <button
                className="absolute right-0 top-0 h-full w-8  bg-gray-100 text-white rounded-r-md flex items-center justify-center"
                onClick={handleSearchClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 101 101"
                  id="search"
                >
                  <path d="M63.3 59.9c3.8-4.6 6.2-10.5 6.2-17 0-14.6-11.9-26.5-26.5-26.5S16.5 28.3 16.5 42.9 28.4 69.4 43 69.4c6.4 0 12.4-2.3 17-6.2l20.6 20.6c.5.5 1.1.7 1.7.7.6 0 1.2-.2 1.7-.7.9-.9.9-2.5 0-3.4L63.3 59.9zm-20.4 4.7c-12 0-21.7-9.7-21.7-21.7s9.7-21.7 21.7-21.7 21.7 9.7 21.7 21.7-9.7 21.7-21.7 21.7z"></path>
                </svg>
              </button>
            </div>
            <div className="flex justify-center ml-20">
              <img src="category.png" alt="" className="h-6 w-6" />
              <button
                onClick={toggleCategoryDropdown}
                className=" text-gray-700 focus:outline-none hover:text-blue-600 "
              >
                Shop by Category
              </button>
              {isCategoryDropdownOpen && (
                <div
                  className="absolute left-auto top-20 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="menu-button"
                  tabIndex="-1"
                >
                  <div className="py-1" role="none">
                    {getUniqueCategories(products).map((category, index) => (
                      <label
                        key={index}
                        className="px-4 py-2 text-sm flex items-center"
                      >
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedCategory.includes(category)}
                          onChange={() => handleCategorySelect(category)}
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="ml-10">
              <PriceFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                handleMinPriceChange={handleMinPriceChange}
                handleMaxPriceChange={handleMaxPriceChange}
                togglePriceDropdown={togglePriceDropdown}
                isPriceDropdownOpen={isPriceDropdownOpen}
              />
            </div>
          </div>
        </div>
      </div>

      {products && (
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Products</h2>

            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {filterProducts(products)
                .filter(filterProductsByPrice)
                .map((product) => (
                  <div key={product.id} className="p-2 rounded-2xl hover:bg-blue-500 border-2 border-blue-600">
                    <Link
                      to={`./eachprodpage/${product.id}`}
                      className="group no-underline"
                    >
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                        <div>
                          <img
                            src={product.image1}
                            alt={product.imageAlt}
                            className="h-full w-full object-cover object-center group-hover:opacity-75"
                          />
                        </div>
                      </div>
                      <h3 className="mt-4 text-sm text-gray-700">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        ₹{product.price}
                      </p>
                    </Link>
                    <div className=" flex justify-between">
                      <p className="text-md font-medium text-gray-600">
                        {product.location}
                      </p>
                      {isProductFavorite(product.id) ? (
                        <div>
                          <button
                            onClick={() => {
                              handleUnFavorite(product.id);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 512 512"
                            >
                              <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            onClick={() => {
                              handleFavorite(product.id);
                            }}
                            className="hover scale-110 transition ease-out duration-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="1em"
                              viewBox="0 0 512 512"
                            >
                              <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Home;
