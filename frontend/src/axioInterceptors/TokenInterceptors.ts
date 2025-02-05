import axios from 'axios';

import { apiEndpoints } from '../constants/constants';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

const isTokenExpired = (token: string) => {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) throw new Error('No refresh token found');

  try {
    const response = await axios.post(apiEndpoints.auth.refresh, {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data.access_token;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refresh_token');
    throw error;
  }
};

const getValidAccessToken = async () => {
  let accessToken = localStorage.getItem('accessToken');

  if (!accessToken || isTokenExpired(accessToken)) {
    accessToken = await refreshAccessToken();
  }

  return accessToken;
};

axiosInstance.interceptors.request.use(
  async config => {
    try {
      const accessToken = await getValidAccessToken();
      if (accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {}
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
