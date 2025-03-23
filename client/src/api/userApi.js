import apiClient from "./api";

export const getUserById = async (userId) => {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
};

export const updateUser = async (userId, data) => {
  const response = await apiClient.put(`/user/${userId}`, data);
  return response.data;
};
