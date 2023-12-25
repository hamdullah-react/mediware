import { IUser } from '@billinglib';
import { Dispatch, SetStateAction, createContext } from 'react';

export const AuthContext = createContext<{
  activeUser?: IUser;
  setActiveUser?: Dispatch<SetStateAction<IUser | undefined>>;
  loginUser?: (_: IUser) => Promise<void>;
  logoutUser?: () => void;
}>({});
