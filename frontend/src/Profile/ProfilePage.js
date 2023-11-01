import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["user"]);
  const initialUser = cookies.user;
  const [profile_pic, setProfilePic] = useState(null);
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    console.log(file);
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("profile_pic", profile_pic);
    formData.append("username", user.username);
    formData.append("number", user.number);
    formData.append("id", user.id); // Assuming you have an ID field for identifying the user

    try {
      const response = await axios.post(
        "http://localhost:8081/update-data",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded successfully", response.data);
      // You can choose to update the user data in cookies with the new values here if needed

      navigate("/");
    } catch (error) {
      console.log("Error uploading file", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96 md:w-3/4 p-6">
        <div className="text-sm text-gray-500 mb-2">Edit your details</div>
        <div className="flex items-center justify-between">
          <Typography size="xl" color="indigo" className="mb-2">
            Profile
          </Typography>
        </div>

        <div className="flex items-center justify-between mb-4">
          <input
            type="file"
            id="fileInput"
            onChange={handleImageChange}
            accept="image/*"
          />
          <img
            src={user.profile_pic}
            alt="Profile"
            className="w-14 h-14 bg-gray-300 rounded-full"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="fullName" className="text-indigo-600 block mb-2">
            Full Name
          </label>
          <Input
            type="text"
            color="indigo"
            id="fullName"
            name="username"
            value={user.username}
            placeholder="Full Name"
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="text-indigo-600 block mb-2">
            Email
          </label>
          <Input
            type="email"
            color="indigo"
            id="email"
            name="email"
            value={user.email}
            placeholder="Email"
            readOnly // Prevent editing email
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phoneNumber" className="text-indigo-600 block mb-2">
            Phone Number
          </label>
          <Input
            type="tel"
            color="indigo"
            id="phoneNumber"
            name="number"
            value={user.number}
            placeholder="Phone Number"
            onChange={handleInputChange}
          />
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div className="flex items-center justify-between mb-4">
          <Button color="green" size="sm" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
