import api from "./api";

export const submitFeedback = async (data) => {
  const res = await api.post("/api/feedback", data);
  return res.data;
};