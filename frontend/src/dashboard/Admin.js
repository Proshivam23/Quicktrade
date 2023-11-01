import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const Admin = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);
  const user = cookies.user;
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("products"); // Active tab: "products" or "users"
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
 const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    // Fetch products and users when the component mount
    async function fetchProductsAndUsers() {
      try {
        const productsRes = await axios.get(
          "http://localhost:8081/allproducts"
        );
        const usersRes = await axios.get("http://localhost:8081/allusers");

        if (productsRes.status === 200) {
          setProducts(productsRes.data);
        }

        if (usersRes.status === 200) {
          setUsers(usersRes.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if(!user || user.admin !== "true"){
      toast.error("You are not authorized to view this page", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000, 
      });
      navigate("/");
    }else{
      toast.success("Welcome Admin", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
       });
      fetchProductsAndUsers();
    }
    
    
  }, [user,navigate]);



  const items = activeTab === "products" ? products : users;

  const handleDelete = async (itemId, itemType) => {
    try {
      // Implement the logic to delete an item (product or user) using an API call
      if (itemType === "products") {
        // Make an API call to delete a product by ID
        await axios.delete(`http://localhost:8081/delete-product/${itemId}`);
        toast.success("Deleted product successfully", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } else if (itemType === "users") {
        // Make an API call to delete a user by ID
        await axios.delete(`http://localhost:8081/delete-user/${itemId}`);
        toast.success("Deleted user successfully", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
      setOpen(!open);
      // After successful deletion, update the state to reflect the changes
      if (itemType === "products") {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== itemId)
        );
      } else if (itemType === "users") {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== itemId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex">
      <ToastContainer />
      {/* Left Sidebar */}
      <div className="bg-gray-200 w-1/4 min-h-screen p-4">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
        <ul>
          <li
            className={`mb-2 cursor-pointer ${
              activeTab === "products" ? "font-semibold" : ""
            }`}
            onClick={() => setActiveTab("products")}
          >
            All Products
          </li>
          <li
            className={`mb-2 cursor-pointer ${
              activeTab === "users" ? "font-semibold" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            All Users
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="w-3/4 p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder={`Search ${
              activeTab === "products" ? "Products" : "Users"
            }...`}
            className="px-4 py-2 border rounded-full outline-none focus:ring-2 ring-blue-300 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items
            .filter((item) =>
              activeTab === "products"
                ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
                : item.username
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <div
                key={item.id} // Assuming item has a unique identifier
                className="bg-white p-4 shadow-lg rounded-lg hover:shadow-xl transition duration-300"
              >
                <h2 className="text-lg font-semibold">
                  {activeTab === "products" ? item.title : item.username}
                </h2>
                {activeTab === "products" && (
                  <>
                    <img src={item.image1} className="h-50 w-full object-cover object-center group-hover:opacity-75" />
                    <p className="text-gray-600">{item.description}</p>
                    <p className="text-blue-600 font-bold mt-2">
                      ₹{item.price}
                    </p>
                    <p className="text-gray-500">{item.location}</p>
                  </>
                )}
                {activeTab === "users" && (
                  <>
                    <p className="text-blue-600 font-bold mt-2">{item.email}</p>
                    <p className="text-gray-500">{item.contact_info}</p>
                  </>
                )}
                <Button onClick={handleOpen} variant="gradiant" className="m-0">
                  Delete
                </Button>
                <Dialog open={open} handler={handleOpen}>
                  <DialogHeader>Are you sure?</DialogHeader>
                  <DialogBody>
                    <p>Do you really want to delete?</p>
                  </DialogBody>
                  <DialogFooter>
                    <Button
                      variant="text"
                      color="red"
                      onClick={handleOpen}
                      className="mr-1"
                    >
                      <span>Cancel</span>
                    </Button>
                    <Button
                      variant="gradient"
                      color="green"
                      onClick={() => handleDelete(item.id, activeTab)}
                    >
                      <span>Confirm</span>
                    </Button>
                  </DialogFooter>
                </Dialog>
                {/* <button
                  onClick={() => handleDelete(item.id, activeTab)}
                  className="bg-red-500 text-white py-1 px-3 rounded-full mt-2 hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
