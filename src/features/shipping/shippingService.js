import axios from "axios";
import uri from "../config";

const getShippingFee = async (data) => {
  const response = await axios.post(`${uri}/api/user/getshippingfee`, data);
  return response.data;
};

const shippingService = {
  getShippingFee,
};

export default shippingService;
