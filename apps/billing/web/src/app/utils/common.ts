import axios from 'axios';
import { HOST } from '../../environment';
const axiosInstance = axios.create({
  baseURL: HOST,
});

export const getLastRouteItem = (route: string) => {
  return route?.split('/')?.reverse()?.at(0);
};

export const HttpClient = () => {
  return axiosInstance;
};

export const errorHandler = (errorBody: unknown, alert: boolean = false) => {};
