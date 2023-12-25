import { IUser } from '@billinglib';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Login from '../../pages/auth/Login';
import { HttpClient, apiCallAlertWrapper } from '../../utils/common';
import { useAlert } from './AlertProvider';

interface Props {
  children?: ReactNode | ReactNode[];
}

const AuthProvider = ({ children }: Props) => {
  const [activeUser, setActiveUser] = useState<IUser>();
  const { setAlert } = useAlert();

  const isLoggedIn = useMemo((): boolean => {
    if (activeUser && activeUser?.token) {
      return true;
    }
    return false;
  }, [activeUser]);

  const loginUser = useCallback(
    async (userInfo: IUser) => {
      const loginResponse = (await HttpClient().post('/user/login', userInfo))
        .data;
      if (loginResponse?.message && setAlert) {
        setAlert({
          error: 'Error',
          message: loginResponse.message,
          shown: true,
        });
      } else {
        localStorage.setItem('id', loginResponse?.token);
        setActiveUser(loginResponse);
      }
    },
    [activeUser]
  );

  const getUserInfo = useCallback(async () => {
    await apiCallAlertWrapper(
      async () => {
        const jwtToken = localStorage.getItem('id');

        if (jwtToken) {
          const data = (await HttpClient(jwtToken).get('/user')).data;
          setActiveUser(data);
        } else {
          logoutUser();
        }
      },
      setAlert,
      undefined,
      () => logoutUser()
    );
  }, [activeUser]);

  const logoutUser = useCallback(() => {
    setActiveUser(undefined);
    localStorage.clear();
    sessionStorage.clear();
  }, [activeUser]);

  useEffect(() => {
    getUserInfo()
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <AuthContext.Provider
      value={{ activeUser, setActiveUser, loginUser, logoutUser }}
    >
      {isLoggedIn ? children : <Login />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
