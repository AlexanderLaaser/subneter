import { useState } from "react";
import { logoutUser } from "../../api/userCalls";
import { useUserStore } from "../../store/UserStore";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useVnetStore } from "../../store/VnetStore";

function Avatar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { firstname, lastname, email, setuserLoginStatus } = useUserStore();
  const { clearVnets } = useVnetStore();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  async function handleLogoutButtonClick(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    try {
      await logoutUser();
      if (await logoutUser()) {
        setuserLoginStatus(false);
        navigate("/");
        clearVnets();
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  }

  const getInitials = (firstname: string, lastname: string) => {
    if (!firstname || !lastname) return "";
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="relative flex flex-1 flex-col items-end">
      <button
        className="ml-40 bg-sky-800  items-center justify-center w-10 h-10 rounded-full"
        onClick={toggleDropdown}
      >
        <span className="text-white text-sm font-semibold">
          {getInitials(firstname, lastname)}
        </span>
      </button>

      {dropdownOpen ? (
        <div
          id="userDropdown"
          className="absolute top-full right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div className="font-normal truncate">
              <div>{email}</div>
              <div>{firstname + " " + lastname}</div>
            </div>
          </div>
          <div className="py-1">
            <button
              className="block px-4 py-2 text-sm text-sky-800 hover:text-secondary dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              onClick={handleLogoutButtonClick}
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Avatar;
