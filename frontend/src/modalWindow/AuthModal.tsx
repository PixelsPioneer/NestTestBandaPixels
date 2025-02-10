import React, { Suspense, useEffect, useState } from 'react';
import Modal from 'react-modal';

import styles from './authModal.module.css';

Modal.setAppElement('#root');

const SignInForm = React.lazy(() => import('./signInModal').then(module => ({ default: module.default })));
const SignUpForm = React.lazy(() => import('./signUpModal').then(module => ({ default: module.default })));

interface AuthModalProps {
  isSignIn: boolean;
  isOpen: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isSignIn, isOpen }) => {
  const [activeTab, setActiveTab] = useState(isSignIn);

  useEffect(() => {
    setActiveTab(isSignIn);
  }, [isSignIn]);

  return (
    <Modal isOpen={isOpen} className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.toggleButtons}>
          <button
            onClick={() => setActiveTab(true)}
            className={`${styles.toggleButton} ${activeTab ? styles.active : ''}`}>
            Sign In
          </button>
          <button
            onClick={() => setActiveTab(false)}
            className={`${styles.toggleButton} ${!activeTab ? styles.active : ''}`}>
            Sign Up
          </button>
        </div>

        <Suspense fallback={<div>Loading...</div>}>{activeTab ? <SignInForm /> : <SignUpForm />}</Suspense>
      </div>
    </Modal>
  );
};

export default AuthModal;
