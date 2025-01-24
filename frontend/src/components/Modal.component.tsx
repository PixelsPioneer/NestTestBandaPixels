import type { FC, ReactNode } from 'react';
import React, { useEffect } from 'react';

import { ModalFooterButtons } from './ModalFooterButtons.component';
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
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
  }, [isVisible]);

  if (!isVisible) {
    return <></>;
  }

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
          <ModalFooterButtons onConfirm={onConfirm || onClose} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};
