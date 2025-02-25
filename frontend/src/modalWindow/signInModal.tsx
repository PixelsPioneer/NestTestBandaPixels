import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import { useTokenContext } from '../context/TokenContext';
import { toastError, toastSuccess } from '../notification/ToastNotification.component';
import styles from './signin.module.css';

interface SignInFormProps {}

export const SignInForm: React.FC<SignInFormProps> = ({}) => {
  const { updateTokens } = useTokenContext();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationFn: async ({ login, password }: { login: string; password: string }) => {
      const response = await axios.post(apiEndpoints.auth.signIn, { login, password });

      const profileResponse = await axios.get(apiEndpoints.auth.profile, {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      });

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        role: profileResponse.data.role,
        user_id: profileResponse.data.sub,
      };
    },
    onSuccess: data => {
      updateTokens(data.access_token, data.refresh_token, data.role);

      localStorage.setItem('user_id', data.user_id);

      toastSuccess('Sign-In successful!');
      navigate('/');
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toastError('Invalid login or password');
      } else {
        toastError('Error, please try again');
      }
    },
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signInMutation.mutate({ login, password });
  };

  return (
    <form onSubmit={handleSignIn} className={styles.form}>
      <div className={styles.inputGroup}>
        <label>Login</label>
        <input type="text" value={login} onChange={e => setLogin(e.target.value)} required />
      </div>
      <div className={styles.inputGroup}>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div className={styles.buttonConfirm}>
        <button type="submit" className={styles.button} disabled={signInMutation.isPending}>
          {signInMutation.isPending ? 'Signing In...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
