import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Segment } from 'semantic-ui-react'
import styles from './modal.module.scss'

interface ModalContentProps {
  children: React.ReactNode
  handleClose: () => void
  open: boolean
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
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
