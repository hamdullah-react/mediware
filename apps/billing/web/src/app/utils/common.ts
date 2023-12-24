import axios from 'axios';
import { HOST } from '../../environment';
import { Dispatch, SetStateAction } from 'react';

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

export const handleChange = <Type, ValueType>(
  key: string,
  value: ValueType,
  object: Type,
  setObject: Dispatch<SetStateAction<Type>>
) => {
  setObject({
    ...object,
    [key]: value,
  });
};

export const getFormElementValue = (elementId: string) => {
  const element = document.getElementById(elementId) as HTMLInputElement;
  if (element && element?.value !== 'NaN') {
    return element?.value;
  }
};

export const sanitizeNaN = (value?: string) => {
  return (value && value === 'NaN') || !value ? '0' : value;
};

export const dashIfNull = (value?: string) => {
  return value ? value : '-';
};
