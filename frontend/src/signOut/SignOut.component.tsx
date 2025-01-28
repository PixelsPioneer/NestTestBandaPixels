import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTokenContext } from '../tokenContext/TokenContext';

export const SignOut: React.FC = () => {
  const navigate = useNavigate();
  const { updateToken } = useTokenContext();

  useEffect(() => {
    updateToken(null);
    localStorage.removeItem('role');

    navigate('/signin');
  }, []);

  return <div></div>;
};

export default SignOut;
