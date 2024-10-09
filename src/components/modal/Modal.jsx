import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

function Modal({ children }) {
  return ReactDOM.createPortal(
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>{children}</div>
    </div>,
    document.body
  );
}

export default Modal;
