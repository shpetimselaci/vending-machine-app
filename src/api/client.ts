import axios from "axios";
import Cookies from "js-cookie";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

client.interceptors.request.use((request) => {
  const token = JSON.parse(Cookies.get("auth") || "{}").token;
  const headers = request.headers;

  if (headers && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return { ...request, headers };
});

export default client;
