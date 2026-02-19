import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://micro-market-place-backend.vercel.app",
});

export default apiClient;
