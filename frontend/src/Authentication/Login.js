import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";
import Navbar from "../Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from 'D:/USER DATA/Downloads/Quick/New/frontend/src/img/bg1.jpg'

import { useCookies } from "react-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setErrors] = useState({});

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = Validation(values);
    setErrors(err);

    if (err.email === " " && err.password === " ") {
      try {
        const res = await axios.post("http://localhost:8081/login", values);
        if (res.status === 200) {
          setCookie("user", res.data);
          toast.success("Login successful", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000, // Close the toast after 2 seconds
          });

          // Wait for 2 seconds before navigating
          await new Promise((resolve) => setTimeout(resolve, 2300));
          if (res.data.admin === "true") {
            navigate("/dashboard");
          } else {
            navigate("/Home");
          }
        }
      } catch (error) {
        toast.error("Login failed! No record", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000, // Close the toast after 2 seconds
        });
      }

      //   .then(async (res) => {
      //     if(res.status === 200){
      //         setCookie('user', res.data);
      //         toast.success("Login successful", {
      //             position: toast.POSITION.TOP_CENTER,
      //             autoClose: 2000, // Close the toast after 2 seconds
      //           });

      //           // Wait for 2 seconds before navigating
      //           await new Promise((resolve) => setTimeout(resolve, 2300));

      //           // Navigate to /Home
      //           navigate('/Home');
      //     }else if(res.status === 400){
      //         // toast.error("Login failed! No record", {
      //         //     position: toast.POSITION.TOP_CENTER,
      //         //     autoClose: 2000, // Close the toast after 2 seconds
      //         //   });
      //         alert("now");
      //     }else{
      //         toast.error("Login failed!", {
      //             position: toast.POSITION.TOP_CENTER,
      //             autoClose: 2000, // Close the toast after 2 seconds
      //           });
      //     }

      // })
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="grid grid-cols-2">
        <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
        <div className="d-flex justify-content-center align-items-center bg-light bg-gradient-to-t vh-100 ">
          <div className="bg-white p-4 shadow-lg rounded-lg w-80 w-md-50 ">
            <div>
              <h2 className=" mb-0 font-bold">Log in</h2>
              <p className=" text-fig">Welcome back,</p>
            </div>

            <form action="" onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  onChange={handleInput}
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  className="form-control shadow-md !placeholder-fig rounded-3"
                />
                <span>
                  {error.email && (
                    <span className="text-danger">{error.email}</span>
                  )}
                </span>
              </div>
              <div className="mb-4">
                <input
                  onChange={handleInput}
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  className="form-control shadow-md !placeholder-fig rounded-3"
                />
                <span>
                  {error.password && (
                    <span className="text-danger">{error.password}</span>
                  )}
                </span>
              </div>
              <div className="mb-2 mt-2">
                <button
                  type="submit"
                  className="bg-but text-white text-sm p-2 font-bold rounded-lg w-100 text-decoration-none  transform hover:scale-105 transition ease-out duration-300 "
                >
                  sign in
                </button>
                <Link
                  to="/Forgot"
                  className="text-right text-sm text-but font-medium text-decoration-none mt"
                >
                  <p>forgot password?</p>
                </Link>
              </div>

              <div className="text-center">
                <span className="text-fig text-base font-bold">
                  Dont have an account?{" "}
                  <Link
                    to="/Signup"
                    className="text-decoration-none font-medium  text-but"
                  >
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
