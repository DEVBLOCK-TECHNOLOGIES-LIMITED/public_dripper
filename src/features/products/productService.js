import axios from "axios";
import uri from "../config";

const getAllProducts = async () => {
  const response = await axios.get(`${uri}/api/products`);
  return response.data;
};

const getProduct = async (code) => {
  const response = await axios.get(`${uri}/api/products/${code}`);
  return response.data;
};

const getTrendingProducts = async () => {
  const response = await axios.get(`${uri}/api/products/trending`);
  return response.data;
};

const addProduct = async (productData) => {
  const response = await axios.post(`${uri}/api/products`, productData);
  return response.data;
};

const updateProduct = async (code, updateData) => {
  const response = await axios.put(`${uri}/api/products/${code}`, updateData);
  return response.data;
};

const deleteProduct = async (code) => {
  const response = await axios.delete(`${uri}/api/products/${code}`);
  return response.data;
};

const productsService = {
  getAllProducts,
  getProduct,
  getTrendingProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};

export default productsService;
