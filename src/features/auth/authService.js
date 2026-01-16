import axios from "axios";
import uri from "../config";

const regUser = async (data) => {
  const response = await axios.post(`${uri}/api/user`, data);

  if (response.data) {
    localStorage.setItem("public-dripper-user", JSON.stringify(response.data));
  }

  return response.data;
};

const loginUser = async (data) => {
  const response = await axios.post(`${uri}/api/user/login`, data);

  if (response.data) {
    localStorage.setItem("public-dripper-user", JSON.stringify(response.data));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem("public-dripper-user");
};

const updateProfile = async (email, profileData) => {
  const response = await axios.post(`${uri}/api/user/profile`, {
    email,
    profileData,
  });

  if (response.data) {
    localStorage.setItem("public-dripper-user", JSON.stringify(response.data));
  }

  return response.data;
};

const addAddress = async (email, address) => {
  const response = await axios.post(`${uri}/api/user/address`, {
    email,
    address,
  });

  if (response.data) {
    localStorage.setItem("public-dripper-user", JSON.stringify(response.data));
  }
  return response.data;
};

const removeAddress = async (email, id) => {
  const response = await axios.delete(`${uri}/api/user/address`, {
    data: { email, id },
  });

  if (response.data) {
    localStorage.setItem("public-dripper-user", JSON.stringify(response.data));
  }
  return response.data;
};

const addCard = async (email, card) => {
  const response = await axios.post(`${uri}/api/user/card`, {
    email,
    card,
  });

  if (response.data) {
    localStorage.setItem("public-dripper-user", JSON.stringify(response.data));
  }
  return response.data;
};

const removeCard = async (email, id) => {
  const response = await axios.delete(`${uri}/api/user/card`, {
    data: { email, id },
  });

  if (response.data) {
    localStorage.setItem("public-dripper-user", JSON.stringify(response.data));
  }
  return response.data;
};

const authService = {
  regUser,
  loginUser,
  logout,
  updateProfile,
  addAddress,
  removeAddress,
  addCard,
  removeCard,
};

export default authService;
