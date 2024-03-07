import { useAuth } from 'src/context/AuthContext'
import styles from './footer.module.scss'

export const Footer = () => {
  const { currentUser } = useAuth()
  const content = `Logged In As: ${currentUser?.displayName} (${currentUser?.email})`
  return (
    <div className={styles.footer}>
      <div className={styles.text}>{content}</div>
    </div>
  )
}
