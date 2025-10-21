import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // same port as your backend
});

export default api;
