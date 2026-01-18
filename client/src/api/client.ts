import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 20000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            return Promise.reject(new Error("Network error: Server not reachable"));
        }

        const status = error.response.status;
        const data = error.response.data;

        let message = "Something went wrong";

        if (typeof data === "string" && data.trim().length > 0) {
            message = data;
        } else if (data?.error) {
            message = data.error;
        } else if (data?.message) {
            message = data.message;
        } else if (status === 400) {
            message = "Bad request (400)";
        } else if (status === 401) {
            message = "Unauthorized (401) - Check API key";
        } else if (status === 404) {
            message = "Not found (404)";
        } else if (status >= 500) {
            message = "Server error (500)";
        }

        return Promise.reject(new Error(message));
    }
);
