import { api } from './api';
import { getFingerprint } from './fingerPrint';

export const login = async (email, password, captchaToken) => {
  const fp = await getFingerprint();

  try {
    await api.post('/auth/login', { email, password, captchaToken }, {
      headers: { 'x-client-fingerprint': fp }
    });

    const res = await api.get('/auth/me', {
      headers: { 'x-client-fingerprint': fp }
    });

    return res.data.user;
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al iniciar sesión';
    throw new Error(msg);
  }
};

export const register = async (formData) => {
  try {
    await api.post('/auth/register', formData);
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al registrar usuario';
    throw new Error(msg);
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al cerrar sesión';
    throw new Error(msg);
  }
};

export const getMe = async () => {
  const fp = await getFingerprint();
  try {
    const res = await api.get('/auth/me', {
      headers: { 'x-client-fingerprint': fp }
    });
    return res.data.user;
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al obtener el usuario';
    throw new Error(msg);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data.message;
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al enviar el código';
    throw new Error(msg);
  }
};

export const verifyResetToken = async (token) => {
  try {
    const res = await api.post('/auth/verify-reset-token', { token });
    return res.data; // contiene { message, email }
  } catch (error) {
    const msg = error.response?.data?.message || 'Token inválido';
    throw new Error(msg);
  }
};


export const resetPassword = async (token, newPassword, newPasswordValidate) => {
  try {
    const res = await api.post('/auth/reset-password', {
      token,
      newPassword,
      newPasswordValidate
    });
    return res.data; // { message: 'Contraseña restablecida correctamente' }
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al restablecer la contraseña';
    throw new Error(msg);
  }
};