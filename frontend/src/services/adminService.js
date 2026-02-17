import api from "./api";
import toast from "react-hot-toast";

// Events
export const getAllEventsAdmin = async () => {
    const res = await api.get("/api/events/all");
    return res.data;
};

export const deleteEventAdmin = async (id) => {
    const res = await api.delete(`/api/admin/events/${id}`);
    // toast.success("Event deleted ✅");
    return res.data;
}

// Registrations
export const getEventRegistrationsAdmin = async (eventId) => {
    const res = await api.get(`/api/register/event/${eventId}`);
    return res.data;
};

