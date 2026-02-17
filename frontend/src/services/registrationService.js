import { data } from "react-router-dom";
import api from "./api";
import toast from "react-hot-toast";

// Register for event
export const registerForEvent = async (eventId, data) => {
    const response = await api.post(`/api/register/${eventId}`, data);
    // toast.success("Registration successful");
    return response.data;
};

// Get registration by User
export const getMyRegistrations = async (userId) => {
    const response = await api.get(`/api/register/user/${userId}`);
    return response.data;
};

// DO registration by user in event
export const createRegistration = async (eventId, data) => {
    const response = await api.post(`/api/register/${eventId}`, data);
    // toast.success("Registration successfully");
    return response.data;
}

// Update registration
export const updateRegistration = async (registrationId, data) => {
    const response = await api.put(`/api/register/${registrationId}`, data);
    // toast.success("Registration updated");
    return response.data;
}

// Delete registration
export const deleteRegistration = async (registrationId) => {
    const response = await api.delete(`/api/register/${registrationId}`);
    // toast.success("Registration deleted");
    return response.data;
}

// Get my registration
// export const getMyRegistrations = (userId) => {
//     const response = api.get(`/api/register/user/${userId}`);
//     return response.data;
// }

