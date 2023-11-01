import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ProfilePictureUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({}); // State for error messages
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Function to handle phone number input change
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Function to handle form submission
  const handleUpload = async () => {
    // Reset previous error messages
    setErrors({});

    // Check for empty fields
    if (!selectedFile) {
      setErrors({ file: 'File cannot be empty' });
      return;
    }

    if (!phoneNumber) {
      setErrors({ phoneNumber: 'Phone number cannot be empty' });
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);
    formData.append('email', location.state.email);
    formData.append('password', location.state.password);
    formData.append('phoneNumber', phoneNumber);

    try {
      const response = await axios.post('http://localhost:8081/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  return (
    <div className="bg-light flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md">
        <div className="text-center">
          <img src="/logo192.png" alt="Profile Icon" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Upload Profile Picture</h2>
        </div>
        <div className="mt-4">
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleFileChange}
            className="border p-2 w-full"
            name="profilePicture"
          />
          {errors.file && <p className="text-red-500">{errors.file}</p>}
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="border p-2 w-full"
            name="phoneNumber"
          />
          {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber}</p>}
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
