import axios from "axios";
const api = axios.create({ baseURL: "https://hqs-backend.onrender.com/api" });
export default api;