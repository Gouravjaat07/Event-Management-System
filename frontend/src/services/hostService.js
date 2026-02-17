import api from "./api";

// Get registrations of an event
export const getEventRegistrations = async (eventId) => {
    const res = await api.get(`/api/register/event/${eventId}`);
    return res.data;
};

