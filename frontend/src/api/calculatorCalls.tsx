import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

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

export const getIpaddressesCount = async (suffix: number) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/calculator/count_ipaddresses?subnet_mask=${suffix}`
    );
    return response.data.count.toString();
  } catch (error) {
    console.error("Fehler beim API-Call", error);
  }
};

export const getAddressSpace = async (
  ipaddressCidr: string,
  existing_ranges: string[],
  isValid?: boolean
) => {
  if (isValid) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/calculator/address_space`,
        {
          ipaddress_cidr: ipaddressCidr,
          existing_ranges: existing_ranges,
        }
      );

      if (response.status === 200) {
        return response.data.address_space.toString();
      } else {
        throw new Error("Failed to fetch data!");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          throw new Error("Inputs invalid. Please check again!");
        } else if (error.response.status === 409) {
          throw new Error("Address spaces or overlapping!");
        } else if (error.response.status === 500) {
          throw new Error("Invalid CIDR Block for given size!");
        }
      } else {
        throw new Error("Network error!");
      }
    }
  } else {
    return "";
  }
};

export const generateNextSubnet = async (
  vnet_cidr: string,
  new_suffix_length: number,
  ip_ranges_used: string[]
) => {
  try {
    if (!vnet_cidr || !new_suffix_length || !Array.isArray(ip_ranges_used)) {
      throw new Error("Ungültige Eingabeparameter für generateNextSubnet");
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/calculator/generate_next_subnet`,
      {
        vnet_cidr,
        new_suffix_length,
        ip_ranges_used,
      }
    );

    if (response.status === 200) {
      return response.data.nextSubnetRange.toString();
    } else {
      throw new Error("Failed to fetch data!");
    }
  } catch (error) {
    console.error("Fehler beim API-Aufruf generateNextSubnet:", error);
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        throw new Error("Inputs invalid. Please check again!");
      } else if (error.response.status === 500) {
        throw new Error("Subnet mask doesn't match given address spaces!");
      }
    } else {
      throw new Error("Network error!");
    }
  }
};

export const compareVnetRangeWithSubnetRangeUsed = async (
  vnet_cidrs: string[],
  ip_ranges_used: string[]
) => {
  try {
    const response = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/calculator/compare_vnet_range_with_subnet_ranges_used`,
      {
        vnet_cidrs,
        ip_ranges_used,
      }
    );

    if (response.status === 200) {
      return response.data.result;
    } else {
      throw new Error("Failed to fetch data!");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        throw new Error("Inputs invalid. Please check again!");
      } else if (error.response.status === 500) {
        throw new Error("Something went wrong! Please try again");
      }
    } else {
      throw new Error("Network error!");
    }
  }
};
