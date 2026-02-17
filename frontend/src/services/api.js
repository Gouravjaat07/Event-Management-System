import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// ✅ REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        /**
         * 🔑 MOST IMPORTANT FIX
         * If data is FormData → DO NOT set Content-Type
         * Browser will auto-set multipart/form-data + boundary
         */
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default api;

// import axios from "axios";

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // Request Interceptor (JWT later use)
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");

//         if(token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         Promise.reject(error);
//     }
// );

// // Response Interceptor
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// export default api;