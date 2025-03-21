import API from "./api";

const COMMENTS_BASE_URL = "/comment";

export const addComment = async (postId, commentData) => {
  try {
    const response = await API.post(
      `${COMMENTS_BASE_URL}/${postId}`,
      commentData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to post comment";
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await API.delete(`${COMMENTS_BASE_URL}/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to delete comment";
  }
};
