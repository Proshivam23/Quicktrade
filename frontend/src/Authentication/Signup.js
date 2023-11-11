import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Validation from "./SignupValidation";
import { useState } from "react";
import Navbar from '../Navbar'
import image from 'C:/Users/GAJ/Desktop/Project/vs_push/Quicktrade/frontend/src/img/bg1.jpg'


async function checkEmailExists(email) {
    try {
        const response = await axios.post('http://localhost:8081/check-email', { email });
        return response.data;
    } catch (error) {
        console.error(error);
        return { exists: false };
    }
}

const Signup = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        name: '',
        password: '',
        confirmpassword: ''

    });

    const [loading, setloading] = useState(false);


    const [error, setErrors] = useState({});


    const handleInput = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    };

    const handleSendOtp = (e) => {
        e.preventDefault();

        // Validate form fields before sending OTP
        const err = Validation(values);
        setErrors(err);

        if (err.name === " " && err.email === " " && err.password === " " && err.confirmpassword === " ") {
            console.log("hello ");
            checkEmailExists(values.email)
                .then(emailExistsResponse => {
                    if (emailExistsResponse.exists) {
                        // Email exists, set error and return
                        setErrors(prevErrors => ({
                            ...prevErrors,
                            email: "Email already exists"
                        }));
                    } else {
                        // Send OTP request to the server
                        setloading(true);
                        axios.post('http://localhost:8081/send-otp', { email: values.email })
                            .then((res) => {
                                console.log(res.data);
                                setloading(false);
                                navigate('/Otpinput', { state: values }); // Navigate and pass values as state
                            })
                            .catch((err) => console.log(err));
                    }
                });
        }
    };

    return (
        <div>
            <Navbar />
            <div className="grid grid-cols-2">
            <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
                <div className='d-flex justify-content-center align-items-center bg-light bg-gradient-to-t vh-100 mt-0'>
                    <div className='bg-white p-4 shadow-lg rounded-lg w-80 w-md-50 '>
                        <div>
                            <h2 className=" mb-0 font-bold">Sign Up</h2>
                            <p className=" text-fig">Create an account,</p>
                        </div>

                        <form onSubmit={handleSendOtp}>
                            <div className='mb-4'>
                                <input onChange={handleInput} type="text" name="name" placeholder='Enter name' className='form-control shadow-md !placeholder-fig rounded-3' />
                                <span>{error.name && <span className='text-danger'>{error.name}</span>}</span>
                            </div>
                            <div className='mb-4'>
                                <input onChange={handleInput} name="email" type="email" placeholder='Enter email' className='form-control shadow-md !placeholder-fig rounded-3' />
                                <span>{error.email && <span className='text-danger'>{error.email}</span>}</span>
                            </div>
                            <div className='mb-4'>
                                <input onChange={handleInput} name="password" type="password" placeholder='Enter Password' className='form-control shadow-md !placeholder-fig rounded-3' />
                                <span>{error.password && <span className='text-danger'>{error.password}</span>}</span>
                            </div>
                            <div className='mb-4'>
                                <input onChange={handleInput} name="confirmpassword" type="password" placeholder='Confirm password' className='form-control shadow-md !placeholder-fig rounded-3' />
                                <span>{error.confirmpassword && <span className='text-danger'>{error.confirmpassword}</span>}</span>
                            </div>
                            <button
                                type='submit'
                                className='bg-but text-white p-2 rounded-lg w-100 text-decoration-none mb-2 mt-2 transform hover:scale-105 transition ease-out duration-300 '
                                disabled={loading} // Disable the button when loading
                            >
                                {loading ? 'Loading...' : 'Sign up'}
                            </button>


                            <div className='text-center mt-3'>
                                <span className='text-fig text-base font-bold'>Already have an account? <Link to='/' className='text-decoration-none font-medium  text-but'>Sign in</Link></span>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Signup;