import API from "./api";

export const registerUserService = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Registration failed";
  }
};

export const loginUserService = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || "Login failed";
  }
};

export const logoutUserService = (navigate) => {
  localStorage.removeItem("token"); // Remove token
  navigate("/sign-in");
};
