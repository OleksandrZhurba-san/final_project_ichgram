import API from "./api";

const POSTS_BASE_URL = "/post";

export const createPost = async (postData) => {
  try {
    const formData = new FormData();
    formData.append("description", postData.description);
    formData.append("image", postData.image);

    const response = await API.post(`${POSTS_BASE_URL}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to create post";
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await API.get(`${POSTS_BASE_URL}/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch post";
  }
};

export const getAllPosts = async () => {
  try {
    const response = await API.get(`${POSTS_BASE_URL}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch posts";
  }
};

export const updatePost = async (postId, updatedData) => {
  try {
    const response = await API.put(`${POSTS_BASE_URL}/${postId}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to update post";
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await API.delete(`${POSTS_BASE_URL}/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to delete post";
  }
};
