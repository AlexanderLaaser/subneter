import axios from "axios";
import Cookies from "js-cookie";
import iVnet from "../interfaces/iVnet";

axios.defaults.xsrfCookieName = "CSRFTOKEN";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

// Axios Interceptor hinzufügen
axios.interceptors.request.use(
  (config) => {
    // CSRF-Token aus den Cookies holen
    const csrfToken = Cookies.get("CSRFTOKEN");
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllVnets = async (isUserAuthenticated: boolean) => {
  if (isUserAuthenticated) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_SERVER_URL}/api/calculator/vnets/`
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
            throw new Error("Unauthorized: No session or invalid credentials");
          } else if (error.response.status === 400) {
            throw new Error("Inputs invalid. Please check again!");
          } else {
            throw new Error("Server error!");
          }
        } else {
          throw new Error("Network error!");
        }
      } else {
        throw error;
      }
    }
  } else {
    return "User not authenticated";
  }
};

export const createVnet = async (
  isUserAuthenticated: boolean,
  vnetData: iVnet
) => {
  if (isUserAuthenticated) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_SERVER_URL}/api/calculator/vnets/`,
        vnetData
      );

      if (response.status === 201 || response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to create data!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            throw new Error("Unauthorized: No session or invalid credentials");
          } else if (error.response.status === 400) {
            throw new Error("Inputs invalid. Please check again!");
          } else {
            throw new Error("Server error!");
          }
        } else {
          throw new Error("Network error!");
        }
      } else {
        throw error;
      }
    }
  } else {
    return "User not authenticated";
  }
};

export const updateVnetById = async (
  isUserAuthenticated: boolean,
  vnetId: number,
  vnetData: iVnet
) => {
  if (isUserAuthenticated) {
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_SERVER_URL
        }/api/calculator/vnets/${vnetId}/`,
        vnetData
      );

      if (response.status === 200 || response.status === 204) {
        return response.data;
      } else {
        throw new Error("Failed to update data!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            throw new Error("Unauthorized: No session or invalid credentials");
          } else if (error.response.status === 400) {
            throw new Error("Inputs invalid. Please check again!");
          } else {
            throw new Error("Server error!");
          }
        } else {
          throw new Error("Network error!");
        }
      } else {
        throw error;
      }
    }
  } else {
    return "User not authenticated";
  }
};

export const deleteVnetById = async (
  isUserAuthenticated: boolean,
  vnetId: number
) => {
  if (isUserAuthenticated) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_SERVER_URL}/api/calculator/vnets/${vnetId}/`
      );

      if (response.status === 200 || response.status === 204) {
        return response.data;
      } else {
        throw new Error("Failed to update data!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            throw new Error("Unauthorized: No session or invalid credentials");
          } else if (error.response.status === 400) {
            throw new Error("Inputs invalid. Please check again!");
          } else {
            throw new Error("Server error!");
          }
        } else {
          throw new Error("Network error!");
        }
      } else {
        throw error;
      }
    }
  } else {
    return "User not authenticated";
  }
};
