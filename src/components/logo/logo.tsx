import logo from 'src/assets/logo.png'
import styles from './logo.module.scss'

export const Logo = () => {
  return (
    <div className={styles.content}>
      <div className={styles.header}>Just A Timer</div>
      <img src={logo} alt='logo' style={{ width: '100px' }} />
    </div>
  )
}
