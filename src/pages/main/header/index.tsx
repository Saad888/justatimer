import logo from 'src/assets/logo.png'
import styles from './header.module.scss'
import { Button } from 'semantic-ui-react'
import { signOutWithGoogle } from 'src/services/auth'

export const Header = () => {
  return (
    <div className={styles.headerContent}>
      <div className={styles.contentSet}>
        <img src={logo} alt='logo' style={{ width: '35px', marginRight: 30 }} />
        <div className={styles.header}>Just A Timer</div>
      </div>
      <Button color='google plus' onClick={signOutWithGoogle}>Logout</Button>
    </div>
  )
}
