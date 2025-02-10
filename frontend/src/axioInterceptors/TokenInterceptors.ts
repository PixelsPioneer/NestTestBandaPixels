import axios from 'axios';

import { apiEndpoints } from '../constants/constants';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    localStorage.clear();
    window.location.href = '/';
    return null;
  }

  const response = await axios.post(apiEndpoints.auth.refresh, {
    refresh_token: refreshToken,
  });

  const { access_token, refresh_token } = response.data;
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
  return access_token;
};

const getValidAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    localStorage.clear();
    window.location.href = '/';
    return null;
  }
  return accessToken;
};

axiosInstance.interceptors.request.use(async config => {
  const accessToken = await getValidAccessToken();
  if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 || error.response?.data?.message === 'Token expired') {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(error.config);
      }
    }

    if (error.response?.status === 401 || error.response?.data?.message === 'Unauthorized') {
      localStorage.clear();
      window.location.href = '/';
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
