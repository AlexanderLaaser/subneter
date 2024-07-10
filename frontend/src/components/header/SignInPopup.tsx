import { Link, useNavigate } from "react-router-dom";
import iUser from "../../interfaces/iUser";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {
  checkEmailAvailability,
  getCurrentUser,
  loginUser,
  registerUser,
} from "../../api/userCalls";
import { useUserStore } from "../../store/UserStore";
import Logo from "../../styles/logo.png";

type SignUpPopUpProps = {
  onClose: () => void;
};

function SignUpPopUp({ onClose }: SignUpPopUpProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<iUser>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    isAuthenticated: false,
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [pwMatch, setPwMatch] = useState(false);
  const [mailMatch, setMailMatch] = useState(false);
  const [confirmedForm, setConfirmedForm] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { setFirstname, setLastname, setEmail, setuserLoginStatus } =
    useUserStore();

  useEffect(() => {
    validateForm();
  }, [user, confirmPassword]);

  const validateForm = async () => {
    const { firstname, lastname, email, password } = user;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);
    const isPasswordMatch = password === confirmPassword;
    setPwMatch(isPasswordMatch);
    setMailMatch(isEmailValid);
    const isFormFilled =
      Boolean(firstname) &&
      Boolean(lastname) &&
      Boolean(email) &&
      Boolean(password) &&
      Boolean(confirmPassword);

    let isEmailAvailable = false;
    if (isEmailValid) {
      isEmailAvailable = await checkEmailAvailability(email);
      setEmailError(isEmailAvailable ? "" : "Email already in use");
    }

    setIsFormValid(
      isEmailValid && isPasswordMatch && isFormFilled && isEmailAvailable
    );
  };

  const clickToHome = () => {
    onClose();
    navigate("/");
  };

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

  const handleClickToRegisterUser = async (e: FormEvent) => {
    e.preventDefault();
    if (user.password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (isFormValid === true) {
      try {
        const userData = await registerUser(user);
        if (userData) {
          try {
            // Automatically log in the user after registration
            const loginResponse = await loginUser(user.email, user.password);
            if (loginResponse) {
              setuserLoginStatus(true);
              setUserData();
              clickToHome();
            } else {
              setErrorMessage("Failed to log in after registration.");
            }
          } catch (error) {
            if (error instanceof Error) {
              setErrorMessage(error.message);
            } else {
              setErrorMessage(
                "An unknown error occurred during login. Please try again."
              );
            }
          }
        } else {
          setErrorMessage("Failed to register user.");
        }
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(
            "An unknown error occurred during registration. Please try again."
          );
        }
      }
    } else {
      setConfirmedForm(true);
    }
  };

  const handleInputFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto flex backdrop-blur-sm">
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
            onSubmit={handleClickToRegisterUser}
          >
            <div className="flex flex-row space-x-4 items-center">
              <div>
                <Link to="/">
                  <img className="h-10 w-10 " src={Logo} alt="Your Logo" />
                </Link>
              </div>
              <h3 className="text-xl text-sky-800 font-medium dark:text-white">
                Register to Subneter
              </h3>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}
            <div className="space-y-4">
              <div>
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
                  onChange={handleInputFieldChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-secondary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                ></input>

                {(mailMatch === false || user.password === "") &&
                  confirmedForm && (
                    <div className="text-red-500 text-sm pt-1">
                      Invalid E-Mail address
                    </div>
                  )}
                {emailError && mailMatch && (
                  <div className="text-red-500 text-sm pt-1">{emailError}</div>
                )}
              </div>
              <div className="flex flex-row justify-between">
                <div className="">
                  <label
                    htmlFor="firstname"
                    className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
                  >
                    Firstname
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    onChange={handleInputFieldChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-secondary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="John"
                  ></input>
                  {user.firstname === "" && confirmedForm ? (
                    <div className="text-red-500 text-sm pt-1">
                      Invalid firstname
                    </div>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
                  >
                    Lastname
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    onChange={handleInputFieldChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-secondary block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Doe"
                  ></input>
                  {user.lastname === "" && confirmedForm ? (
                    <div className="text-red-500 text-sm pt-1">
                      Invalid lastname
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="initpassword"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
                >
                  Input password
                </label>
                <input
                  type="password"
                  name="password"
                  id="initpassword"
                  onChange={handleInputFieldChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="••••••••"
                ></input>
              </div>
              <div>
                <label
                  htmlFor="confirmpassword"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmpassword"
                  id="confirmpassword"
                  onChange={handleConfirmPasswordChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="••••••••"
                ></input>
                {pwMatch === false ||
                (user.password === "" && confirmedForm) ? (
                  <div className="text-red-500 text-sm pt-1">
                    Passwords do not match
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-sky-800 hover:bg-secondary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpPopUp;
