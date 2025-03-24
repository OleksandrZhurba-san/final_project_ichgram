import API from "./api";

const USER_BASE_URL = "/user";

export const getUserById = async (userId) => {
  try {
    const response = await API.get(`${USER_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch user";
  }
};

export const updateUser = async (updatedData) => {
  try {
    const formData = new FormData();

    for (let [key, value] of updatedData.entries()) {
      formData.append(key, value);
    }

    const response = await API.patch(`${USER_BASE_URL}/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to update user";
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await API.get(`/search/users`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to search users";
  }
};
