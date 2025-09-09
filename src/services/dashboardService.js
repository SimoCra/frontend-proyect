// src/services/dashboardService.js
import { api } from "./api";
import { getFingerprint } from "./fingerPrint";

const API_URL = "/api/dashboard";

export const getDataDashboard = async () => {
  const fp = await getFingerprint();
  try {
    const res = await api.get(`${API_URL}/stats`, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al cargar datos del dashboard";
    throw new Error(msg);
  }
};
