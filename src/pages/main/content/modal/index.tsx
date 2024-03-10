import Modal from '@mui/material/Modal'
import styles from './modal.module.scss'

interface ModalContentProps {
  children: React.ReactNode
  handleClose: () => void
  open: boolean
}

export const ModalContent = ({
  children,
  handleClose,
  open
}: ModalContentProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <div className={styles.modalContent}>{children}</div>
    </Modal>
  )
}
