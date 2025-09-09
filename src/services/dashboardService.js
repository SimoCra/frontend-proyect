import axios from "axios";
import { getFingerprint } from './fingerPrint';
const API_URL = 'http://localhost:5000/api/dashboard';

export const getDataDashboard = async () => {
  const fp = await getFingerprint();
  try {
    const res = await axios.get(`${API_URL}/stats`, {  headers: {'x-client-fingerprint': fp  }, withCredentials: true});
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al cargar datos del dashboard';
    throw new Error(msg);
  }
};
