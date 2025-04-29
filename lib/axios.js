// lib/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: false // chưa dùng auth
});

export default API;
