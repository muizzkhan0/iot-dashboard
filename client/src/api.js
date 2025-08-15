import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:4000/api" });

export const setAuthToken = (token) => {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : "";
};
export default api;
