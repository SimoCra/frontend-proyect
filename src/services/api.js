// services/api.js
import axios from 'axios';

// Usamos la variable de entorno en Vite
const API_URL = import.meta.env.VITE_API_URL ;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});
