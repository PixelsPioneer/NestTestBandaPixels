import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTokenContext } from '../context/TokenContext';

export const SignOut: React.FC = () => {
  const navigate = useNavigate();
  const { updateTokens } = useTokenContext();

  useEffect(() => {
    const signOut = async () => {
      updateTokens(null, null, null);

      localStorage.clear();

      navigate('/');
    };

    signOut();
  }, [navigate, updateTokens]);

  return <div></div>;
};

export default SignOut;
