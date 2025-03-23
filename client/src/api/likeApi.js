import API from "./api";

const BASE_URL = "/like";

export const toggleLike = async (postId) => {
  try {
    const response = await API.post(`${BASE_URL}/toggle/${postId}`);
    console.log("Toggle like API response:", response);
    return response.data; // The backend now returns { message, data: { liked, count } }
  } catch (error) {
    console.error("Toggle like API error:", error);
    throw error.response?.data || "Failed to toggle like";
  }
};

export const getLikesByPost = async (postId) => {
  try {
    const response = await API.get(`${BASE_URL}/${postId}`);
    console.log("Get likes API response:", response);
    return response.data; // { message, data: { count: number, liked: boolean } }
  } catch (error) {
    console.error("Get likes API error:", error);
    throw error.response?.data || "Failed to get like status";
  }
};
