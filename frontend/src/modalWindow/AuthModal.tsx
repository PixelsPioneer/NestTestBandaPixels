import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import styles from './authModal.module.css';
import { SignInForm } from './signInModal';
import { SignUpForm } from './signUpModal';

Modal.setAppElement('#root');

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSignIn: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, isSignIn }) => {
  const [activeTab, setActiveTab] = useState(isSignIn);

  useEffect(() => {
    setActiveTab(isSignIn);
  }, [isSignIn]);

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={handleModalClose} className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleModalClose}>
          &times;
        </button>
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
        {activeTab ? <SignInForm onClose={handleModalClose} /> : <SignUpForm onClose={handleModalClose} />}
      </div>
    </Modal>
  );
};

export default AuthModal;
