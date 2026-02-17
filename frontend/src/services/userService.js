import api from "./api";

export const getMyProfile = async () => {
    const res = await api.get("/api/users/profile");
    return res.data;
};

export const updateMyProfile = async (data) => {
    const res = await api.put("/api/users/profile", data);
    return res.data;
};

export const getUsersCount = async () => {
    const res = await api.get("/api/users/count");
    return res.data;
};
