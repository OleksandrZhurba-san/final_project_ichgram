import API from "./api";

const BASE_URL = "/like";

export const toggleLike = async (postId) => {
  try {
    const response = await API.post(`${BASE_URL}/toggle/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to toggle like";
  }
};

export const getLikesByPost = async (postId) => {
  try {
    const response = await API.get(`${BASE_URL}/${postId}`);
    return response.data; // { count: number, liked: boolean }
  } catch (error) {
    throw error.response?.data || "Failed to get like status";
  }
};
