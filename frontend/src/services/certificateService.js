import api from "./api";

// Get Certificate
export const getCertificate = async (userId, eventId) => {
    const response = await api.get(`/api/certificate/${userId}/${eventId}`);
    return response.data;
};

export const uploadTemplate = (eventId, file) => {
    const formData = new FormData();
    formData.append("template", file);

    return api.post(
        `/api/certificate/upload-template/${eventId}`,
        formData
    );
};

export const issueAllCertificates = (eventId) => {
    api.post(`/api/certificate/issue/all/${eventId}`);
};