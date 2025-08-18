import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api/v1",
  withCredentials: true, // if you're using cookies or auth headers
});

export default axiosInstance;
