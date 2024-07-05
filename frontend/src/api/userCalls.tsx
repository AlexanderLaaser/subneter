import axios from "axios";
import iUser from "../interfaces/iUser";
import Cookies from "js-cookie";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

// Axios Interceptor hinzufügen
axios.interceptors.request.use(
  (config) => {
    // CSRF-Token aus den Cookies holen
    const csrfToken = Cookies.get("csrftoken");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (user: iUser) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/api/user/register_user`,
      user
    );

    if ((response.status = 200)) {
      return response.data;
    } else {
      throw new Error("Failed to fetch data!");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response) {
        if (error.response.status === 400) {
          throw new Error("Inputs invalid. Please check again!");
        } else if (error.response.status === 500) {
          throw new Error("Server error!");
        }
      } else {
        throw new Error("Network error!");
      }
    } else {
      throw error;
    }
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/api/user/login_user`,
      {
        email,
        password,
      }
    );

    if ((response.status = 200)) {
      return response.data;
    } else {
      throw new Error("Failed to fetch data!");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response) {
        if (
          error.response.status === 400 ||
          error.response.status === 401 ||
          error.response.status === 403
        ) {
          const errorMessage =
            error.response.data?.error || "An error occurred";
          throw new Error(errorMessage);
        } else if (error.response.status === 500) {
          throw new Error("Server error!");
        }
      } else {
        throw new Error("Network error!");
      }
    } else {
      throw error;
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_SERVER_URL}/api/user/get_current_user`
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch data!");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error("Unauthorized: No session or session expired");
        } else if (error.response.status === 403) {
          throw new Error(
            "Access Denied: You do not have permission to access this data"
          );
        } else if (error.response.status === 400) {
          throw new Error("Bad Request: Check your request format");
        } else if (error.response.status === 500) {
          throw new Error("Server Error: Problem handling your request");
        }
      } else {
        throw new Error("Network Error: Unable to reach the server");
      }
    } else {
      throw error;
    }
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/api/user/logout_user`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const checkEmailAvailability = async (email: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_SERVER_URL}/api/user/check_email`,
      { email }
    );
    return response.data.available;
  } catch (error) {
    throw new Error("Failed to check email availability");
  }
};
