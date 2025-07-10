// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // 👈 adjust if using a deployed backend later
});

export default API;
