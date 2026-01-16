import axios from "axios";
import uri from "../config";

const API_URL = uri;

// Get user's credit balance
const getCredits = async (email) => {
  const response = await axios.get(`${API_URL}/api/credits/${email}`);
  return response.data;
};

// Get all available credit packages
const getPackages = async () => {
  const response = await axios.get(`${API_URL}/api/credits/packages`);
  return response.data;
};

// Purchase a credit package
const purchaseCredits = async ({
  email,
  packageId,
  paymentMethod,
  idempotencyKey = null,
}) => {
  const config = {
    headers: {
      "X-Idempotency-Key": idempotencyKey,
    },
  };
  const response = await axios.post(
    `${API_URL}/api/credits/purchase`,
    {
      email,
      packageId,
      paymentMethod,
    },
    config
  );
  return response.data;
};

// Spend credits for an order
const spendCredits = async ({ email, amount, orderId, description }) => {
  const response = await axios.post(`${API_URL}/api/credits/spend`, {
    email,
    amount,
    orderId,
    description,
  });
  return response.data;
};

// Get credit transaction history
const getHistory = async ({ email, limit, skip }) => {
  const response = await axios.get(
    `${API_URL}/api/credits/history/${email}?limit=${limit || 20}&skip=${
      skip || 0
    }`
  );
  return response.data;
};

// Reward loyalty credits
const rewardCredits = async ({ email, amount, description }) => {
  const response = await axios.post(`${API_URL}/api/credits/reward`, {
    email,
    amount,
    description,
  });
  return response.data;
};

export const creditsService = {
  getCredits,
  getPackages,
  purchaseCredits,
  spendCredits,
  getHistory,
  rewardCredits,
};
