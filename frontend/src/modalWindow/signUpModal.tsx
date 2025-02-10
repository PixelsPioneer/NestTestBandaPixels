import React, { useState } from 'react';

import axios from 'axios';

import { apiEndpoints } from '../constants/constants';
import { toastError, toastSuccess, toastWarning } from '../notification/ToastNotification.component';
import styles from './signup.module.css';

interface SignupFormProps {}

export const SignUpForm: React.FC<SignupFormProps> = ({}) => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toastWarning('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toastWarning('Passwords do not match!');
      return;
    }

    if (formData.login.length < 4) {
      toastWarning('Login must be at least 4 characters long.');
      return;
    }

    try {
      const response = await axios.post(apiEndpoints.auth.signUp, {
        login: formData.login,
        password: formData.password,
      });

      toastSuccess('Signup successful! You can now log in.');
    } catch (err: any) {
      toastError(err.response?.data?.message || 'An error occurred during signup.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={styles.inputGroup}>
          <label htmlFor="login" className={styles.label}>
            Login
          </label>
          <input
            type="text"
            name="login"
            id="login"
            value={formData.login}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
