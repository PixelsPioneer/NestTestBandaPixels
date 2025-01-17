import { FC, ReactNode, useEffect } from 'react';
import styles from './modal.module.css';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  children?: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isVisible, onClose, onConfirm, title, children }) => {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackgroundClick}>
      <div className={styles.modalContent}>
        {title && <h2 className={styles.modalTitle}>{title}</h2>}
        <div className={styles.modalBody}>{children}</div>
        <div className={styles.modalFooter}>
          <button
            className={`${styles.modalButton} ${styles.modalButtonConfirm}`}
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className={`${styles.modalButton} ${styles.modalButtonClose}`}
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
