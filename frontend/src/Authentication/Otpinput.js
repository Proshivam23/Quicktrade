import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpInput = () => {
    const location = useLocation();
    const navigate = useNavigate();
    console.log('Location State:', location.state);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', location.state.email);
        console.log('OTP:', otp);
        const values= {
          email: location.state.email,
          username: location.state.name,
        }
        // Perform OTP verification with the server
        axios.post('http://localhost:8081/verify-otp', { email: location.state.email, otp: otp })
            .then((res) => {
                // If OTP verification is successful
                if (res.data.message === 'OTP verified successfully') {
                    // Insert data into the database
                    axios.post('http://localhost:8081/signup', location.state)
                        .then((res) => {
                            console.log(res.data);
                            navigate('/pfp',{state: values}); // Redirect after successful registration
                        })
                        .catch((err) => console.log(err));
                } else {
                    console.log('Invalid OTP');
                }
            })
               .catch((err) => {
                    console.log(err);
                    setError('Invalid OTP try again'); 
            });
    };

    useEffect(() => {
        
        return () => {
            setOtp('');
            setError('');
        };
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen">
  <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <h2 className="text-2xl mb-4">Enter OTP</h2>
    {error && <p className="text-red-500 mb-4">{error}</p>}
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

export default OtpInput;