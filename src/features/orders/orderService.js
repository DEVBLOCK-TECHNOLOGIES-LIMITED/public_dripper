import axios from "axios";
import uri from "../config";

const createOrder = async (orderData, idempotencyKey = null) => {
  const config = {
    headers: {
      "X-Idempotency-Key": idempotencyKey,
    },
  };
  const response = await axios.post(`${uri}/api/orders`, orderData, config);
  return response.data;
};

const getOrders = async (email) => {
  const response = await axios.get(`${uri}/api/orders/${email}`);
  return response.data;
};

const getAllOrders = async () => {
  const response = await axios.get(`${uri}/api/orders`);
  return response.data;
};

const updateOrderStatus = async (id, status) => {
  const response = await axios.put(`${uri}/api/orders/${id}`, { status });
  return response.data;
};

const deleteOrder = async (id) => {
  const response = await axios.delete(`${uri}/api/orders/${id}`);
  return response.data;
};

const orderService = {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};

export default orderService;
