import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const createOrder = async (orderData, token) => {
  const res = await axios.post(API, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getMyOrders = async (token) => {
  const res = await axios.get(`${API}/myorders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAllOrders = async (token) => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
