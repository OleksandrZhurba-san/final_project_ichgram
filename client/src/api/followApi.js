import apiClient from "./api.js";

export const followUser = async (userId) => {
  const response = await apiClient.post(`/follow/${userId}`);
  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await apiClient.delete(`/follow/${userId}`);
  return response.data;
};

export const getFollowers = async (userId) => {
  const response = await apiClient.get(`/follow/followers/${userId}`);
  return response.data.data.followers;
};

export const getFollowings = async (userId) => {
  const response = await apiClient.get(`/follow/following/${userId}`);
  return response.data.data.following;
};
