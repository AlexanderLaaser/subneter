import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, loginUser } from "../../api/userCalls";
import Logo from "../../styles/logo.png";

import { useUserStore } from "../../store/UserStore";
import { useState } from "react";

function LoginPopUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    loginpopouplocation?: Location;
  };
  const loginpopouplocation = state?.loginpopouplocation;

  const [errorMessage, setErrorMessage] = useState("");

  const {
    setPassword,
    setFirstname,
    setLastname,
    setEmail,
    setuserLoginStatus,
    password,
    email,
  } = useUserStore();

  const handleInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  function clickToHome() {
    navigate("/");
  }

  async function setUserData() {
    const userData = await getCurrentUser();
    setuserLoginStatus(true);

    if (userData) {
      setFirstname(userData.user.first_name);
      setLastname(userData.user.last_name);
      setEmail(userData.user.email);
    } else {
      throw new Error("Failed to retrieve user data");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const userData = await loginUser(email, password);
      if (userData) {
        clickToHome();
        setUserData();
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto flex  backdrop-blur-sm">
      <div className="relative w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
        <div className="bg-white rounded-lg shadow relative dark:bg-gray-700">
          <div className="flex justify-end p-2">
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={clickToHome}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <form
            className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8"
            action="#"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-row space-x-4 items-center">
              <div>
                <Link to="/">
                  <img className="h-10 w-10 " src={Logo} alt="Your Logo" />
                </Link>
              </div>
              <h3 className="text-xl text-sky-800 font-medium dark:text-white">
                Your Subneter Login
              </h3>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-secondary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                  onChange={handleInputFieldChange}
                ></input>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  onChange={handleInputFieldChange}
                ></input>
              </div>
              {errorMessage !== "" ? (
                <div className=" text-warning text-sm">{errorMessage}</div>
              ) : (
                <div className="flex items-start"></div>
              )}
            </div>

            {/* <a className="text-sm text-zinc-700">Lost Password?</a> */}

            {/* <div className="flex flex-row gap-2">
              <button
                disabled
                className="inline-flex h-10 rounded-lg w-full items-center justify-center gap-2 border border-sky-800 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 hover:border-secondary"
              >
                <img src={googleLogo} alt="Your Logo" className="h-6 w-6"></img>
                Google
              </button>
              <button
                disabled
                className="inline-flex h-10 rounded-lg w-full items-center justify-center gap-2 border border-sky-800 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 hover:border-secondary"
              >
                <img
                  src={microsoftLogo}
                  alt="Your Logo"
                  className="h-6 w-6"
                ></img>{" "}
                Microsoft
              </button>
              <button
                disabled
                className="inline-flex h-10 rounded-lg w-full items-center justify-center gap-2 border border-sky-800 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 hover:border-secondary"
              >
                <img src={githubLogo} alt="Your Logo" className="h-6 w-6"></img>{" "}
                GitHub
              </button>
            </div> */}
            <button
              type="submit"
              className="w-full text-white bg-sky-800 hover:bg-secondary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:scale-105 transition"
            >
              Login
            </button>
            <div className="flex flex-row text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?{" "}
              <a
                href="#"
                className="text-primary hover:underline hover:text-secondary"
              >
                <Link
                  to="/register"
                  className="pl-1"
                  state={{ registerpopouplocation: loginpopouplocation }}
                >
                  Create Account
                </Link>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPopUp;
