import { data } from "react-router-dom";
import api from "./api";
import toast from "react-hot-toast";

// Login 
export const loginUser = async (data) => {
    const response = await api.post("/api/auth/login", data);
    toast.success("Login successful ✅");
    return response.data;
};

// Register
export const registerUser = async (data) => {
    const response = await api.post("/api/auth/register", data);
    toast.success("Register successful ✅");
    return response.data;
};