import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FotpInput = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log('Location State:', location.state);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', location.state.email);
        console.log('OTP:', otp);
        // Perform OTP verification with the server
        axios.post('http://localhost:8081/verify-otp2', { email: location.state.email, otp: otp })
            .then((res) => {
                // If OTP verification is successful
                if (res.data.message === 'OTP verified successfully') {
                    // Insert data into the database
                    navigate('/Newpassword', { state: { email: location.state.email } });
                } else {
                    if(res.status===400)
                        console.log('Invalid OTP');
                        setError('Invalid Otp')
                }
            })
            .catch((err) => {
                console.log(err);
                setError('Failed to verify OTP'); 
                toast.error("enter otp doesn't match",{
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000
                });
            });
    };

    useEffect(() => {
        // Clean up the OTP value when the component is unmounted
        return () => {
            setOtp('');
            setError('');
        };
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <ToastContainer/>
  <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <h2 className="text-2xl mb-4">Enter OTP</h2>
    {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
    <form onSubmit={handleOtpSubmit}>
      <div className="mb-4">
        <input
          className="border rounded py-2 px-3"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue"
          type="submit"
        >
          Verify OTP
        </button>
      </div>
    </form>
  </div>
</div>

    );
}

export default FotpInput;