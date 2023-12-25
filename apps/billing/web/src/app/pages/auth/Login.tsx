import { IUser } from '@billinglib';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import InputField from '../../shared/molecules/InputField';
import clsx from 'clsx';
import { Button, Divider } from '@fluentui/react-components';
import { AuthContext } from '../../state/contexts/AuthContext';
import { INFO } from '../../../environment';
import Version from '../../shared/molecules/Version';
import { useAlert } from '../../state/providers/AlertProvider';

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const [user, setUser] = useState<IUser>({
    email: '',
    password: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { setAlert } = useAlert();

  const onChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setUser({
        ...user,
        [ev.target.name]: ev.target.value,
      });
    },
    [user]
  );

  const onSubmit = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      if (!user?.password && setAlert) {
        setAlert({
          error: 'Error',
          message: 'Please enter the password, it cannot be left empty',
          shown: true,
        });
      }
      if (loginUser) {
        await loginUser(user);
      }
    },
    [user]
  );

  const togglePassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const currentYearMemo = useMemo(() => {
    return String(new Date().getFullYear());
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex-1 flex items-center">
        <form
          onSubmit={onSubmit}
          className={clsx([
            'border py-3 bg-white rounded-md px-8 min-w-[350pt]',
            'flex flex-col gap-3 justify-center pt-6',
          ])}
        >
          <div>
            <div className="text-3xl font-bold tracking-wider text-gray-500">
              {INFO.name}
            </div>
            <div className="text-sm tracking-wide">{INFO.description}</div>
          </div>
          <InputField
            name="username"
            value={user.username}
            onChange={onChange}
            label="Username"
            placeholder="Enter your username"
            type="text"
            required
          />
          <div className="flex flex-row items-end gap-3">
            <InputField
              name="password"
              value={user.password}
              onChange={onChange}
              label="Password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              required
            />
            <Button onClick={togglePassword} size="large">
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </div>
          <Divider className="my-3" />
          <Button type="submit" size="large" appearance="primary">
            Login
          </Button>
          <Version />
        </form>
      </div>
      <div className="py-5">
        <span role="img" aria-label="copyRight" className="mr-1.5">
          ©️
        </span>
        2020 - {currentYearMemo} Solutionave | All rights researved
      </div>
    </div>
  );
};

export default Login;
