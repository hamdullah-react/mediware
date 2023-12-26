import { IUser } from '@billinglib';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Login from '../../pages/auth/Login';
import { HttpClient, apiCallAlertWrapper } from '../../utils/common';
import { useAlert } from './AlertProvider';
import { Button, Spinner } from '@fluentui/react-components';

interface Props {
  children?: ReactNode | ReactNode[];
}

const AuthProvider = ({ children }: Props) => {
  const [activeUser, setActiveUser] = useState<IUser>();
  const { setAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = useMemo((): boolean => {
    if (activeUser && activeUser?.token) {
      return true;
    }
    return false;
  }, [activeUser]);

  const loginUser = useCallback(
    async (userInfo: IUser) => {
      setIsLoading(true);
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
      setIsLoading(false);
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
        setIsLoading(false);
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
    setIsLoading(false);
  }, [activeUser, isLoading]);

  useEffect(() => {
    getUserInfo()
      .then(() => {})
      .catch(() => {});
  }, []);

  return (
    <AuthContext.Provider
      value={{ activeUser, setActiveUser, loginUser, logoutUser }}
    >
      {!isLoading ? (
        isLoggedIn ? (
          children
        ) : (
          <Login />
        )
      ) : (
        <div className="min-h-screen flex flex-col justify-center items-center">
          <Spinner
            label="Mediware"
            labelPosition="above"
            className="my-6"
            size="huge"
          />
          <Button onClick={logoutUser} className="px-4">
            Log out
          </Button>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
