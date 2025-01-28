import React from 'react';

import styles from './modal.module.css';

interface ModalFooterButtonsProps {
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel?: string;
  closeLabel?: string;
}

export const ModalFooterButtons: React.FC<ModalFooterButtonsProps> = ({
  onConfirm,
  onClose,
  confirmLabel = 'Yes',
  closeLabel = 'No',
}) => {
  return (
    <div className={styles.modalFooter}>
      <button className={`${styles.modalButton} ${styles.modalButtonConfirm}`} onClick={onConfirm}>
        {confirmLabel}
      </button>
      <button className={`${styles.modalButton} ${styles.modalButtonClose}`} onClick={onClose}>
        {closeLabel}
      </button>
    </div>
  );
};
