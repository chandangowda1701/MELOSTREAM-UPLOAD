import axios from "axios";

const getBaseURL = () => {
	if (import.meta.env.MODE === "development") {
		return "http://localhost:5000/api";
	}
	// Use environment variable if set, otherwise fallback to relative path
	return import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api";
};

export const axiosInstance = axios.create({
	baseURL: getBaseURL(),
	withCredentials: true,
});