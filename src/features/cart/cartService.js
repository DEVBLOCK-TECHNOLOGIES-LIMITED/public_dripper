import axios from "axios";
import uri from "../config";

const getCart = async (data) =>{
    const response = await axios.post(`${uri}/api/user/cart`, data)
    return response.data;
}

const addToCart = async (data) => {
    const response = await axios.post(`${uri}/api/user/addtocart`, data)
    return response.data;
}

const removeFromCart = async (data) => {
    const response = await axios.post(`${uri}/api/user/removefromcart`, data)
    return response.data;
}

const deleteCart = async (data) => {
    const response = await axios.post(`${uri}/api/user/deletecart`, data)
    return response.data;
}

const deleteFromCart = async(data) => {
    const response = await axios.post(`${uri}/api/user/deletefromcart`, data)
    return response.data
}

export const cartServive = {
    getCart,
    addToCart,
    removeFromCart,
    deleteFromCart,
    deleteCart
}