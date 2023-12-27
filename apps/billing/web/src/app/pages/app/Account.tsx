import { useContext } from 'react';
import { AuthContext } from '../../state/contexts/AuthContext';
import { Button } from '@fluentui/react-components';
import moment from 'moment';

const Account = () => {
  const { activeUser, logoutUser } = useContext(AuthContext);

  return (
    <div>
      <div className="w-96">
        {JSON.stringify({
          ...activeUser,
          token: '',
          exp: '',
          iat: '',
          Role: '',
        })}
      </div>
      <div className="text-2xl capitalize">Welcome {activeUser?.username}</div>
      <div className="text-md text-gray-500">
        Last Login at{' '}
        {moment(activeUser?.lastLoginAt).format('MMM Do, YYYY h:mm:ss a')}
      </div>
      <div className="mt-5">
        {logoutUser && <Button onClick={logoutUser}>Log out</Button>}
      </div>
    </div>
  );
};

export default Account;
