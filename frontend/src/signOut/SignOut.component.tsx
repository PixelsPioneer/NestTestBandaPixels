import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTokenContext } from '../tokenContext/TokenContext';

export const SignOut: React.FC = () => {
  const navigate = useNavigate();
  const { updateTokens } = useTokenContext();

  useEffect(() => {
    const signOut = async () => {
      updateTokens(null, null, null);

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('role');

      navigate('/');
    };

    signOut();
  }, [navigate, updateTokens]);

  return <div></div>;
};

export default SignOut;
