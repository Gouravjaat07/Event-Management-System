import api from "./api";

// Get All Events
export const getAllEvents = async () => {
    const response = await api.get("/api/events/all");
    return response.data;
};

// Get Event by Id
export const getEventById = async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
};

