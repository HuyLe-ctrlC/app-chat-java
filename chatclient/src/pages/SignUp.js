import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIPhone from "../images/iphoneWithProfile.jpg";
import logo from "../images/logo.png";
import * as ROUTES from "../constants/routes";
import { PWD_REGEX, USER_REGEX } from "../helpers/regex";
import axios from "../helpers/axios";

export default function SignUp() {
  const REGISTER_URL = "/api/v1/registration";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const isInvalid =
    password === "" ||
    emailAddress === "" ||
    username === "" ||
    fullName === "";

  const handleSignUp = async (event) => {
    event.preventDefault();
    // const v1 = USER_REGEX.test(username);
    // const v2 = PWD_REGEX.test(password);
    // if (!v1 || !v2) {
    //   setError("Invalid Entry");
    //   return;
    // }
    try {
      axios
        .post(
          REGISTER_URL,
          JSON.stringify({
            firstName: username,
            lastName: fullName,
            email: emailAddress,
            password: password,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((response) => {
          if (response) {
            window.open("http://localhost:8080/login", "_blank");
          }
          // navigate(ROUTES.LOGIN, { replace: true });
        });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      // setFullName("");
      // setEmailAddress("");
      // setPassword("");
      // setError(error.message);
      if (!err?.response) {
        setError("No Server Response");
      } else if (err.response?.status === 409) {
        setError("Username Taken");
      } else {
        setError("Registration Failed");
      }
    }

    // try {
    // } catch (error) {}
  };

  useEffect(() => {
    document.title = "Sign Up - Instagram";
  }, []);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5 md:w-3/5 sm:w-0 lg:w-3/5">
        <img src={LogoIPhone} alt="Iphone with Instagram" />
      </div>
      <div className="flex flex-col items-center border border-gray-primary bg-white p-4 mb-4 w-2/5 md:w-2/5 sm:w-full sm:m-10 lg:w-3/5 rounded">
        <div className="flex flex-col w-full">
          <h1 className="flex justify-center">
            <img src={logo} alt="logo" className="mt-2 mb-4 w-6/12" />
          </h1>
          {error && <p className="mb-4 text-xs text-red-primary ">{error}</p>}
          <form onSubmit={handleSignUp} method="POST">
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
              First name
            </span>
            <input
              aria-label="Enter your username"
              type="text"
              placeholder="User name"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
              Last name
            </span>
            <input
              aria-label="Enter your Full name"
              type="text"
              placeholder="Full name"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setFullName(target.value)}
              value={fullName}
            />
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
              Email
            </span>
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmailAddress(target.value)}
              value={emailAddress}
            />
            <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
              Password
            </span>
            <input
              aria-label="Enter your Password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />

            <button
              disabled={isInvalid}
              type="submit"
              className={`text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full ${
                isInvalid && " opacity-50"
              }`}
            >
              Sign Up
            </button>
            <div className="flex flex-col">
              <button
                type="button"
                className="text-white bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2 flex-1 w-full"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="facebook-f"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                >
                  <path
                    fill="currentColor"
                    d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
                  ></path>
                </svg>
                Sign up with Facebook
              </button>
              <button
                type="button"
                className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2 flex-1 w-full"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Sign up with Google
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col justify-center items-center bg-white rounded border border-gray-primary w-full h-10">
          <div className="text-sm">
            Have an account? {""}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-media">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

//TODO: add Tailwind config
// -> bg-blue-medium => hex values
//-> text-red-primary => hex values
// -> text-blue-media => hex values
// -> text-gray-base => hex values
// -> border-gray-primary => hex values
