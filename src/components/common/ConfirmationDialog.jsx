import React from 'react';
import styles from './ConfirmationDialog.module.css';

const ConfirmationDialog = ({ open, handleClose, handleConfirm, roleName }) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Confirm Deletion</h2>
        </div>
        <div className={styles.modalBody}>
          <p>Are you sure you want to delete? This action cannot be undone.</p>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleConfirm} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
