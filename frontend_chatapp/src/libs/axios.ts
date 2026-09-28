import axios, { type AxiosInstance } from 'axios';
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Accept' : 'application/json'
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('TOKEN');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errConfig = error.config;

    if (
      error.response.status === 401 &&
      !errConfig._retry &&
      !errConfig.url.includes('/login')
    ) {
      errConfig._retry = true;
      localStorage.removeItem('TOKEN');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
