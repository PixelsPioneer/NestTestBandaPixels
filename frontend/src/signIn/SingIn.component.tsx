import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import { toastSuccess } from '../notification/ToastNotification.component';
import { useTokenContext } from '../tokenContext/TokenContext';
import styles from './signin.module.css';

export const SignIn: React.FC = () => {
  const { updateToken } = useTokenContext();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const signInMutation = useMutation({
    mutationFn: async ({ login, password }: { login: string; password: string }) => {
      const response = await axios.post(apiEndpoints.auth.signIn, {
        login,
        password,
      });

      const profileResponse = await axios.get(apiEndpoints.auth.profile, {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      });

      return {
        access_token: response.data.access_token,
        role: profileResponse.data.role,
      };
    },
    onSuccess: data => {
      updateToken(data.access_token);
      localStorage.setItem('role', data.role);
      toastSuccess('Sign-In successful!');
      navigate('/');
    },
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    signInMutation.mutate({ login, password });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSignIn} className={styles.form}>
        <h2>Sign In</h2>
        <div className={styles.inputGroup}>
          <label>Login</label>
          <input type="text" value={login} onChange={e => setLogin(e.target.value)} required />
        </div>
        <div className={styles.inputGroup}>
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className={styles.button}>
          <p> Sign In</p>
        </button>
      </form>
    </div>
  );
};
