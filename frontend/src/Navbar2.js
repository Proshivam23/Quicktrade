import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import EachProdPage from "./ProdPage/EachPodPage";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
  button,
} from "@material-tailwind/react";
import PriceFilter from "./components/PriceFilter";
const Navbar2 = () => {
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

    const handleFocus = ()=>{
        navigate('/Home')
    }  
  
    const handleLogOut = () => {
      removeCookie("user", { path: "/", domain: "localhost" }); // Clear the user cookie
      toast.success("Logged out successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
  
      navigate("/"); // Navigate to the home page
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
  

    return (<div className="bg-blue-300">
        <div className=" max-w-screen-xl mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex flex-auto">
                <img src="store.png" alt="store" className="h-5 w-5" />
                <a
                    href="#"
                    className="text-lg font-cursive font-semibold text-blue-600 no-underline hover:text-blue-900 ml-2 "
                >
                    Quick Trade
                </a>
            </div>

            <div className="hidden md:flex relative">
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        onFocus={handleFocus}
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


    </div>);
}

export default Navbar2;