import axios from 'axios';
import { HOST } from '../../environment';
import { Dispatch, SetStateAction } from 'react';

export const getLastRouteItem = (route: string) => {
  return route?.split('/')?.reverse()?.at(0);
};

export const HttpClient = (token?: string) => {
  return axios.create({
    baseURL: HOST,
    headers: {
      Authorization: token,
    },
  });
};

export const apiCallAlertWrapper = async <Type>(
  task: () => Promise<void>,
  setAlert?: Dispatch<SetStateAction<Type>>,
  setIsLoading?: Dispatch<SetStateAction<boolean>>,
  onError?: () => void
) => {
  try {
    await task();
  } catch (error) {
    const message = (error as { response: { data: { message: string } } })
      .response.data.message;
    if (message && setAlert) {
      setAlert({
        error: 'Error',
        message: message,
        shown: true,
      } as Type);
      if (onError) onError();
    }
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
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

export const formatJSON = (object: object) => JSON.stringify(object, null, 2);
