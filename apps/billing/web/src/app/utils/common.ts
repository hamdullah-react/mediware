import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getLastRouteItem = (route: string) => {
  return route?.split('/')?.reverse()?.at(0);
};

export const HttpClient = () => {
  return axiosInstance;
};

export const errorHandler = (errorBody: unknown, alert: boolean = false) => {};
