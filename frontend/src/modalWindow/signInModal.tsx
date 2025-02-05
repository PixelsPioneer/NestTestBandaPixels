import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import { toastError, toastSuccess } from '../notification/ToastNotification.component';
import { useTokenContext } from '../tokenContext/TokenContext';
import styles from './signin.module.css';

interface SignInFormProps {
  onClose: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onClose }) => {
  const { updateToken } = useTokenContext();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      };
    },
    onSuccess: data => {
      updateToken(data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('role', data.role);
      toastSuccess('Sign-In successful!');
      onClose();
      navigate('/');
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toastError('Invalid login or password');
      } else {
        toastError('Error pls try again');
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
