import api from "./api";
import toast from "react-hot-toast";

export const createEvent = async (data) => {
    const res = await api.post("/api/events/create", data);
    // toast.success("Event successfully created ✅");
    return res.data;
};

export const updateEvent = async (id, data) => {
    const res = await api.put(`/api/events/${id}`, data);
    // toast.success("Event successfully updated ✅");
    return res.data;
};

export const deleteEvent = async (id) => {
    const res = await api.delete(`/api/events/${id}`);
    // alert("Event successfully deleted");
    // toast.success("Event successfully deleted 🗑️");
    return res.data;
};

export const getHostEvents = async (hostId) => {
    const res = await api.get("/api/events/all");
    return res.data.filter(e => e.hostId === hostId);
};