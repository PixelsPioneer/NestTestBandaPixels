import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import { useTokenContext } from '../tokenContext/TokenContext';

export const SignOut: React.FC = () => {
  const navigate = useNavigate();
  const { updateToken } = useTokenContext();

  useEffect(() => {
    const signOut = async () => {
      try {
        await axios.delete(apiEndpoints.products.productClearCache());
      } catch (error) {
        console.error('Error clearing product cache:', error);
      }

      updateToken(null);
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('role');

      navigate('/');
    };

    signOut();
  }, [navigate, updateToken]);

  return <div></div>;
};

export default SignOut;
