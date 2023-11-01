import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import validation from './ForgotValidation';
import axios from 'axios';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

async function checkEmailExists(email) {
    try {
        const response = await axios.post('http://localhost:8081/check-email', { email });
        return response.data;
    } catch (error) {
        console.error(error);
        return { exists: false };
    }
}


const Forgot = () => {
    
    const navigate = useNavigate();
    const [values,setValues] = useState({
        email: ''
    });

    const [error,setErrors] = useState({

    });

    const handleInput = (e)=>{
        setValues(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        const err= validation(values);
        setErrors(err);
        if(err.email === ""){
            checkEmailExists(values.email)
            .then(emailExistsResponse => {
                if (emailExistsResponse.exists === false) {
                    // Email exists, set error and return
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        email: "Email doesn't exists"
                    }));
                    toast.error("email doesn't exists",{
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    })
                } else {
                    // Send OTP request to the server
                       
                        axios.post('http://localhost:8081/send-otp', { email: values.email })
                            .then(async (res) => {
                                console.log(res.data);
                                toast.success("otp Sent to the entered email",{
                                    position: toast.POSITION.TOP_CENTER,
                                    autoClose: 2000
                                });
                                await new Promise((resolve)=>setTimeout(resolve,2000));
                                navigate('/Fotpinput', { state: values }); // Navigate and pass values as state
                            })
                            .catch((err) => console.log(err));
                    }
                });
        }

    }

    
    return (
        <div className="bg-light flex justify-center items-center h-screen">
            <ToastContainer/>
            <div className="bg-white p-6 rounded-lg shadow-md  w-80">
                <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            type="email"
                            onChange={handleInput}
                            placeholder="Enter your email"
                            name='email'
                        />
                       {/* <span>{error.email && <span className='text-danger'>{error.email}</span>}</span> */}
                    </div>
                    <div className="text-center">
                        <button
                            className="bg-but transform hover:scale-105 transition ease-out text-white font-bold py-2 px-4 rounded-full"
                            type="submit"
                        >
                            Verify Email
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Forgot;
